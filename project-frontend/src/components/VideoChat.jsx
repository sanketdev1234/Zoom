import React, { useState, useEffect } from 'react';
import { ArrowLeft, Mic, MicOff, Video, VideoOff, Maximize2, Minimize2 } from 'lucide-react';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useRef } from 'react';
import axios from 'axios';

const socket = io.connect("http://localhost:8080", { withCredentials: true });

function VideoChat() {
    const { meetid, joinid } = useParams();
    const [displayName, setdisplayName] = useState("");
    const [user, setuser] = useState(null);
    const [localStream, setLocalStream] = useState(null);
    const [remoteStreams, setRemoteStreams] = useState({});

    const [fullScreenVideo, setFullScreenVideo] = useState(null);
    const [isAudioEnabled, setIsAudioEnabled] = useState(true);
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);

    const localVideoRef = useRef();
    const peerConnections = useRef({});
    const navigate = useNavigate();
    const politeRef = useRef({}); // Fixed: was politeRef
    const makingoffer = useRef({});
    const ignoreoffer = useRef({});

    useEffect(() => {
        async function checkuser() {
            await axios.get("/auth/authstatus", { withCredentials: true }).then((response) => {
                console.log("the response is ", response.data);
                setuser(response.data);
                setdisplayName(response.data.display_name);
                console.log(user);

            }).catch((err) => {
                console.log("the error is ", err);
                navigate("/pagenotfound")
            });
        }
        checkuser();
    }, [displayName]);



    useEffect(() => {
        async function getMedia() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                setLocalStream(stream);
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }
            }
            catch (error) {
                console.log("error in getting media is ", error);
                window.alert("could access your camera and microphone please allow access");
            }
        }
        getMedia();
        return () => {
            if (localStream) {
                localStream.getTracks().forEach(track => track.stop()); // Fixed: was track.close()
            }
        }
    }, []);

    useEffect(() => {
        if (!localStream) {
            return;
        }
        console.log("the joining video room is  is ", joinid);
        socket.emit("join-video-room", { roomId: joinid, displayName: displayName });

        socket.on("user-joined-video", ({ socketId, displayName }) => {
            console.log("the user is ", displayName, "has joined the video room");
            createPeerConnection(socketId, true);
        });

        socket.on("all-video-users", ({ users }) => {
            console.log("the all users in video calling room are:", users)
            users.forEach((socketId) => {
                createPeerConnection(socketId, false);
            })
        });
        socket.on("video-signal", async ({ sender, data }) => {
            console.log("the signal is ", data.type, "from ", sender);
            await handleSignaling(sender, data);
        });
        socket.on("user-left-video", ({ socketId }) => {
            console.log("the user is ", socketId, "has left the video room");
            handleUserLeft(socketId);
        });
        return () => {
            console.log("the user is leaving the video room");
            socket.emit("leave-video-room", { roomId: joinid });
            Object.values(peerConnections.current).forEach(pc => pc.close());
            socket.off("user-joined-video");
            socket.off("all-video-users");
            socket.off("video-signal");
            socket.off("user-left-video");
            socket.off("leave-video-room");
        }

    }, [localStream, joinid, displayName]); // Fixed: added displayName dependency

    function createPeerConnection(socketId, polite) {
        if (peerConnections.current[socketId]) {
            console.log("the peer connection is already created for the user ", socketId);
            return;
        }
        const pc = new RTCPeerConnection({
            iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
        })
        politeRef.current[socketId] = polite;
        makingoffer.current[socketId] = false;
        ignoreoffer.current[socketId] = false;

        localStream.getTracks().forEach((track) => { // Fixed: was getTrack() - should be getTracks()
            console.log("the track is ", track.kind)
            pc.addTrack(track, localStream);
        });

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                console.log("sending the candidate to the user ", socketId);
                socket.emit("video-signal", {
                    target: socketId,
                    data: {
                        type: "ice-candidate",
                        candidate: event.candidate,
                    }
                })
            }
        }
        pc.ontrack = (event) => {
            console.log("the track is ", event.track.kind, "from the user ", socketId);
            setRemoteStreams((prev) => ({ ...prev, [socketId]: event.streams[0] })); // Fixed: was setRemoteStream

        }

        pc.onnegotiationneeded = async () => {
            try {
                console.log("the negotiation is needed", socketId);
                makingoffer.current[socketId] = true;
                const offer = await pc.createOffer();
                await pc.setLocalDescription(offer);
                socket.emit("video-signal", {
                    target: socketId,
                    data: {
                        type: "offer",
                        sdp: pc.localDescription,
                    }
                });
            }
            catch (error) {
                console.log("the error is ", error);

            }
            finally {
                makingoffer.current[socketId] = false;
            }
        }
        peerConnections.current[socketId] = pc;
        console.log("Peer connection created for:", socketId);
    }

    async function handleSignaling(sender, data) { // Fixed: was handleSignaling({sender,data})
        const pc = peerConnections.current[sender];
        if (!pc) {
            console.log("no peer connection found for the user ", sender);
            return;
        }
        const polite = politeRef.current[sender];
        try {
            if (data.type === "offer") {
                console.log("the offer is received from the user ", sender);

                const offerCollision = makingoffer.current[sender] || pc.signalingState !== "stable"; // Fixed: was === "stable"

                ignoreoffer.current[sender] = !polite && offerCollision;

                if (ignoreoffer.current[sender]) {
                    console.log("the offer is ignored for the user ", sender);
                    return;
                }
                if (offerCollision) {
                    console.log("offer collosion is detected rolling back");
                    await Promise.all([
                        pc.setLocalDescription({ type: "rollback" }),
                        pc.setRemoteDescription(new RTCSessionDescription(data.sdp)) // Fixed: was setRemoteStream
                    ]);

                }
                else {
                    await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
                }
                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);
                socket.emit("video-signal", {
                    target: sender,
                    data: {
                        type: "answer",
                        sdp: pc.localDescription,
                    }
                })
            }
            else if (data.type === "answer") {
                console.log("the answer is received from the user ", sender);
                await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
                console.log("the answer is set for the user ", sender);
            }
            else if (data.type === "ice-candidate") {
                console.log("the ice candidate is received from the user ", sender);
                try {
                    await pc.addIceCandidate(new RTCIceCandidate(data.candidate)); // Fixed: was data.candidate
                }
                catch (error) {
                    if (!ignoreoffer.current[sender]) { // Fixed: was ignoreoffer.current[sender]
                        console.log("the error is ", error);
                        throw error;
                    }
                }
            }
        }
        catch (error) {
            console.log("the error is ", error);
        }
    }

    function handleUserLeft(socketId) {
        console.log("Handling user left:", socketId);

        if (peerConnections.current[socketId]) {
            peerConnections.current[socketId].close();
            delete peerConnections.current[socketId];
        }

        // Fixed: cleanup perfect negotiation state
        delete politeRef.current[socketId];
        delete makingoffer.current[socketId];
        delete ignoreoffer.current[socketId];

        setRemoteStreams((prev) => { // Fixed: was setRemoteStream
            const newStreams = { ...prev };
            delete newStreams[socketId];
            return newStreams
        });
    }


    const handleVideoClick = (videoId) => {
        if (fullScreenVideo === videoId) {
            // Double click - exit full screen
            setFullScreenVideo(null);
        } else {
            // Single click - enter full screen
            setFullScreenVideo(videoId);
        }
    };

    
    const toggleAudio = () => {
        if (localStream) {
            const audioTracks = localStream.getAudioTracks();
            audioTracks.forEach(track => {
                track.enabled = !isAudioEnabled;
            });
        }
        setIsAudioEnabled(!isAudioEnabled);
    };

    const toggleVideo = () => {
        if (localStream) {
            const videoTracks = localStream.getVideoTracks();
            videoTracks.forEach(track => {
                track.enabled = !isVideoEnabled;
            });
        }
        setIsVideoEnabled(!isVideoEnabled);
    };

    const renderVideo = (stream, socketId,isLocal) => {
        const videoId =  socketId;
        const isFullScreen = fullScreenVideo === videoId;
        
        return (
            <div 
                key={videoId}
                className={`${isFullScreen ? 'position-fixed w-100 h-100' : ''}`}
                style={{
                    zIndex: isFullScreen ? 9999 : 1,
                    top: isFullScreen ? 0 : 'auto',
                    left: isFullScreen ? 0 : 'auto',
                    backgroundColor:'#000000'
                }}
            >
                <div className="position-relative">
                    <div 
                        className={`${isFullScreen ? 'w-100 h-100 d-flex align-items-center justify-content-center' : ''}`}
                        onClick={() => handleVideoClick(videoId)}
                        style={{ cursor: 'pointer' }}
                    >
                        <video
                            ref={el=>{
                                if(isLocal){
                                    localVideoRef.current = el;
                                }
                                else if(el && stream){
                                    el.srcObject = stream;
                                }
                            }}
                            autoPlay
                            
                            playsInline
                            className={`${isFullScreen ? '' : 'w-100'} rounded`}
                            style={{
                                height: isFullScreen ? '100vh' : '200px',
                                objectFit: 'cover',
                                backgroundColor: '#1f2937',
                                border: isLocal ? '2px solid #10b981' : '2px solid #3b82f6'
                            }}
                        />
                        
                        {/* Video overlay with user info and controls */}
                        <div 
                            className="position-absolute w-100 h-100 d-flex flex-column justify-content-between"
                            style={{ 
                                background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.5) 100%)',
                                pointerEvents: 'none'
                            }}
                        >
                            {/* Top overlay */}
                            <div className="p-2">
                                <span className="badge bg-dark text-white">
                                    {isLocal ? `You (${displayName})` : `User ${socketId?.slice(0, 6)}`}
                                </span>
                                {isFullScreen && (
                                    <button 
                                        className="btn btn-dark btn-sm position-absolute top-0 end-0 m-2"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setFullScreenVideo(null);
                                        }}
                                        style={{ pointerEvents: 'auto', zIndex: 10000 }}
                                    >
                                        <Minimize2 size={16} />
                                    </button>
                                )}
                            </div>
                            
                            {/* Bottom overlay */}
                            <div className="p-2 d-flex justify-content-between align-items-end">
                                <div className="d-flex gap-1">
                                    {isLocal && (
                                        <>
                                            <span className={`badge ${isAudioEnabled ? 'bg-success' : 'bg-danger'}`}>
                                                {isAudioEnabled ? <Mic size={12} /> : <MicOff size={12} />}
                                            </span>
                                            <span className={`badge ${isVideoEnabled ? 'bg-success' : 'bg-danger'}`}>
                                                {isVideoEnabled ? <Video size={12} /> : <VideoOff size={12} />}
                                            </span>
                                        </>
                                    )}
                                </div>
                                
                                {!isFullScreen && (
                                    <button 
                                        className="btn btn-dark btn-sm opacity-75"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleVideoClick(videoId);
                                        }}
                                        style={{ pointerEvents: 'auto' }}
                                    >
                                        <Maximize2 size={12} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    
    return (
        <div 
            className="min-vh-100"
            style={{ 
                backgroundColor: '#000000',
                color: '#ffffff'
            }}
        >
               
            <div className="container-fluid p-3">
                {/* Header */}
                <div className="row mb-4">
                    <div className="col-12">
                        <div className="d-flex justify-content-between align-items-center">
                            <button
                                className="btn btn-light d-flex align-items-center gap-2"
                                onClick={() =>  navigate(`/ongoingmeet/${meetid}/${joinid}`)}
                            >
                                <ArrowLeft size={16} />
                                Back To Chats
                            </button>
                            <h4 className="text-white mb-0">Video Chat Room: {joinid}</h4>
                            <div></div> {/* Spacer for flexbox */}
                        </div>
                    </div>
                </div>

                {/* Media Controls */}
                <div className="row mb-4">
                    <div className="col-12">
                        <div className="d-flex justify-content-center gap-3">
                            <button
                                className={`btn ${isAudioEnabled ? 'btn-success' : 'btn-danger'} d-flex align-items-center gap-2`}
                                onClick={toggleAudio}
                            >
                                {isAudioEnabled ? <Mic size={16} /> : <MicOff size={16} />}
                                {isAudioEnabled ? 'Mute' : 'Unmute'}
                            </button>
                            <button
                                className={`btn ${isVideoEnabled ? 'btn-success' : 'btn-danger'} d-flex align-items-center gap-2`}
                                onClick={toggleVideo}
                            >
                                {isVideoEnabled ? <Video size={16} /> : <VideoOff size={16} />}
                                {isVideoEnabled ? 'Stop Video' : 'Start Video'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Video Grid */}
                <div className="row g-3">
                    {/* Local Video */}
                    <div className="col-12 col-md-5 offset-md-1">
                        <div className="mb-2">
                            <h6 className="text-white mb-2">Your Video</h6>
                        </div>
                        {renderVideo( localStream,"localuser", true)}
                    </div>

                    {/* Remote Videos */}
                    {Object.entries(remoteStreams).map(([socketId, stream], index) => {
                        if (!stream) return null;
                        
                        return (
                            <div 
                                key={socketId} 
                                className={`col-12 ${index === 0 ? 'col-md-5' : 'col-md-5 offset-md-1'}`}
                            >
                                {index === 0 && (
                                    <div className="mb-2">
                                        <h6 className="text-white mb-2">
                                            Other Participants ({Object.keys(remoteStreams).filter(key => remoteStreams[key]).length})
                                        </h6>
                                    </div>
                                )}
                                {renderVideo(stream, socketId,false)}
                            </div>
                        );
                    })}
                </div>

                {/* Connection Status */}
                <div className="row mt-4">
                    <div className="col-12">
                        <div className="d-flex justify-content-center gap-4">
                            <span className="badge bg-secondary">
                                Local Stream: {localStream ? "✅ Connected" : "❌ Not connected"}
                            </span>
                            <span className="badge bg-secondary">
                                Users: {Object.keys(remoteStreams).filter(key => remoteStreams[key]).length}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Full Screen Video Overlay */}
            {fullScreenVideo && (
                <div className="position-fixed w-100 h-100 bg-dark d-flex align-items-center justify-content-center" style={{ top: 0, left: 0, zIndex: 9998 }}>
                    <div className="text-center">
                        <p className="text-white mb-2">Click to exit full screen • Double-click to toggle</p>
                    </div>
                </div>
            )}

            <style jsx>{`
                .min-vh-100 {
                    min-height: 100vh;
                }
                
                video {
                    transition: all 0.3s ease;
                }
                
                video:hover {
                    transform: scale(1.02);
                }
                
                .btn {
                    transition: all 0.2s ease;
                }
                
                .btn:hover {
                    transform: translateY(-1px);
                }
                
                .position-relative:hover .position-absolute {
                    opacity: 1;
                }
                
                .badge {
                    font-size: 0.75em;
                }
                
                @media (max-width: 767.98px) {
                    video {
                        height: 250px !important;
                    }
                }
            `}</style>
        </div>
    );
}

export default VideoChat;

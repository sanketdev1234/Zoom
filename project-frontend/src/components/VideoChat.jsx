import React, { useState, useEffect } from 'react';
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
    const [remoteStreams, setRemoteStreams] = useState({}); // Fixed: was remoteStream
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
                createPeerConnection(socketId, false); //B is making peer connection to A (A is polite) ,  B is new user joining the room who is impolite
            })
        });

        socket.on("video-signal", async ({ sender, data }) => {
            console.log("the signal is ", data.type, "from ", sender); // B receiving signal from A
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
        politeRef.current[socketId] = polite; // it means suppose we have two peer A and B , A is polite and B is impolite , peer calling this function is A , so A is polite to B
        makingoffer.current[socketId] = false;
        ignoreoffer.current[socketId] = false;

        localStream.getTracks().forEach((track) => { // Fixed: was getTrack() - should be getTracks() , suppose we have two peer A and B , A is polite and B is impolite , peer calling this function is A , so A's local stream tracks are added to peer connection
            console.log("the track is ", track.kind)
            pc.addTrack(track, localStream);
        });

        pc.onicecandidate = (event) => { // suppose we have two peer A and B , peer calling this function is A and A is sending its ice candidate to B
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
                makingoffer.current[socketId] = true; //A is making offer to B
                const offer = await pc.createOffer(); 
                await pc.setLocalDescription(offer); // suppose we have two peer A and B , peer calling this function is A and A is sending its offer to B
                socket.emit("video-signal", { 
                    target: socketId,
                    data: {
                        type: "offer",
                        sdp: pc.localDescription, // A is sending its offer sdp to B and B will set it as remote description and A set its local description
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
        peerConnections.current[socketId] = pc; // A to be connected to B
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

    return (
        <div style={{ 
            padding: "20px", 
            backgroundColor: "#000000", 
            color: "#ffffff",
            minHeight: "100vh",
            margin: 0
        }}>
            <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center", 
                marginBottom: "20px" 
            }}>
                <button
                    onClick={() => navigate(`/ongoingmeet/${meetid}/${joinid}`)}
                    style={{
                        backgroundColor: "#f3f4f6",
                        color: "#374151",
                        border: "none",
                        borderRadius: "8px",
                        padding: "10px 15px",
                        fontSize: "14px",
                        fontWeight: "500",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        transition: "all 0.2s ease"
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.backgroundColor = "#e5e7eb";
                        e.target.style.transform = "translateY(-1px)";
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.backgroundColor = "#f3f4f6";
                        e.target.style.transform = "translateY(0)";
                    }}
                >
                    ← Back To Chats
                </button>
                <h2 style={{ color: "#ffffff", margin: 0 }}>Video Chat Room: {joinid}</h2>
            </div>

            <div style={{ marginBottom: "20px" }}>
                <h3 style={{ color: "#ffffff", marginBottom: "10px" }}>Your Video</h3>
                <video
                    ref={localVideoRef}
                    autoPlay
                    muted
                    playsInline
                    style={{
                        width: "300px",
                        height: "225px",
                        border: "2px solid #10b981",
                        borderRadius: "8px",
                        backgroundColor: "#1f2937"
                    }}
                />
            </div>

            <div>
                <h3 style={{ color: "#ffffff", marginBottom: "10px" }}>Other Participants ({Object.keys(remoteStreams).length})</h3> {/* Fixed: was remoteStream */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                    {Object.entries(remoteStreams).map(([socketId, stream]) => ( // Fixed: was remoteStream
                        <div key={socketId}>
                            <video
                                autoPlay
                                playsInline
                                ref={el => {
                                    if (el) el.srcObject = stream;
                                }}
                                style={{
                                    width: "300px",
                                    height: "225px",
                                    border: "2px solid #3b82f6",
                                    borderRadius: "8px",
                                    backgroundColor: "#1f2937"
                                }}
                            />
                            <p style={{ textAlign: "center", margin: "5px 0", color: "#ffffff" }}>
                                User {socketId.slice(0, 6)}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ marginTop: "20px" }}>
                <p style={{ color: "#ffffff" }}>Local Stream: {localStream ? "✅ Connected" : "❌ Not connected"}</p>
                <p style={{ color: "#ffffff" }}>Remote Users: {Object.keys(remoteStreams).length}</p> {/* Fixed: was remoteStream */}
            </div>
        </div>
    );

}
export default VideoChat;
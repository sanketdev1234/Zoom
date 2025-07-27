import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useRef } from 'react';
import axios from 'axios';
import { Promise } from 'mongoose';
const socket=io.connect("http://localhost:8080",{withCredentials:true}); // here socketID that we are using we get it from the bavkend server of socket ie when client connect the its new socket.id is created and in this we have socket.emit joining  video room and socket.on user-joined-video and hence we get socketId as a parametr from server;
function VideoChat(){

    const { meetid,joinid } = useParams();
    const [displayName,setdisplayName]=useState("");
    const [user,setuser]=useState(null);
    const [localStream,setLocalStream]=useState(null);
    const [remoteStream,setRemoteStream]=useState({});
    const localVideoRef=useRef();
    const peerConnections=useRef({});
    const navigate=useNavigate();
    const politeRef=useRef();
    const makingoffer=useRef({});
    const ignoreoffer=useRef({});
    
    useEffect(()=>{
        async function checkuser(){
        await axios.get("/auth/authstatus",{withCredentials: true}).then((response)=>{
        console.log("the response is ", response.data);
        setuser(response.data);
        setdisplayName(response.data.display_name);
        console.log(user);
    
        }).catch((err)=>{
        console.log("the error is ",err);
        navigate("/pagenotfound")
        });
        }
        checkuser();
    },[displayName]);

    useEffect(()=>{
    async function getMedia(){
        try{
        const stream=await navigator.mediaDevices.getUserMedia({video:true,audio:true});
        setLocalStream(stream);
        if(localVideoRef.current){
            localVideoRef.current.srcObject=stream;
        }
        }
        catch(error){
        console.log("error in getting media is ",error);
        window.alert("could access your camera and microphone please allow access");
        }
    }
    getMedia();
    return()=>{
        if(localStream){
            localStream.getTracks().forEach(track=>track.close());
        }
    }
    },[]);
    
    useEffect(()=>{
    if(!localStream){
        return;
    }
    console.log("the joining video room is  is ",joinid);
    socket.emit("join-video-room",{roomId:joinid,displayName:displayName});

    socket.on("user-joined-video",({socketId,displayName})=>{
        console.log("the user is ",displayName,"has joined the video room");
        createPeerConnection(socketId, true);
    });

    socket.on("all-video-users",({users})=>{
        console.log("the all users in video calling room are:",users)
        users.forEach((socketId)=>{
            createPeerConnection(socketId, false);
        })
    });
    socket.on("video-signal",async({sender,data})=>{
        console.log("the signal is ",data.type,"from ",sender);
        await handleSignaling(sender, data);
    });
    socket.on("user-left-video",({socketId})=>{
        console.log("the user is ",socketId,"has left the video room");
        handleUserLeft(socketId);
    });
    return()=>{
        console.log("the user is leaving the video room");
        socket.emit("leave-video-room",{roomId:joinid});
        Object.values(peerConnections.current).forEach(pc=>pc.close());
        socket.off("user-joined-video");
        socket.off("all-video-users");
        socket.off("video-signal");
        socket.off("user-left-video");
        socket.off("leave-video-room");
    }

},[localStream,joinid]);

function createPeerConnection(socketId,polite){
    if(peerConnections.current[socketId]){
        console.log("the peer connection is already created for the user ",socketId);
        return;
    }
    const pc= new RTCPeerConnection({
        iceServers:[{urls:"stun:stun.l.google.com:19302"}]
    })
   politeRef.current[socketId]=polite;
   makingoffer.current[socketId]=false;
   ignoreoffer.current[socketId]=false;

   localStream.getTrack().forEach((track)=>{
    console.log("the track is ",track.kind)
    pc.addTrack(track,localStream);
   });

  pc.onicecandidate=(event)=>{
    if(event.candidate){
        console.log("sending the candidate to the user ",socketId);
        socket.emit("video-signal",{
            target:socketId,
            data:{
                type:"ice-candidate",
                candidate:event.candidate,
            }
        })
    }
}
pc.ontrack=(event)=>{
    console.log("the track is ",event.track.kind,"from the user ",socketId);
    setRemoteStream((prev)=>({...prev,[socketId]:event.streams[0]}));

}

pc.onnegotiationneeded=async()=>{
    try{
    console.log("the negotiation is needed",socketId);
    makingoffer.current[socketId]=true;
    const offer=await pc.createOffer();
    await pc.setLocalDescription(offer);
    socket.emit("video-signal",{
        target:socketId,
        data:{
            type:"offer",
            sdp:pc.localDescription,
        }
    });
    }
    catch(error){
console.log("the error is ",error);

    }
    finally{
makingoffer.current[socketId]=false;
    }
}
peerConnections.current[socketId]=pc;
console.log("Peer connection created for:", socketId);
}

async function handleSignaling({sender,data}){
const pc=peerConnections.current[sender];
if(!pc){
    console.log("no peer connection found for the user ",sender);
    return;
}
const polite=politeRef.current[sender];
try{
    if(data.type==="offer"){
        console.log("the offer is received from the user ",sender);

        const offerCollision=makingoffer.current[sender] || pc.signalingState==="stable";

        ignoreoffer.current[sender]=!polite && offerCollision;

        if(ignoreoffer.current[sender]){
        console.log("the offer is ignored for the user ",sender);
        return;
        }
        if(offerCollision){
            console.log("offer collosion is detected rolling back");
            await Promise.all([pc.setLocalDescription({type:"rollback"}),
                pc.setRemoteStream(new RTCSessionDescription(data.sdp))
            ]);

        }
        else{
            await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
        }
        const answer=await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit("video-signal",{
            target:sender,
            data:{
                type:"answer",
                sdp:pc.localDescription,
            }
        })
    }
    else if(data.type==="answer"){
        console.log("the answer is received from the user ",sender);
        await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
        console.log("the answer is set for the user ",sender);
    }
    else if(data.type==="ice-candidate"){
        console.log("the ice candidate is received from the user ",sender);
        try{
            await pc.addIceCandidate(data.candidate);
        }
        catch(error){
            if(ignoreoffer.current[sender]){
            console.log("the error is ",error);
            throw error;
            }
        }
    }
}
catch(error){
    console.log("the error is ",error);
}
}

function handleUserLeft(socketId){
    console.log("Handling user left:", socketId);

    if(peerConnections.current[socketId]){
        peerConnections.current[socketId].close();
        delete peerConnections.current[socketId];
    }
    setRemoteStream((prev)=>{
        const newStreams={...prev};
        delete newStreams[socketId];
        return newStreams
    });
}

return (
    <div style={{ padding: "20px" }}>
<h2>Video Chat Room: {joinid}</h2>

<div style={{ marginBottom: "20px" }}>
        <h3>Your Video</h3>
        <video
    ref={localVideoRef}
    autoPlay
    muted
    playsInline
    style={{
            width: "300px",
            height: "225px",
            border: "2px solid green",
            borderRadius: "8px"
}}
        />
    </div>
    
    <div>
        <h3>Other Participants ({Object.keys(remoteStream).length})</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
    {Object.entries(remoteStream).map(([socketId, stream]) => (
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
                border: "2px solid blue",
                borderRadius: "8px"
                }}
            />
            <p style={{ textAlign: "center", margin: "5px 0" }}>
                User {socketId.slice(0, 6)}
            </p>
            </div>
        ))}
        </div>
    </div>
    
    <div style={{ marginTop: "20px" }}>
        <p>Local Stream: {localStream ? "✅ Connected" : "❌ Not connected"}</p>
        <p>Remote Users: {Object.keys(remoteStream).length}</p>
    </div>
    </div>
);

}
export default VideoChat;
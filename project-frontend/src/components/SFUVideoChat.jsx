import React from "react";
import { useParams,useNavigation } from "react-router-dom";
import {useRef} from "react";
import {useState,useEffect} from "react";
import { ArrowLeft, Mic, MicOff, Video, VideoOff, Maximize2, Minimize2 } from 'lucide-react';
import io from "socket-io-client";
import * as mediaSoupClient from "mediasoup-client";
import axios from "axios";
const socket = io.connect("http://localhost:8080", { withCredentials: true });

function SFUVideoChat(){
    const {meetid,joinid}=useParams();
    const [displayName,setDisplayName]=useState("");
    const [user,setUser]=useState(null);
    const[localStream,setLocalStream]=useState();
    const[remoteStreams,setRemoteStreams]=useState({})
    const [fullScreenVideo, setFullScreenVideo] = useState(null);
    const [isAudioEnabled, setIsAudioEnabled] = useState(true);
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);
    const [isConnected, setIsConnected] = useState(false);

    const localVideoRef=useRef(null);
    const navigate=useNavigate();
    
    //MediaSoup state
    const [sendTransport,setSendTransport]=useState(null);
    const [recvTransport,setRecvTransport]=useState(null);
    const [consumers,setConsumers]=useState(new Map());
    const [producers,setProducers]=useState(new Map());
    const [device,setDevice]=useState(null);

    useEffect(() => {
        async function checkUser() {
            try {
                const response = await axios.get("/auth/authstatus", { withCredentials: true });
                setUser(response.data);
                setDisplayName(response.data.display_name);
            } catch (err) {
                console.log("Auth error:", err);
                navigate("/pagenotfound");
            }
        }
        checkUser();
    }, [displayName]);

    useEffect(() => {
        async function getMedia() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                setLocalStream(stream);
                console.log("the local stream is ", stream);
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

    useEffect(()=>{

        if(!localStream || !displayName)return;

        console.log("joining the sfu video room of id ",joinid);
        Socket.emit("join-sfu-video-room",{roomId:joinid,displayName});

        //mediasoup event handlers
        Socket.on("router-rtp-capabilities",async({rtpCapabilities})=>{
        try{
        const newDevice=await mediaSoupClient.Device();
        await newDevice.load({routerRtpCapabilities:rtpCapabilities});
        setDevice(newDevice);
        console.log("Device loaded with RTP capabilities");
        }
        catch(error){
            console.error("Error loading device:", error);
        }
        });
        
        Socket.on("existing-producers",async({producers})=>{
        console.log("existing producers are ",producers);
        for(const producer of producers){
            await consume(producer.id,producer.kind);
        }
        });

        socket.on("new-producer",async({producerId,kind,peerId})=>{
            console.log("New producer:", producerId, kind);
            await consume(producerId,kind);
        });
        

    },[localStream, joinid, displayName, device, recvTransport]);



    
}

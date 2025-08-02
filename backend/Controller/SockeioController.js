const { Server } = require('socket.io');
const cors=require("cors");
const { set } = require('mongoose');
const userrooms=new Map();
const userset=new Set();
const MediaSoupServer=require("../config/mediasoupServer");
const mediasoupserver=new MediaSoupServer();

mediasoupserver.init().then(()=>{
    console.log("Mediasoup server initialized");
}).catch((error)=>{
    console.error("Error initializing mediasoup server:",error);
});

// Add video room management for p2p
const videoRooms = new Map(); // { roomId: Set(socketId) }
const peerConnections = new Map(); // { socketId: { roomId, displayName } }

//Add video room managment for sfu
const videoRoomsSFU=new Map();
const peerConnectionsSFU=new Map();

module.exports.SocketController = (server) => {
const io = new Server(server,{
    cors:{
        origin:["http://localhost:5173"],
        credentials:true,
        methods:["GET","POST","PATCH","PUT","DELETE"]
    },connectionStateRecovery: {}
});

io.on("connection",(socket)=>{
    console.log("A user connected ",socket.id);

    //list the msg sent by clien
    socket.on('Chat Msg',(msg)=>{
        // Broadcast msg to all users in the meeting (including sender)
        io.to(msg.joinid).emit('Chat Msg',msg);
        // Broadcast a notification to all users in the meeting except the sender
        socket.broadcast.to(msg.joinid).emit('New Notification', {
            joinid: msg.joinid,
            notification: 'New message received',
            from: msg.displayname
        });
    });

    // Listen for edit message event
    socket.on('Edit Msg',(msg)=>{
        io.to(msg.joinid).emit('Edit Msg',msg);
    });
    
    //Listen for deleted messages
    socket.on('Delete Msg',(msg)=>{
        io.to(msg.joinid).emit('Delete Msg',msg);
    });
    
    //listen the request to join meeting room
    socket.on('Join Meeting',({displayname,joinid})=>{
        socket.join(joinid);
        if(!userrooms.has(displayname))userrooms.set(displayname,new Set())
            userrooms.get(displayname).add(joinid);
        userset.add(displayname);
        console.log("the user rooms are",userrooms);
        console.log("the userset is",userset);
        console.log(`user ${displayname} joined the meeting of joining id ${joinid}`)
        io.to(joinid).emit('Online Users',Array.from(userset));
    });
    
    //listen the request to leave the meeting room
    socket.on('Leave Meet',({displayname,joinid})=>{
        socket.leave(joinid);
        if (userrooms.has(displayname)) userrooms.get(displayname).delete(joinid);
        userset.delete(displayname);
        console.log("the user rooms are",userrooms);
        console.log("the userset is",userset);
        console.log(`User ${displayname} left meeting ${joinid}`);
        io.to(joinid).emit('Online Users',Array.from(userset));
    });
    
    // ========== VIDEO SIGNALING EVENTS BOTH FOR PEER TO PEER  ==========
    
    // Handle joining video room
    socket.on('join-video-room', ({ roomId, displayName }) => {
        socket.join(roomId);
        
        // Add user to video room
        if (!videoRooms.has(roomId)) {
            videoRooms.set(roomId, new Set());
        }
        videoRooms.get(roomId).add(socket.id);
        
        // Track user's room and name
        peerConnections.set(socket.id, { roomId, displayName });
        
        console.log(`User ${displayName} joined video room ${roomId}`);
        
        // Notify others in the room
        socket.to(roomId).emit('user-joined-video', { 
            socketId: socket.id, 
            displayName 
        });
        
        // Send list of existing users to the new user
        const otherUsers = Array.from(videoRooms.get(roomId)).filter(id => id !== socket.id);
        socket.emit('all-video-users', { users: otherUsers });
        
        console.log(`Sent ${otherUsers.length} existing users to new joiner`);
    });

    // Relay signaling messages (offer, answer, ICE candidates)
    socket.on('video-signal', ({ target, data }) => {
        console.log(`Relaying signal from ${socket.id} to ${target}:`, data.type);
        io.to(target).emit('video-signal', { 
            sender: socket.id, 
            data 
        });
    });

    // Handle leaving video room
    socket.on('leave-video-room', async({ roomId }) => {
        console.log(`User ${socket.id} leaving video room ${roomId}`);
        try{

            await mediasoupserver.leaveRoom(roomId,socket.id);//for sfu
            socket.leave(roomId);//for p2p
        if (videoRooms.has(roomId)) {
            videoRooms.get(roomId).delete(socket.id);
        }

        peerConnections.delete(socket.id);
        
        // Notify others in the room
        socket.to(roomId).emit('user-left-video', { socketId: socket.id });
        
        console.log(`User ${socket.id} left video room ${roomId}`);
    }
    catch(error){
        console.error("Error leaving video room:",error);
        throw error;
    }
    });
    


    //disconection event 
    socket.on('disconnect',()=>{
        console.log('User disconnected:', socket.id);
        
        // Clean up video rooms
        const userInfo = peerConnections.get(socket.id);
        if (userInfo) {
            const { roomId } = userInfo;
            if (videoRooms.has(roomId)) {
                videoRooms.get(roomId).delete(socket.id);
                socket.to(roomId).emit('user-left-video', { socketId: socket.id });
                console.log(`Cleaned up video room ${roomId} for disconnected user`);
            }
            peerConnections.delete(socket.id);
        }
    });

    socket.on('Rejoin Meetings', ({ displayname }) => {
        const rooms = userrooms.get(displayname);
        if (rooms) {
        rooms.forEach(joinid => {
            socket.join(joinid);
            console.log(`user ${displayname} rejoined meeting ${joinid}`);
        });
        }
    });

    // ========== MEDIASOUP EVENTS ==========

    socket.on("join-sfu-video-room",async({roomId,displayName})=>{
    try{
    const peer=await mediasoupserver.joinRoom(roomId,socket.id,displayName);

        console.log("peer",peer);
    
        if(!videoRoomsSFU.has(roomId)){
        videoRoomsSFU.set(roomId,new Set());
        }
        videoRoomsSFU.get(roomId).add(socket.id);
        peerConnectionsSFU.set(socket.id,{roomId,displayName});

        //notify other users in the room
        socket.to(roomId).emit("user-joined-sfu-video",{socketId:socket.id,displayName})


        //send the rtp capabilities to the peer
        const rtpCapabilities=await mediasoupserver.getRouterRtpCapabilities(roomId);
        socket.emit("router-rtp-capabilities",{rtpCapabilities});
        //send the producers to the peer
        const producers=await mediasoupserver.getProducers(roomId,socket.id);
        socket.emit("existing-producers", { producers });
        console.log(`User ${displayName} joined sfu video room ${roomId}`);
    }
    catch(error){
        console.error("Error joining sfu video room:",error);
        socket.emit("sfu-error",{
            errorMessage:"Failed to join sfu video room"
        });
    }
    });

    socket.on("create-transport",async({roomId,direction})=>{
        try{
        const transport=await mediasoupserver.createWebRtcTransport(roomId,socket.id,direction);
        console.log("transport",transport);
        socket.emit("transport-created",{direction,transport});
        }
        catch(error){
            console.error("Error creating transport:",error);
            socket.emit("sfu-error",{
                errorMessage:"Failed to create transport"
            });
        }
    });

socket.on("connect-transport",async({roomId,direction,dtlsParameters})=>{
try{
await mediasoupserver.connectTransport(roomId,socket.id,direction,dtlsParameters);
socket.emit("transport-connected",{direction});
}
catch(error){
    console.error("Error connecting transport:",error);
    socket.emit("sfu-error",{
        errorMessage:"Failed to connect transport"
    });
}
    });

socket.on("produce",async({roomId,kind,rtpParameters})=>{
    try{
    const {id}=await mediasoupserver.produce(roomId,socket.id,kind,rtpParameters);
    console.log("producer created",id);
    socket.emit("produced",{id,kind});
    socket.to(roomId).emit("new-producer",{produceId:id,peerId:socket.id,kind});
    }
    catch(error){
        console.error("Error producing media:",error);
        socket.emit("sfu-error",{
            errorMessage:"Failed to produce media"
        });
    }
});

socket.on("consume",async({roomId,producerId,rtpCapabilities})=>{
    try{
const consumer=await mediasoupserver.consume(roomId,socket.idproducerId,rtpCapabilities);
socket.emit("consumed",{consumer});
    }
    catch(error){
        console.error("Error creating consumer:",error);
        socket.emit("sfu-error",{
            errorMessage:"Failed to consume media"
        });
    }
});


socket.on("new-consumer",async({roomId,producedId,rtpCapabilities})=>{
    try{
const consumer=await mediasoupserver.consume(roomId,socket.id,producedId,rtpCapabilities);
socket.emit("new-consumer",{consumer});
    }
    catch(error){
        console.error("Error creating consumer:",error);
        socket.emit("sfu-error",{
            errorMessage:"Failed to create new consumer"
        });
    }
});


socket.on("close-producer",async({roomId,producerId})=>{
    try{
        await mediasoupserver.closeProducer(roomId,socket.id,producerId);
        socket.to(roomId).emit("producer-closed",{producerId});
    }
    catch(error){
        console.error("Error closing producer:",error);
    }
});

socket.on("close-consumer",async({roomId,consumerId})=>{
    try{
        await mediasoupserver.closeConsumer(roomId,socket.id,consumerId);
    }
    catch(error){
        console.error("Error closing consumer:",error);
    }
});



});
return io;
};


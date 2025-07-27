const { Server } = require('socket.io');
const cors=require("cors");
const { set } = require('mongoose');
const userrooms=new Map();
const userset=new Set();

// Add video room management
const videoRooms = new Map(); // { roomId: Set(socketId) }
const peerConnections = new Map(); // { socketId: { roomId, displayName } }

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
        console.log(`user ${displayname} joined the meeting of joining id ${joinid}`)
        io.to(joinid).emit('Online Users',Array.from(userset));
    });
    
    //listen the request to leave the meeting room
    socket.on('Leave Meet',({displayname,joinid})=>{
        socket.leave(joinid);
        if (userrooms.has(displayname)) userrooms.get(displayname).delete(joinid);
        userset.delete(displayname);
        console.log(`User ${displayname} left meeting ${joinid}`);
        io.to(joinid).emit('Online Users',Array.from(userset));
    });
    
    // ========== VIDEO SIGNALING EVENTS ==========
    
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
    socket.on('leave-video-room', ({ roomId }) => {
        socket.leave(roomId);
        
        if (videoRooms.has(roomId)) {
            videoRooms.get(roomId).delete(socket.id);
        }
        
        peerConnections.delete(socket.id);
        
        // Notify others in the room
        socket.to(roomId).emit('user-left-video', { socketId: socket.id });
        
        console.log(`User ${socket.id} left video room ${roomId}`);
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


});
return io;
}


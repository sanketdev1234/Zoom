const { Server } = require('socket.io');
const cors=require("cors");
const { set } = require('mongoose');
const userrooms=new Map();
module.exports.SocketController = (server) => {
const io = new Server(server,{
    cors:{
        origin:["http://localhost:5173"],
        methods:["GET","POST","PATCH","PUT","DELETE"]
    },connectionStateRecovery: {}
});

io.on("connection",(socket)=>{
    console.log("A user connected ",socket.id);

    //list the msg sent by clien
    socket.on('Chat Msg',(msg)=>{
        // Broadcast msg to all users in the meeting (including sender)
        io.to(msg.meetid).emit('Chat Msg',msg);
        // Broadcast a notification to all users in the meeting except the sender
        socket.broadcast.to(msg.meetid).emit('New Notification', {
            meetid: msg.meetid,
            notification: 'New message received',
            from: socket.id
        });
    });
    
    //listen the request to join meeting room
    socket.on('Join Meeting',({userid,meetid})=>{
        socket.join(meetid);
        if(!userrooms.has(userid))userrooms.set(userid,new Set())
            userrooms.get(userid).add(meetid);
        console.log(`user ${userid} joined the meeting of id ${meetid}`)
    });
    
    //listen the request to leave the meeting room
    socket.on('Leave Meet',({userid,meetid})=>{
        socket.leave(meetid);
        if (userrooms.has(userid)) userrooms.get(userid).delete(meetid);
        console.log(`User ${userid} left meeting ${meetid}`);
    });
    
    //disconection event 
    socket.on('disconnect',()=>{
        console.log('User disconnected:', socket.id);
    });

    socket.on('Rejoin Meetings', ({ userid }) => {
        const rooms = userrooms.get(userid);
        if (rooms) {
        rooms.forEach(meetid => {
            socket.join(meetid);
            console.log(`user ${userid} rejoined meeting ${meetid}`);
        });
        }
    });
    
});
return io;
}


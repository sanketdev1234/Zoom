const mediasoup=require("mediasoup");
const config={
    worker:{
        
            rtcMinPort: 10000,
            rtcMaxPort: 10100,
            logLevel: 'warn',
            logTags: [
                'info',
                'ice',
                'dtls',
                'rtp',
                'srtp',
                'rtcp'
            ]
    },
    router: {
        mediaCodecs: [
            {
                kind: 'audio',
                mimeType: 'audio/opus',
                clockRate: 48000,
                channels: 2
            },
            {
                kind: 'video',
                mimeType: 'video/VP8',
                clockRate: 90000,
                parameters: {
                    'x-google-start-bitrate': 1000
                }
            },
            {
                kind: 'video',
                mimeType: 'video/H264',
                clockRate: 90000,
                parameters: {
                    'packetization-mode': 1,
                    'profile-level-id': '42e01f',
                    'level-asymmetry-allowed': 1
                }
            }
        ]
    },
        
        webRtcTransport: {
            listenIps: [
                {
                    ip: '0.0.0.0',
                    announcedIp: '127.0.0.1' // Change this to your server's public IP
                }
            ],
            maxIncomingBitrate: 1500000,
            initialAvailableOutgoingBitrate: 1000000
        }
    };

class MediaSoupServer{
constructor(){
    this.worker=null;
    this.router=null;
    this.rooms=new Map();
}
async init(){
    try{

const worker=await mediasoup.createWorker(config.worker);
console.log("the mediasoup worker is ready",worker);
console.log("worker.id ",worker.pid);
this.worker=worker;
this.worker.on("died",()=>{
    console.error('MediaSoup worker died, exiting in 2 seconds... [pid:%d]', this.worker.pid);
    setTimeout(() => process.exit(1), 2000);
})
const router=await worker.createRouter(config.router);
console.log("the mediasoup router is ready",router);
this.router=router;

    }

    catch(error){
        console.error("Error initializing mediasoup server:",error);
        throw error;
    }
}

async createRoom(roomId){
    try{

    if(this.rooms.has(roomId)){
        console.log("room already exist",this.rooms.get(roomId));
        return this.rooms.get(roomId);
    }
    const room={
        roomid:roomId,
        peers:new Map(),
        producers:new Map(),
        consumers:new Map(),
        router:this.router
    }
    this.rooms.set(roomId,room);
    console.log("room created",room);
    return room;
    }
    catch(error){
        console.error("Error creating room:",error);
        throw error;
    }
}


async joinRoom(roomId,socketId,displayName){
    try{
    const room=this.rooms.get(roomId);
    if(!room){
        console.log("room not found",roomId);
        return;
    }
    const peer={
        id:socketId,
        displayName,
        room,
        producers:new Map(),
        consumers:new Map(),
        transports:new Map()
    }
    room.peers.set(socketId,peer);
    console.log("peer joined room",peer);
    return peer;
    }
    catch(error){
        console.error("Error joining room:",error);
        throw error;
    }
}

async leaveRoom(roomId,socketId){
    try{
const room=this.rooms.get(roomId);
if(!room){
    console.log("room not found",roomId);
    return;
}
const peer=room.peers.get(socketId);
if(!peer){
    console.log("peer not found",socketId);
    return;
}

for(let transport of peer.transports.values()){
    transport.close();
}
room.peers.delete(socketId);

console.log("peer left room",socketId);
if(room.peers.size===0){
    this.rooms.delete(roomId);
    console.log(`Room ${roomId} deleted (empty)`);
}

}
    catch(error){
        console.error("Error leaving room:",error);
        throw error;
    }
}

async createWebRtcTransport(roomId,socketId,direction){
try{
const room=this.rooms.get(roomId);
if(!room){
    console.log("room not found",roomId);
    return;
}
const peer=room.peers.get(socketId);
if(!peer){
    console.log("peer not found",socketId);
}
const transport =await room.router.createWebRtcTransport(config.webRtcTransport);
console.log("webRTC transport created",transport);

transport.observer.on("close",()=>{
    console.log("webRTC transport closed",transport);
});
transport.observer.on("dtlsstatechange",(dtlsState)=>{
    if(dtlsState==="failed"){
        console.log(`Transport DTLS state changed to 'closed': ${transport.id}`);
    }
});

peer.transports.set(direction,transport);
return {
    id:transport.id,
    iceParameters:transport.iceParameters,
    iceCandidates:transport.iceCandidates,
    dtlsParameters:transport.dtlsParameters,
    sctpParameters:transport.sctpParameters,
};
}
catch(error){
    console.error("Error creating webRTC transport:",error);
    throw error;
}
}

async connectTransport(roomId,socketId,direction,dtlsParameters){
    try{
    const room=this.rooms.get(roomId);
    if(!room){
        console.log("room not found",roomId);
        return;
    }
    const peer=room.peers.get(socketId);
    if(!peer){
        console.log("peer not found",socketId);
    }
    const transport=peer.transports.get(direction);
    if(!transport){
        console.log("transport not found for the direction :",direction);
        return;
    }
    await transport.connect({dtlsParameters});
    console.log("transport connected",transport);
    
}
    catch(error){
        console.error("Error connecting transport:",error);
        throw error;
    }
}

async produce(roomId,socketId,kind,rtpParameters){
    try{
    const room=this.rooms.get(roomId);
    if(!room){
        console.log("room not found",roomId);
        return;
    }
    const peer=room.peers.get(socketId);
    if(!peer){
        console.log("peer not found",socketId);
        return;
    }
    const transport=peer.transports.get(direction);
    if(!transport){ 
        console.log("transport not found for the direction :",direction);
        return;
    }
    const producer=await transport.produce({kind,rtpParameters});
    console.log("producer created",producer);
    producer.observer.on("close",()=>{
        console.log("producer closed",producer);
    });
    peer.producers.set(producer.id,producer);
    room.producers.set(producer.id,producer);
    return {id:producer.id}
    }
    catch(error){
        console.error("Error producing media:",error);
        throw error;
    }
}

async consume(roomId,socketId,producerId,rtpCapabilities){
    try{
        const room=this.rooms.get(roomId);
        if(!room){
            console.log("room not found",roomId);
            return;
        }
        const peer=room.peers.get(socketId);
        if(!peer){
            console.log("peer not found",socketId);
            return;
        }
        const transport=peer.transports.get(direction);
        if(!transport){ 
            console.log("transport not found for the direction :",direction);
            return;
        }
        const producer=room.producers.get(producerId);
        if(!producer){
            console.log("producer not found",producerId);
            return;
        }
        if(!room.router.canConsume({producerId,rtpCapabilities})){
            console.log("can consume",producerId,rtpCapabilities);
            return;
        }
        const consumer=await transport.consume({producerId,rtpCapabilities,paused:false});
        console.log("consumer created",consumer);
        consumer.observer.on("close",()=>{
            console.log("consumer closed",consumer);
        })
        peer.consumers.set(consumer.id,consumer);
        room.consumers.set(consumer.id,consumer);
        return{
            id:consumer.id,
            producerId:consumer.producerId,
            kind:consumer.kind,
            rtpParameters:consumer.rtpParameters,
            producerPaused:consumer.producerPaused,
            type:consumer.type
        }
    
    }
    catch(error){
        console.error("Error creating consumer:",error);
        throw error;
    }
}


async getRouterRtpCapabilities(roomId){
    try{
        const room=this.rooms.get(roomId);
        if(!room){
            console.log("room not found",roomId);
            return;
        }
        return room.router.rtpCapabilities;
    }
    catch(error){
        console.error("Error getting router rtp capabilities:",error);
        throw error;
    }
}

async getProducers(roomId,socketId){
    try{
        const room=this.rooms.get(roomId);
        if(!room){
            console.log("room not found",roomId);
            return;
        }
        const peer=room.peers.get(socketId);
        if(!peer){
            console.log("peer not found",socketId);
            return;
        }
        const producers=[];
        for(let [pruducerId,producer] of room.producers){
            if(producer.appData.peerId!==socketId){
                producer.push({
                    id:producer.id,
                    kind:producer.kind,
                    peerId:producer.appData.peerId
                });
            }
        }
        return producers;
    }
    catch(error){
        console.error("Error getting producers:",error);
        throw error;
    }
}


async closeProducer(roomId,socketId,producerId){
    try{
        if(!room){
            console.log("room not found",roomId);
            return;
        }
        const peer=room.peers.get(socketId);
        if(!peer){
            console.log("peer not found",socketId);
            return;
        }
        const producer=peer.producers.get(producerId);
        if(producer){
            producer.close();
            peer.producer.delete(producerId);
            room.producers.delete(producerId);
            console.log("producer closed",producerId);
            return true;
        }
    }
    catch(error){
        console.error("Error closing producer:",error);
        throw error;
    }
}


async closeConsumer(roomId,socketId,consumerId){
    try{
        if(!room){
            console.log("room not found",roomId);
            return;
        }
        const peer=room.peers.get(socketId);
        if(!peer){
            console.log("peer not found",socketId);
            return;
        }
        const consumer=peer.consumers.get(consumerId);
        if(consumer){
            consumer.close();
            peer.consumers.delete(consumerId);
            room.consumers.delete(consumerId);
            console.log("consumer closed",consumerId);
            return true;
        }
    }
    catch(error){
        console.error("Error closing consumer:",error);
        throw error;
    }   
}

}   

module.exports=MediaSoupServer;

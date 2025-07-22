import React from "react";
import {useState , useEffect , useRef} from "react";
import { Send, Users, Pencil,Trash2, Smile, Paperclip } from 'lucide-react';
import {io} from "socket.io-client";
import axios from "axios"
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./ScoketChat.css";
const socket=io("http://localhost:8080",{withCredentials:true});

function SocketChat(){
const [user,setuser]=useState({});
const {meetid,joinid}=useParams();
const [displayname,setdisplayname]=useState("");
const [onlineUsers,setonlineUsers] = useState(new Set());
const [Messages,setMessages]=useState([]);
const [Input,setInput]=useState("");
const messagesEndRef=useRef(null);

useEffect(()=>{
  async function checkuser(){
  await axios.get("/auth/authstatus",{withCredentials: true}).then((response)=>{
  console.log("the response is ", response.data);
  setuser(response.data);
  setdisplayname(response.data.display_name);
  console.log(user);

  }).catch((err)=>{
    console.log("the error is ",err);
    Navigate("/pagenotfound")
  });
  }
  checkuser();
},[displayname]);

useEffect(()=>{
  async function checkonlineusers(){
    const response=await axios.get(`/meeting/${meetid}/detail`,{withCredentials: true});
    setonlineUsers(new Set(response.data.Participants.map(user=>user.display_name)));
  }
  checkonlineusers();
},[meetid]);


useEffect(()=>{

    // Join the meeting room
    socket.emit("Join Meeting",{displayname,joinid});
    // Listen for chat messages
    socket.on("Chat Msg",(msg)=>{
    setMessages((prev)=>[...prev,msg]);
    });
    

    // Listen for notifications
    socket.on("New Notification",(data)=>{
        toast.success(data.notification+"from"+data.from);
    });

    // Rejoin rooms on reconnect
    socket.on("connect",()=>{
    socket.emit("Rejoin Meet",({displayname}));
    });

    // Cleanup on unmount(Leave)
    return ()=>{
        socket.emit("Leave Meet",{displayname,joinid});
        socket.off("New Notification");
        socket.off("Chat Msg");
        setonlineUsers((prev)=>{
          const newset=new Set(prev);
          newset.delete(displayname);
          return newset;
        });
    };

},[displayname,joinid]);

useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [Messages]);

  const sendMessage=async (e)=>{
    e.preventDefault();
    if (Input.trim()) {
        const response=await axios.post(`/meeting/${meetid}/chat/new`,{Content:Input}, {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        });
        console.log("the response is sending message",response.data);
        socket.emit("Chat Msg", { meetid,joinid, chatid:response.data._id,displayname, content: Input,time:new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })});
        setInput("");
      }
  };

return (
  <div className=" vh-100 gradient-bg">
    {/* Sidebar Chat Section */}
    <div className="sidebar-bg border-end">
      {/* Chat Header */}
      <div className="p-3 border-bottom gradient-bg">
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-3">
            <div className="user-avatar-bg d-flex align-items-center justify-content-center me-2">
              <Users size={20} color="white" />
            </div>
            <div>
              <h2 className="text-white mb-0" style={{ fontSize: '1.25rem' }}>Team Chat</h2>
              <p className="text-white-50 mb-0" style={{ fontSize: '0.9rem' }}>{Array.from(onlineUsers).length} members online</p>
            </div>
          </div>
        </div>
      </div>
      {/* Online Users */}
      <div className="p-3 border-bottom gradient-bg2">
        <h3 className="text-white-50 mb-2" style={{ fontSize: '1rem', fontWeight: '500' }}>Online Now</h3>
        <div className="d-flex flex-wrap gap-2">
            {Array.from(onlineUsers).map((user, idx) => (
            <span key={idx} className="d-flex align-items-center user-pill me-2 mb-2 px-3 py-1 rounded-pill">
              <span className="online-dot me-2"></span>
              <span className="text-white" style={{ fontSize: '0.96rem' }}>{user}</span>
            </span>
          ))}
        </div>
      </div>
      {/* Messages Area */}
      <div className="flex-grow-1 position-relative overflow-auto p-3 messages-area">

        <div className="position-relative z-1">
          {Messages.map((message,idx) => (
            <div key={idx} className={`d-flex mb-3 ${message.displayname==displayname ? 'justify-content-end' : 'justify-content-start'}`}>
              <div className={`message-bubble ${message.displayname==displayname ? 'own-msg' : 'other-msg'}`}>
                {message.displayname!=displayname && (
                  <p className="text-white-50 mb-1" style={{ fontSize: '0.8rem', fontWeight: 500 }}>{message.displayname}</p>
                )}
                <div>
                  <p className="mb-1" style={{ fontSize: '1rem' }}>{message.content}</p>
                  <span className={`d-block text-end`} style={{ fontSize: '0.8rem', color: message.displayname==displayname ? '#d1c4e9' : '#b0b0b0' }}>{message.time}</span>
                </div>  
                {/* {message.displayname==displayname && (
                  <div className="d-flex align-items-center justify-content-end">
                    <form onSubmit={editMessage(msg.chatid,msg.meetid)}> 
                      <button className="icon-btn"><Pencil size={20} color="#dee2e6" /></button>
                    </form>
                    <form onSubmit={deleteMessage(msg.chatid,msg.meetid)}>
                      <button className="icon-btn"><Trash2 size={20} color="#dee2e6" /></button>
                    </form>
                  </div>
                )} */}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef}></div>
        </div>
      </div>
      {/* Message Input */}
      <form className="p-3 border-top gradient-bg2" onSubmit={sendMessage} autoComplete="off">
        <div className="d-flex align-items-center gap-2">
          <button type="button" className="icon-btn"><Paperclip size={20} color="#dee2e6" /></button>
          <button type="button" className="icon-btn"><Smile size={20} color="#dee2e6" /></button>
          <input
            type="text"
            value={Input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && sendMessage(e)}
            placeholder="Type your message..."
            className="form-control bg-transparent text-white message-input"
          />
          <button 
            type="submit"
            className="btn send-btn d-flex align-items-center justify-content-center ms-1"
            disabled={!Input.trim()}
          >
            <Send size={20} color="white" />
          </button>
        </div>
      </form>
    </div>
    <ToastContainer position="top-right" autoClose={3000} /> 
  </div>
);
};

export default SocketChat;

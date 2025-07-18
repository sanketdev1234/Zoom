import React from "react";
import {useState , useEffect , useRef} from "react";
import {io} from "socket.io-client";

const socket=io("http://localhost:8080",{withCredentials:true});

function SocketChat({userid,meetid}){
const [Messages,setMessages]=useState([]);
const [Notification,setNotification]=useState("");
const [Input,setInput]=useState("");
const messagesEndRef=useRef(null);

useEffect(()=>{

    // Join the meeting room
    socket.emit("Join Meeting",{userid,meetid});
    
    // Listen for chat messages
    socket.on("Chat Msg",(msg)=>{
    setMessages((prev)=>[...prev,msg]);
    });
    
    // Listen for notifications
    socket.on("New Notification",(data)=>{
        setNotification(data.notification);
        setTimeout(() => {
            setNotification("");
        }, 2000);
    });

    // Rejoin rooms on reconnect
    socket.on("connect",()=>{
    socket.emit("Rejoin Meet",({userid}));
    });

    // Cleanup on unmount(Leave)
    return ()=>{
        socket.emit("Leave Meet",{userid,meetid});
        socket.off("New Notification");
        socket.off("Chat Msg");
    };

},[userid,meetid]);

useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [Messages]);

  const sendMessage=(e)=>{
    e.preventDefault();
    if (Input.trim()) {
        socket.emit("Chat Msg", { meetid, userid, content: Input });
        setInput("");
      }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto" }}>
      <h2>Meeting Chat</h2>
      {Notification && <div style={{ color: "green" }}>{Notification}</div>}
      <div style={{ border: "1px solid #ccc", height: 200, overflowY: "auto", marginBottom: 10 }}>
        {Messages.map((msg, idx) => (
          <div key={idx}>
            <b>{msg.userid}:</b> {msg.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage}>
        <input
          value={Input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          style={{ width: "80%" }}
        />
        <button type="submit" style={{ width: "18%" }}>Send</button>
      </form>
    </div>
  );
}
export default SocketChat
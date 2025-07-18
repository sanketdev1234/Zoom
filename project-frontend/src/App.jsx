import React, { useState } from "react";
import SocketChat from "../src/components/ScoketChat";

function App() {
  const [userid, setUserid] = useState("");
  const [meetid, setMeetid] = useState("");
  const [joined, setJoined] = useState(false);

  const handleJoin = (e) => {
    e.preventDefault();
    if (userid && meetid) setJoined(true);
  };

  if (!joined) {
    return (
      <form onSubmit={handleJoin} style={{ maxWidth: 300, margin: "auto", marginTop: 50 }}>
        <h3>Join Meeting</h3>
        <input
          placeholder="User ID"
          value={userid}
          onChange={e => setUserid(e.target.value)}
          style={{ width: "100%", marginBottom: 10 }}
        />
        <input
          placeholder="Meeting ID"
          value={meetid}
          onChange={e => setMeetid(e.target.value)}
          style={{ width: "100%", marginBottom: 10 }}
        />
        <button type="submit" style={{ width: "100%" }}>Join</button>
      </form>
    );
  }

  return <SocketChat userid={userid} meetid={meetid} />;
}

export default App;
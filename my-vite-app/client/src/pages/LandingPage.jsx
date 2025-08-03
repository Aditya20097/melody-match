

import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import "./LandingPage.css";
const socket = io(import.meta.env.VITE_SERVER_URL, {
  transports: ["websocket"],     
  withCredentials: true         
});
 

// backend must run here


export default function LandingPage() {
  const [chatMessages, setChatMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [uuserId] = useState(() => Math.random().toString(36).substring(2, 9));
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("receiveMessage", (msgObj) => {
      setChatMessages((prev) => [
        ...prev,
        { text: msgObj.text, isOwn: msgObj.senderId === uuserId }
      ]);
    });
    return () => socket.off("receiveMessage");
  }, [uuserId]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    socket.emit("sendMessage", { text: inputMessage.trim(), senderId: uuserId });
    setInputMessage("");
  };

  return (
    <div className="landing-container">
      
     

      <h1>Chat. Chill. Connect. 🎧</h1>

      <div className="cards">
        <div className="music-card">
          <h2>Because every song sounds better with someone.</h2>
          <iframe
            title="spotify-romantic"
            src="https://open.spotify.com/embed/playlist/37i9dQZF1E36OuWlNurbnH?utm_source=generator&theme=0"
            width="100%"
            height="152"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          ></iframe>
          <p className="small-note">🎵 Spotify Playlist</p>

          <h3 className="cta-title">Upcoming Concerts</h3>
          <button
            className="concert-btn"
            onClick={() => navigate("/music/concerts")}
          >
            Concerts
          </button>
        </div>

        <div className="chat-card">
          <h3>Your vibe. Their vibe. One chat away..</h3>

          <div className="messages">
            {chatMessages.map((msg, idx) => (
              <p
                key={idx}
                className={msg.isOwn ? "own-message" : "other-message"}
              >
                {msg.text}
              </p>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="chat-input-row">
            <input
              type="text"
              placeholder="Type a message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
            />
            <button type="submit">Send</button>
          </form>
        </div>
      </div>
    </div>
  );
}

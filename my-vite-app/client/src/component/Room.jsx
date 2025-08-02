import { useEffect, useState } from "react";
import axios from "axios";
import socket from "./Socket";

export default function Room() {
  const [player, setPlayer] = useState(null);
  const [deviceId, setDeviceId] = useState(null);
  const [token, setToken] = useState(null);
  const [trackUri, setTrackUri] = useState("");
  const [messages, setMessages] = useState([]);
  const [currentMsg, setCurrentMsg] = useState("");

  const roomId = "room1";

  useEffect(() => {
    const accessToken = localStorage.getItem("spotify_access_token");
    if (!accessToken) {
      console.error("No Spotify access token found.");
      return;
    }
    setToken(accessToken);

    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const spotifyPlayer = new window.Spotify.Player({
        name: "Harmonic Soul Player 🎧",
        getOAuthToken: cb => cb(accessToken),
        volume: 0.8,
      });

      spotifyPlayer.addListener("ready", ({ device_id }) => {
        console.log("✅ Spotify Player is ready:", device_id);
        setDeviceId(device_id);
      });

      spotifyPlayer.addListener("not_ready", ({ device_id }) => {
        console.log("❌ Device ID has gone offline:", device_id);
      });

      spotifyPlayer.connect();
      setPlayer(spotifyPlayer);
    };
  }, []);

  // Join room and handle events
  useEffect(() => {
    socket.emit("join_music_room", roomId);

    socket.on("play_track", async (uri) => {
      console.log("📡 Received play_track:", uri);
      setTrackUri(uri);
      await axios.put(
        `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
        { uris: [uri] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    });

    socket.on("pause_track", () => {
      console.log("⏸ Received pause");
      player?.pause();
    });

    socket.on("receive_message", (data) => {
      setMessages(prev => [...prev, data]);
    });

    return () => {
      socket.off("play_track");
      socket.off("pause_track");
      socket.off("receive_message");
    };
  }, [deviceId, token, player]);

  const handlePlay = async () => {
    if (!trackUri) return alert("Paste a Spotify URI to play!");
    await axios.put(
      `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
      { uris: [trackUri] },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    socket.emit("play_track", { roomId, uri: trackUri });
  };

  const handlePause = () => {
    player?.pause();
    socket.emit("pause_track", roomId);
  };

  const sendMessage = () => {
    if (!currentMsg.trim()) return;
    const msgData = {
      room: roomId,
      text: currentMsg,
      sender: "You", // Replace with real username later
      time: new Date().toLocaleTimeString(),
    };
    socket.emit("send_message", msgData);
    setMessages(prev => [...prev, msgData]); // Optimistic UI
    setCurrentMsg("");
  };

  return (
    <div style={styles.container}>
      <h2>🎧 Group Music Room</h2>

      <input
        type="text"
        placeholder="Paste Spotify track URI"
        value={trackUri}
        onChange={(e) => setTrackUri(e.target.value)}
        style={styles.input}
      />

      <div style={styles.controls}>
        <button onClick={handlePlay} style={styles.btn}>▶️ Play</button>
        <button onClick={handlePause} style={styles.btn}>⏸ Pause</button>
      </div>

      <p>Room ID: <strong>{roomId}</strong></p>
      {deviceId && <p>🎵 Connected to device: <strong>{deviceId}</strong></p>}

      <hr style={{ border: "1px solid #fff3", margin: "20px 0" }} />

      <h3>💬 Room Chat</h3>
      <div style={styles.chatBox}>
        {messages.map((msg, idx) => (
          <div key={idx} style={styles.chatMsg}>
            <strong>{msg.sender}</strong>: {msg.text} <span style={styles.time}>({msg.time})</span>
          </div>
        ))}
      </div>

      <div style={styles.chatInput}>
        <input
          type="text"
          placeholder="Type a message..."
          value={currentMsg}
          onChange={(e) => setCurrentMsg(e.target.value)}
          style={styles.input}
        />
        <button onClick={sendMessage} style={styles.btn}>📨 Send</button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "Poppins, sans-serif",
    textAlign: "center",
    padding: "40px",
    color: "white",
    background: "linear-gradient(135deg, #1b0034, #42006c)",
    minHeight: "100vh",
  },
  input: {
    padding: "10px",
    width: "60%",
    borderRadius: "8px",
    border: "none",
    marginBottom: "10px",
    fontSize: "16px",
  },
  controls: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginBottom: "20px",
  },
  btn: {
    padding: "10px 20px",
    fontSize: "18px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#ff0080",
    color: "white",
    cursor: "pointer",
  },
  chatBox: {
    maxHeight: "300px",
    overflowY: "auto",
    padding: "10px",
    border: "1px solid #fff3",
    borderRadius: "10px",
    marginBottom: "10px",
    backgroundColor: "#ffffff11",
    width: "80%",
    margin: "auto",
    textAlign: "left",
  },
  chatMsg: {
    marginBottom: "10px",
  },
  time: {
    fontSize: "12px",
    color: "#ccc",
    marginLeft: "5px",
  },
  chatInput: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginTop: "10px",
  },
};

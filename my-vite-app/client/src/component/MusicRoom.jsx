// import { useEffect, useState } from "react";
// import SearchAndPlay from "./SearchAndPlay";
// import NowPlaying from "./NowPlaying";

// export default function Room() {
//   const [player, setPlayer] = useState(null);
//   const [deviceId, setDeviceId] = useState(null);
//   const [isPaused, setIsPaused] = useState(true);
//   const token = localStorage.getItem("spotify_access_token");


//   useEffect(() => {
//     if (!token) return;

//     const script = document.createElement("script");
//     script.src = "https://sdk.scdn.co/spotify-player.js";
//     script.async = true;
//     document.body.appendChild(script);

//     window.onSpotifyWebPlaybackSDKReady = () => {
//       const player = new window.Spotify.Player({
//         name: "Harmonic Soul Player 🎵",
//         getOAuthToken: cb => cb(token),
//         volume: 0.5,
//       });

//       player.addListener("ready", ({ device_id }) => {
//         ("Player is ready with device ID:", device_id);
//         setDeviceId(device_id);
//       });

//       player.addListener("not_ready", ({ device_id }) => {
//         ("Device ID has gone offline", device_id);
//       });

//       player.addListener("player_state_changed", (state) => {
//         if (!state) return;
//         ("Player state changed:", state);
//         setIsPaused(state.paused);
//       });

//       player.connect();
//       setPlayer(player);
//     };
//   }, [token]);

//   const togglePlayback = () => {
//     if (player) {
//       player.togglePlay();
//     }
//   };

//   return (
//     <div style={{ padding: "2rem", color: "white" }}>
//       <h2>🎧 Spotify Player Room</h2>

//       {deviceId && (
//         <>
//           <p>✅ Player connected: <b>{deviceId}</b></p>
//           <button onClick={togglePlayback}>
//             {isPaused ? "▶️ Play" : "⏸ Pause"}
//           </button>
//           <SearchAndPlay deviceId={deviceId}/>
//           <NowPlaying/>
//         </>
//       )}
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import socket from "./Socket";

export default function MusicRoom() {
  const { trackId } = useParams();
  const { state } = useLocation(); // contains full track data from NowPlaying click
  const [player, setPlayer] = useState(null);
  const [deviceId, setDeviceId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentMsg, setCurrentMsg] = useState("");
  const token = localStorage.getItem("spotify_access_token");

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const spotifyPlayer = new window.Spotify.Player({
        name: "Harmonic Soul Player 🎵",
        getOAuthToken: cb => cb(token),
        volume: 0.8,
      });

      spotifyPlayer.addListener("ready", ({ device_id }) => {
        setDeviceId(device_id);
      });

      spotifyPlayer.connect();
      setPlayer(spotifyPlayer);
    };
  }, [token]);

  useEffect(() => {
    if (!deviceId || !state?.uri || !token) return;

    // Join room and play song
    socket.emit("join_music_room", trackId);
    socket.emit("play_track", { roomId: trackId, uri: state.uri });

    axios.put(
      `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
      { uris: [state.uri] },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    socket.on("receive_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, [deviceId, token, trackId, state?.uri]);

  const sendMessage = () => {
    if (!currentMsg.trim()) return;

    const msg = {
      room: trackId,
      text: currentMsg,
      sender: "You",
      time: new Date().toLocaleTimeString(),
    };

    socket.emit("send_message", msg);
    setMessages((prev) => [...prev, msg]);
    setCurrentMsg("");
  };

  return (
    <div style={styles.container}>
      <h2>🎧 Listening Room</h2>

      {state ? (
        <div style={styles.nowPlaying}>
          <img src={state.image} alt="Album Art" width="100" style={{ borderRadius: "10px" }} />
          <div>
            <h4>{state.name}</h4>
            <p>by {state.artists}</p>
            <p style={{ fontSize: "0.85rem" }}>{state.album}</p>
          </div>
        </div>
      ) : (
        <p>Loading song...</p>
      )}

      <hr style={{ border: "1px solid #fff3", margin: "20px 0" }} />

      <div>
        <h3>💬 Room Chat</h3>
        <div style={styles.chatBox}>
          {messages.map((msg, i) => (
            <div key={i} style={styles.chatMsg}>
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
  nowPlaying: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "1rem",
    background: "rgba(255, 255, 255, 0.1)",
    padding: "1rem",
    borderRadius: "12px",
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
  input: {
    padding: "10px",
    width: "60%",
    borderRadius: "8px",
    border: "none",
    fontSize: "16px",
  },
  btn: {
    padding: "10px 20px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#ff0080",
    color: "white",
    cursor: "pointer",
  },
};


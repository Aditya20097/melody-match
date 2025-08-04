import { useEffect, useState } from "react";
import axios from "axios";

export default function Room() {
  const [player, setPlayer] = useState(null);
  const [deviceId, setDeviceId] = useState(null);
  const [isPaused, setIsPaused] = useState(true);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const token = localStorage.getItem("spotify_access_token");

  // Load SDK + connect player
  useEffect(() => {
    if (!token) return;

    const existingScript = document.getElementById("spotify-sdk");
    if (!existingScript) {
      const script = document.createElement("script");
      script.id = "spotify-sdk";
      script.src = "https://sdk.scdn.co/spotify-player.js";
      script.async = true;
      document.body.appendChild(script);
    }

    window.onSpotifyWebPlaybackSDKReady = () => {
      const newPlayer = new window.Spotify.Player({
        name: "Harmonic Soul Player 🎵",
        getOAuthToken: cb => cb(token),
        volume: 0.5,
      });

      setPlayer(newPlayer);

      newPlayer.addListener("ready", ({ device_id }) => {
        console.log("✅ Player is ready with device ID:", device_id);
        setDeviceId(device_id);
        localStorage.setItem("spotify_device_id", device_id);
      });

      newPlayer.addListener("player_state_changed", (state) => {
        if (!state) return;
        setIsPaused(state.paused);
      });

      newPlayer.connect();
    };
  }, [token]);

  // Toggle play/pause
  const togglePlayback = () => {
    if (player) {
      player.togglePlay();
    }
  };

  // Search Spotify
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      const res = await axios.get(`https://api.spotify.com/v1/search`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          q: query,
          type: "track",
          limit: 5,
        },
      });
      setResults(res.data.tracks.items);
    } catch (err) {
      console.error("Search failed", err);
    }
  };

  // Play track on this device
  const playTrack = async (uri) => {
    if (!deviceId) return;
    try {
      await axios.put(
        `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
        {
          uris: [uri],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
    } catch (err) {
      console.error("Playback failed", err);
    }
  };

  return (
   <div
  style={{
    minHeight: "100vh",
    background: "linear-gradient(135deg, #1e003b, #370062)",
    padding: "2rem",
    color: "#fff",
    fontFamily: "Poppins, sans-serif",
  }}
>
  <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🎧 Spotify Player Room</h1>

  {deviceId ? (
    <>
      <p style={{ color: "#7fffd4" }}>
        ✅ Player connected:{" "}
        <span style={{ fontWeight: "bold" }}>{deviceId}</span>
      </p>

      <button
        onClick={togglePlayback}
        style={{
          background: "rgba(255, 255, 255, 0.1)",
          border: "1px solid #fff",
          borderRadius: "2rem",
          padding: "0.8rem 1.6rem",
          color: "white",
          cursor: "pointer",
          fontSize: "1rem",
          marginTop: "1rem",
          backdropFilter: "blur(6px)",
        }}
      >
        {isPaused ? "▶️ Play" : "⏸ Pause"}
      </button>

      {/* Search UI */}
      <form
        onSubmit={handleSearch}
        style={{
          marginTop: "2rem",
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search a song..."
          style={{
            padding: "0.8rem 1.2rem",
            borderRadius: "2rem",
            border: "none",
            width: "250px",
            fontSize: "1rem",
            outline: "none",
            boxShadow: "0 0 8px rgba(255,255,255,0.2)",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "0.8rem 1.4rem",
            borderRadius: "2rem",
            background: "linear-gradient(135deg, #ff5f6d, #ffc371)",
            color: "#fff",
            fontWeight: "bold",
            fontSize: "1rem",
            border: "none",
            cursor: "pointer",
            transition: "transform 0.2s ease",
          }}
        >
          🔍 Search
        </button>
      </form>

      {/* Search results */}
      <div
        style={{
          marginTop: "2rem",
          display: "grid",
          gap: "1.5rem",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        }}
      >
        {results.map((track) => (
          <div
            key={track.id}
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              borderRadius: "1.5rem",
              padding: "1rem",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              backdropFilter: "blur(8px)",
              boxShadow: "0 8px 20px rgba(0, 0, 0, 0.3)",
              transition: "transform 0.2s ease",
            }}
          >
            <img
              src={track.album.images[0]?.url}
              alt={track.name}
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "0.8rem",
                objectFit: "cover",
              }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: "bold", fontSize: "1rem" }}>{track.name}</div>
              <div style={{ color: "#ccc", fontSize: "0.9rem" }}>
                by {track.artists[0].name}
              </div>
            </div>
            <button
              onClick={() => playTrack(track.uri)}
              style={{
                padding: "0.6rem 1rem",
                borderRadius: "2rem",
                background: "linear-gradient(135deg, #1db954, #1ed760)",
                border: "none",
                color: "#fff",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              ▶️ Play
            </button>
          </div>
        ))}
      </div>
    </>
  ) : (
    <p style={{ marginTop: "3rem", fontSize: "1.2rem", color: "#bbb" }}>
      🎶 Connecting to Spotify...
    </p>
  )}
</div>

  );
}

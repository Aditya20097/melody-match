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
    <div style={{ padding: "2rem", color: "white", fontFamily: "Poppins, sans-serif" }}>
      <h2>🎧 Spotify Player Room</h2>

      {deviceId ? (
        <>
          <p>✅ Player connected: <b>{deviceId}</b></p>
          <button
            onClick={togglePlayback}
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "1px solid #fff",
              borderRadius: "1rem",
              padding: "0.6rem 1.2rem",
              color: "white",
              cursor: "pointer",
              fontSize: "1rem",
              marginTop: "1rem",
            }}
          >
            {isPaused ? "▶️ Play" : "⏸ Pause"}
          </button>

          {/* Search UI */}
          <form onSubmit={handleSearch} style={{ marginTop: "2rem" }}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search a song..."
              style={{
                padding: "0.6rem",
                borderRadius: "1rem",
                border: "1px solid #ccc",
                width: "250px",
                marginRight: "1rem",
              }}
            />
            <button type="submit" style={{ padding: "0.6rem 1rem", borderRadius: "1rem" }}>
              🔍 Search
            </button>
          </form>

          {/* Search results */}
          <ul style={{ marginTop: "1rem" }}>
            {results.map((track) => (
              <li key={track.id} style={{ marginBottom: "1rem", listStyle: "none" }}>
                <div>
                  <strong>{track.name}</strong> by {track.artists[0].name}
                  <button
                    onClick={() => playTrack(track.uri)}
                    style={{
                      marginLeft: "1rem",
                      padding: "0.3rem 0.6rem",
                      borderRadius: "0.5rem",
                      cursor: "pointer",
                    }}
                  >
                    ▶️ Play
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>🎶 Connecting to Spotify...</p>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import SearchAndPlay from "./SearchAndPlay";
import NowPlaying from "./NowPlaying";

export default function Room() {
  const [player, setPlayer] = useState(null);
  const [deviceId, setDeviceId] = useState(null);
  const [isPaused, setIsPaused] = useState(true);
  const token = localStorage.getItem("spotify_access_token");


  useEffect(() => {
    if (!token) return;

    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: "Harmonic Soul Player 🎵",
        getOAuthToken: cb => cb(token),
        volume: 0.5,
      });

      player.addListener("ready", ({ device_id }) => {
        console.log("Player is ready with device ID:", device_id);
        setDeviceId(device_id);
      });

      player.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id);
      });

      player.addListener("player_state_changed", (state) => {
        if (!state) return;
        console.log("Player state changed:", state);
        setIsPaused(state.paused);
      });

      player.connect();
      setPlayer(player);
    };
  }, [token]);

  const togglePlayback = () => {
    if (player) {
      player.togglePlay();
    }
  };

  return (
    <div style={{ padding: "2rem", color: "white" }}>
      <h2>🎧 Spotify Player Room</h2>

      {deviceId && (
        <>
          <p>✅ Player connected: <b>{deviceId}</b></p>
          <button onClick={togglePlayback}>
            {isPaused ? "▶️ Play" : "⏸ Pause"}
          </button>
          <SearchAndPlay deviceId={deviceId}/>
          <NowPlaying/>
        </>
      )}
    </div>
  );
}

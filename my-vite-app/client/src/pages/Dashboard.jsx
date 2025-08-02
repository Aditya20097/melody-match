
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardChatContainer from "../component/DashboardChatContainer";
import MatchesDisplay from "../component/MatchesDisplay";
import { useCookies } from "react-cookie";
import axios from "axios";
import { motion } from "framer-motion";
import "./Dashboardd.css";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [genderedUsers, setGenderedUsers] = useState(null);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [cookies, , removeCookie] = useCookies(["user"]);
  const userId = cookies.UserId;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/user}`
, {
          params: { userId },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };
    if (userId) fetchUser();
  }, [userId]);

  useEffect(() => {
    const fetchGenderedUsers = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/gendered-users}`
, {
          params: {
            gender: user?.gender_interest,
            userId: user?.user_id,
          },
        });
        setGenderedUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch gendered users:", err);
      }
    };
    if (user) fetchGenderedUsers();
  }, [user]);

  const updateMatches = async (matchedUserId) => {
    try {
      await axios.put(`${import.meta.env.VITE_SERVER_URL}/addmatch}`
, { userId, matchedUserId });
      const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/user}`
, {
        params: { userId },
      });
      setUser(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    removeCookie("UserId");
    removeCookie("AuthToken");
    navigate("/");
  };

  const matchedIds = (user?.matches || []).map(({ user_id }) => user_id).concat(userId);
  const swipeableUsers = genderedUsers?.filter((u) => !matchedIds.includes(u.user_id));

  const handleMatch = async (matchedUserId) => {
    await updateMatches(matchedUserId);
    removeUserFromDeck(matchedUserId);
  };

  const handlePass = (passedUserId) => {
    removeUserFromDeck(passedUserId);
  };

  const removeUserFromDeck = (userIdToRemove) => {
    setGenderedUsers((prev) => prev.filter((u) => u.user_id !== userIdToRemove));
  };

  return (
    <>
      {!user ? (
        <div className="loading-dashboard">Getting your vibe ready...</div>
      ) : (
        <div className="classy-dashboard">
          <aside className="sidebar">
            <div className="profile-section">
              <img src={user.url} alt={user.first_name} className="profile-avatar" />
              <h2>{user.first_name}</h2>
              <button onClick={handleLogout} className="logout">Logout</button>
            </div>
            <MatchesDisplay
              matches={user.matches}
              setClickedUser={setSelectedMatch}
              currentUser={user}
            />
          </aside>

          <main className="main-view">
            <h1 className="headline">Find Your Harmonic Match</h1>
            <div className="swipe-section">
              {swipeableUsers?.map((u, index) => (
                <motion.div
                  key={u.user_id}
                  className="user-card"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <img src={u.url} alt={u.first_name} className="card-img" />
                  <div className="card-content">
                    <h3>{u.first_name}, {u.age}</h3>
                    <p className="trait-chip">🎵 {u.commonSongs?.[0] || "Vibing"}</p>
                    <p className="trait-chip">🎤 {u.commonArtists?.[0] || "Unknown Artist"}</p>
                    <p className="trait-chip">🎧 {u.commonGenres?.[0] || "Chill"}</p>
                    <div className="card-buttons">
                      <button onClick={() => handlePass(u.user_id)} className="btn skip">Skip</button>
                      <button onClick={() => handleMatch(u.user_id)} className="btn match">Match</button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="music-room-launch">
              <button onClick={() => navigate("/music")} className="join-room">🎶 Join Music Lounge</button>
            </div>
          </main>

          {selectedMatch && (
            <DashboardChatContainer
              user={user}
              matchedUser={selectedMatch}
            />
          )}
        </div>
      )}
    </>
  );
};

export default Dashboard;

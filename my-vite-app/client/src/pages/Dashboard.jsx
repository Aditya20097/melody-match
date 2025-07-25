


import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardChatContainer from "../component/DashboardChatContainer";
import MatchesDisplay from "../component/MatchesDisplay";
import { useCookies } from "react-cookie";
import axios from "axios";
import { motion } from "framer-motion";
import "./Dashboard.css";

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
        const res = await axios.get("http://localhost:8000/user", {
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
        const res = await axios.get("http://localhost:8000/gendered-users", {
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
      await axios.put("http://localhost:8000/addmatch", {
        userId,
        matchedUserId,
      });
      const res = await axios.get("http://localhost:8000/user", {
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

  const swipeableUsers = genderedUsers?.filter(
    (u) => !matchedIds.includes(u.user_id)
  );

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
        <div className="loading-dashboard">Loading your dashboard...</div>
      ) : (
        <div className="dashboard">
          <div className="matches-container">
            <h3>Matches</h3>
            <button className="logout-button" onClick={handleLogout}>
              🚪 Logout
            </button>
            <MatchesDisplay
              matches={user.matches}
              setClickedUser={setSelectedMatch}
              currentUser={user}
            />
          </div>

          <div className="swipe-container">
            <div className="carousel-scroll-container">
              {swipeableUsers?.map((u, index) => (
                <motion.div
                  key={u.user_id}
                  className="carousel-card-custom"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="profile-card">
                    <img src={u.url} alt={u.first_name} className="profile-img" />
                    <div className="profile-info">
                      <h2>{u.first_name}, {u.age}</h2>
                      <div className="match-traits">
                        {u.commonSongs?.length > 0 && (
                          <span className="trait-chip">🎵 {u.commonSongs[0]}</span>
                        )}
                        {u.commonArtists?.length > 0 && (
                          <span className="trait-chip">🎤 {u.commonArtists[0]}</span>
                        )}
                        {u.commonGenres?.length > 0 && (
                          <span className="trait-chip">🎧 {u.commonGenres[0]}</span>
                        )}
                      </div>
                    </div>
                    <div className="match-buttons">
                      <button onClick={() => handlePass(u.user_id)} className="btn-pass">❌</button>
                      <button onClick={() => handleMatch(u.user_id)} className="btn-like">❤️</button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="music-room-button-wrapper">
              <button
                className="music-room-button"
                onClick={() => navigate("/music")}
              >
                🎵 Listen songs and join chat room
              </button>
            </div>
          </div>

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

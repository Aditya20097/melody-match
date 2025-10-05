

// import React, { useEffect, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useCookies } from "react-cookie";
// import { motion } from "framer-motion";
// import Navbar from "../component/Navbar";
// import Authmodal from "../component/Authmodal";
// import "./Home.css";

// const Home = () => {
//   const navigate = useNavigate();
//   const [cookies, setCookie, removeCookie] = useCookies(['user']);
//   const [showModal, setshowModal] = useState(false);
//   const [isSignUp, setisSignUp] = useState(true);
  

//   const authToken = cookies.AuthToken;
 

//   const handleClick = () => {
//     if (authToken) {
//       removeCookie("UserId", cookies.UserId);
//       removeCookie("AuthToken", cookies.AuthToken);
//       window.location.reload();
//       return;
//     }
//     setshowModal(true);
//     setisSignUp(true);
//   };


//   return (
//     <motion.div
//       className="overlay"
//       initial={{ opacity: 0, y: 40 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: -30 }}
//       transition={{ duration: 0.6, ease: "easeInOut" }}
//     >
    

//       {/* Navbar */}
//       <Navbar
//         authToken={authToken}
//         minimal={false}
//         setshowModal={setshowModal}
//         showModal={showModal}
//         setisSignUp={setisSignUp}
//       />

//       {/* Hero Section */}
//       <div className="home hero-section">
//         <h1 className="primary-title">Melodies build memories — together.</h1>

//         <div className="scroll-text">
//           <p>Your music. Your vibe. Your match. ❤️</p>
//         </div>

//         <button className="primary-button" onClick={handleClick}>
//           {authToken ? "Sign Out" : "Create Account"}
//         </button>

//         {/* Music Wave Animation */}
//         <div className="music-wave">
//           <div className="bar"></div>
//           <div className="bar"></div>
//           <div className="bar"></div>
//           <div className="bar"></div>
//           <div className="bar"></div>
//           <div className="bar"></div>
//         </div>

//       </div>

//       {/* Auth Modal */}
//       {showModal && (
//         <Authmodal setshowModal={setshowModal} isSignUp={isSignUp} />
//       )}

//       {/* Footer */}
//       <footer>
//         <p>© 2025 Melody Match | Love. Listen. Connect.</p>
//       </footer>
//     </motion.div>
//   );
// };

// export default Home;

import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { motion } from "framer-motion";
import Navbar from "../component/Navbar";
import Authmodal from "../component/Authmodal";
import "./Home.css";

const Home = () => {
  const [cookies, , removeCookie] = useCookies(["user"]);
  const [showModal, setshowModal] = useState(false);
  const [isSignUp, setisSignUp] = useState(true);

  const authToken = cookies.AuthToken;

  const handleClick = () => {
    if (authToken) {
      removeCookie("UserId", cookies.UserId);
      removeCookie("AuthToken", cookies.AuthToken);
      window.location.reload();
      return;
    }
    setshowModal(true);
    setisSignUp(true);
  };

  return (
    <motion.div
      className="overlay"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      {/* Navbar */}
      <Navbar
        authToken={authToken}
        minimal={false}
        setshowModal={setshowModal}
        showModal={showModal}
        setisSignUp={setisSignUp}
      />

      {/* HERO SECTION */}
      <div className="home hero-section">
        <motion.h1
          className="primary-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
        >
          Melodies build <span className="highlight">memories</span> — together.
        </motion.h1>

        <motion.p
          className="scroll-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
        >
          Your music. Your vibe. Your match. ❤️
        </motion.p>

        <motion.button
          className="primary-button"
          onClick={handleClick}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.96 }}
        >
          {authToken ? "Sign Out" : "Create Account"}
        </motion.button>

        <div className="music-wave">
          {Array(6)
            .fill()
            .map((_, i) => (
              <div className="bar" key={i}></div>
            ))}
        </div>

        <div className="bg-glow"></div>
      </div>

      {/* FEATURES SECTION */}
      <section className="features-section">
        <h2>Why Melody Match?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <i className="fas fa-music"></i>
            <h3>Find Your Harmony</h3>
            <p>Connect with people who love the same artists and songs you do.</p>
          </div>
          <div className="feature-card">
            <i className="fas fa-headphones-alt"></i>
            <h3>Listen Together</h3>
            <p>Enjoy synchronized playback and vibe together in real time.</p>
          </div>
          <div className="feature-card">
            <i className="fas fa-comments"></i>
            <h3>Chat Instantly</h3>
            <p>Talk, flirt, and share tracks in private or group chats.</p>
          </div>
          <div className="feature-card">
            <i className="fas fa-star"></i>
            <h3>Discover Your Match</h3>
            <p>Smart matching based on musical compatibility and interests.</p>
          </div>
        </div>
      </section>

      {/* DASHBOARD SECTION */}
      <section className="dashboard-section">
        <div className="content">
          <div className="text">
            <h2>Your Dashboard</h2>
            <p>
              A beautifully designed space where your matches, messages, and
              musical vibes come together. Track compatibility, explore shared
              playlists, and stay connected effortlessly.
            </p>
          </div>
          <div className="image dashboard-preview"></div>
        </div>
      </section>

      {/* ONBOARDING SECTION */}
      <section className="onboarding-section">
        <div className="content reverse">
          <div className="image onboarding-preview"></div>
          <div className="text">
            <h2>Easy Onboarding</h2>
            <p>
              Tell us about your favorite songs, artists, and genres. We’ll tune
              your experience so you meet people who resonate with your rhythm.
            </p>
          </div>
        </div>
      </section>

      {/* CHATTING SECTION */}
      <section className="chatting-section">
        <div className="content">
          <div className="text">
            <h2>Chat Your Heart Out</h2>
            <p>
              Enjoy real-time conversations with users who match your vibe. Share
              music, emojis, and even send “Now Playing” tracks directly.
            </p>
          </div>
          <div className="image chatting-preview"></div>
        </div>
      </section>

      {/* MUSIC LISTENING TOGETHER SECTION */}
      <section className="music-listen-section">
        <div className="content reverse">
          <div className="image music-preview"></div>
          <div className="text">
            <h2>Listen Together</h2>
            <p>
              Experience the magic of synchronized music sessions. Host or join
              a room, chat with others, and groove to the same beat—no matter
              where you are.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <p>
          © 2025 <span>Melody Match</span> | Love. Listen. Connect.
        </p>
      </footer>

      {showModal && (
        <Authmodal setshowModal={setshowModal} isSignUp={isSignUp} />
      )}
    </motion.div>
  );
};

export default Home;

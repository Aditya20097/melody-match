



// import React from 'react';
// import { Link } from 'react-router-dom';
// import './Navbar.css';
// import whitelogo from "../images/whitelogo.png";

// const Navbar = ({ setshowModal, showModal, authToken, setisSignUp }) => {
//   const handleClick = () => {
//     setshowModal(true);
//     setisSignUp(false);
//   };

//   return (
//     <nav className="navbar">
//       {/* Logo */}
//       <div className="logo-container">
//         <Link to="/">
//           <img className="logo" src={whitelogo} alt="Melody Match Logo" />
//         </Link>
//       </div>

//       {/* Navigation Links */}
//       <div className="nav-links">
//         <Link to="/">About</Link>

//         {authToken ? (
//           <>
//              <Link to="/onboarding">💬 Room</Link>
//             <Link to="/dashboard">💘 Dashboard</Link>
//             <Link to="/music">🎧 Music</Link>
//             <Link to="/music/concerts">🎫 Concerts</Link>
//           </>
//         ) : (
//           <button
//             className="nav-button"
//             onClick={handleClick}
//             disabled={showModal}
//           >
//             Login
//           </button>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import whitelogo from "../images/whitelogo.png";

const Navbar = ({ setshowModal, showModal, authToken, setisSignUp }) => {
  const handleClick = () => {
    setshowModal(true);
    setisSignUp(false);
  };

  return (
    <nav className="navbar gradient-navbar">
      {/* Left: Logo */}
      <div className="nav-section nav-left">
        <Link to="/">
          <img className="logo" src={whitelogo} alt="Melody Match Logo" />
        </Link>
      </div>

      {/* Center: Navigation Links */}
      <div className="nav-section nav-center">
        <Link to="/">About</Link>
        
        {authToken && <Link to="/dashboard">💘 Dashboard</Link>}
        {authToken && <Link to="/music">🎧 Music</Link>}
        {authToken && <Link to="/music/concerts">🎫 Concerts</Link>}
      </div>

      {/* Right: CTA Button */}
      <div className="nav-section nav-right">
        {!authToken && (
          <button
            className="nav-button"
            onClick={handleClick}
            disabled={showModal}
          >
            Log in
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

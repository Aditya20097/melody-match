// import React from 'react';
// import { Routes, Route, useLocation } from 'react-router-dom';
// import { AnimatePresence } from 'framer-motion';
// import { useCookies } from 'react-cookie';

// import Home from './pages/Home';
// import Dashboard from './pages/Dashboard';
// import Onboarding from './pages/Onboarding';
// import LandingPage from './pages/LandingPage';
// import ConcertsPage from './pages/ConcertsPage';
// import NavBar from './component/Navbar';

// const AnimatedRoutes = () => {
//   const location = useLocation();
//   const [cookies] = useCookies(['user']);
//   const authToken = cookies.AuthToken;

//   return (

//     <AnimatePresence mode="wait">
      
//       <Routes location={location} key={location.pathname}>
//         <Route path="/" element={<Home />} />
//         <Route path="/dashboard" element={<Dashboard />} />
//         <Route path="/onboarding" element={<Onboarding />} />
//         <Route path="/music" element={<LandingPage />} />
//         <Route path="/music/concerts" element={<ConcertsPage city="purnia" />} />
       
//       </Routes>
//     </AnimatePresence>
//   );
// };

// export default AnimatedRoutes;

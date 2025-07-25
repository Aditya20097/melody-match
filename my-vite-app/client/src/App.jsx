
// import React from 'react';
// import { BrowserRouter } from 'react-router-dom';
// import AnimatedRoutes from './AnimateRoutes';

// const App = () => {
//   return (
//     <BrowserRouter>
//       <AnimatedRoutes />
//     </BrowserRouter>
//   );
// };

// export default App;
import { Routes, Route, Navigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Onboarding from "./pages/Onboarding";
import LandingPage from "./pages/LandingPage"

import ConcertsPage from "./pages/ConcertsPage";

const App = () => {
  const [cookies] = useCookies(["user"]);
  const authToken = cookies.AuthToken;

  return (
    <Routes>
      {/* Always public */}
      <Route path="/" element={<Home />} />

      {/* Protected Routes */}
      {authToken ? (
        <>
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/music" element={<LandingPage />} />
          <Route path="/music/concerts" element={<ConcertsPage/>} />
        </>
      ) : (
        // If not logged in, block access to all protected routes
        <>
          <Route path="/onboarding" element={<Navigate to="/" />} />
          <Route path="/dashboard" element={<Navigate to="/" />} />
          <Route path="/music" element={<Navigate to="/" />} />
          
          <Route path="/music/concerts" element={<Navigate to="/" />} />
        </>
      )}

      {/* Optional: 404 route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;


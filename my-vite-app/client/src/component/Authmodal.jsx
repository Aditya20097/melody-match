

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";
import "./Authmodal.css"

const Authmodal = ({ setshowModal, isSignUp }) => {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmpassword, setConfirmPassword] = useState(null);
  const [error, setError] = useState(null);
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);

  const navigate = useNavigate();

  const handleClick = () => {
    setshowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isSignUp && password !== confirmpassword) {
        setError("Passwords need to match");
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/${isSignUp ? "signup" : "login"}`,
        { email, password }
      );

      setCookie("AuthToken", response.data.token);
      setCookie("UserId", response.data.userId);

      const success = response.status === 201;

      if (success && isSignUp) navigate("/Onboarding");
      if (success && !isSignUp) navigate("/");

      window.location.reload();
    } catch (error) {
      (error);
      setError("Something went wrong. Try again.");
    }
  };

  return (
    <>
     <div className="modal-backdrop" onClick={handleClick}></div>
      <div className="auth-model">
        <div className="close-icon" onClick={handleClick}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#fff"
          >
            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
          </svg>
        </div>

        <h2>{isSignUp ? "CREATE ACCOUNT" : "LOG IN"}</h2>
        <p>
          By clicking {isSignUp ? "create account" : "log in"}, you agree to our
          terms and privacy policies.
        </p>

        <div className="auth-form-container">
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              required
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />

            {isSignUp && (
              <input
                type="password"
                id="password-check"
                name="password-check"
                placeholder="Confirm Password"
                required
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            )}

            <input
              className="secondary-button"
              type="submit"
              value={isSignUp ? "Create Account" : "Log In"}
            />
            <p className="error-message">{error}</p>
          </form>
        </div>

        <hr />
        <h2>GET THE APP</h2>
      </div>
    </>
  );
};

export default Authmodal;

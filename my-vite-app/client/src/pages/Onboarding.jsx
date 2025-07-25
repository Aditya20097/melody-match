
import { useState } from "react";
import Navbar from "../component/Navbar";
import { useCookies } from "react-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Onboarding.css";

const Onboarding = () => {
 
  const [ favoriteSongs, setFavoriteSong] = useState("");
  const [musicPreferences , setMusicPreferences] = useState("");
  const [favouriteArtists, setFavouriteArtists] = useState("");

   const [cookies] = useCookies(["user"]);
  const [formData, setFormData] = useState({
    user_id: cookies.UserId,
    first_name: "",
    dob_day: "",
    dob_month: "",
    dob_year: "",
    show_gender: false,
    gender_identity: "man",
    gender_interest: "woman",
    url: "",
    about: "",
    matches: [],
    favoriteSong:"",
    favouriteArtists : "",
    musicPreferences : ""
  });

  const navigate = useNavigate();

  

 const handleSubmit = async (e) => {
  e.preventDefault();

  const payload = {
    ...formData,
    favoriteSongs: formData.favoriteSong.split(",").map(s => s.trim()),
    favoriteArtists: formData.favouriteArtists.split(",").map(a => a.trim()),
    musicPreferences: formData.musicPreferences.split(",").map(g => g.trim())
  };

  try {
    const response = await axios.put("http://localhost:8000/user", payload); // ✅ not { payload }
    if (response.status === 200) navigate("/");
  } catch (err) {
    console.error(err);
  }
};


  const handleChange = (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: value,
    }));
  };

  return (
    <>
      {/* <Navbar minimal={true} showModal={false} setshowModal={() => {}} /> */}
      <div className="onboarding">
        <h2>Create Account</h2>
        <form onSubmit={handleSubmit}>
          <section className="form-section">
            <label htmlFor="first_name">First Name</label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              placeholder="First name"
              required
              value={formData.first_name}
              onChange={handleChange}
            />

            <label>Birthday</label>
            <div className="multiple-input-container">
              <input
                type="number"
                name="dob_day"
                placeholder="DD"
                required
                value={formData.dob_day}
                onChange={handleChange}
              />
              <input
                type="number"
                name="dob_month"
                placeholder="MM"
                required
                value={formData.dob_month}
                onChange={handleChange}
              />
              <input
                type="number"
                name="dob_year"
                placeholder="YYYY"
                required
                value={formData.dob_year}
                onChange={handleChange}
              />
            </div>

            <label>Gender</label>
            <div className="multiple-input-container">
              <input
                type="radio"
                name="gender_identity"
                value="man"
                onChange={handleChange}
                checked={formData.gender_identity === "man"}
              />
              <label>Man</label>

              <input
                type="radio"
                name="gender_identity"
                value="woman"
                onChange={handleChange}
                checked={formData.gender_identity === "woman"}
              />
              <label>Woman</label>

              <input
                type="radio"
                name="gender_identity"
                value="more"
                onChange={handleChange}
                checked={formData.gender_identity === "more"}
              />
              <label>More</label>
            </div>

            <label htmlFor="show_gender">Show gender on my profile</label>
            <input
              type="checkbox"
              id="show_gender"
              name="show_gender"
              onChange={handleChange}
              checked={formData.show_gender}
            />

            <label>Show me</label>
            <div className="multiple-input-container">
              <input
                type="radio"
                name="gender_interest"
                value="man"
                onChange={handleChange}
                checked={formData.gender_interest === "man"}
              />
              <label>Man</label>

              <input
                type="radio"
                name="gender_interest"
                value="woman"
                onChange={handleChange}
                checked={formData.gender_interest === "woman"}
              />
              <label>Woman</label>

              <input
                type="radio"
                name="gender_interest"
                value="everyone"
                onChange={handleChange}
                checked={formData.gender_interest === "everyone"}
              />
              <label>Everyone</label>
            </div>
            <label> Song Preference</label>
               <input
                  type="text"
                  name = "favouriteSongs"
                  placeholder="Enter your favorite song"
                  value={formData.favoriteSong}
                  onChange={(e) => setFormData({...formData , favoriteSong: e.target.value})}
                />
              <label > Favourite genre </label>
                <input
                  type="text"
                  name = "favourite Artists"
                  placeholder="Enter genres (comma-separated)"
                  value={formData.musicPreferences}
                  onChange={(e) => setFormData({...formData , musicPreferences :e.target.value})}
                />
                <label > Favourite Artists</label>
                <input
                 type="text"
                 name ="musicPreferences"
                 placeholder="Enter your favourite Artists"
                 value={formData.favouriteArtists}
                 onChange={(e) => setFormData({...formData , favouriteArtists: e.target.value})}
                 />


            <label htmlFor="about">About me</label>
            <input
              type="text"
              id="about"
              name="about"
              placeholder="I like music..."
              required
              value={formData.about}
              onChange={handleChange}
            />

            <input type="submit" className="submit-btn" value="Submit" />
          </section>

          <section className="form-section photo-section">
            <label htmlFor="url">Profile photo URL</label>
            <input
              type="url"
              name="url"
              required
              onChange={handleChange}
            />
            <div className="photo-preview">
              {formData.url && <img src={formData.url} alt="Profile preview" />}
            </div>
          </section>
        </form>
      </div>
    </>
  );
};

export default Onboarding;


import axios from "axios";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import "./MatchesDisplay.css";

const MatchesDisplay = ({ matches, setClickedUser, currentUser }) => {
  const [matchedProfiles, setMatchedProfiles] = useState([]);
  const [cookies] = useCookies();

  const userId = cookies.UserId;
  const matchedUserIds = Array.isArray(matches)
    ? matches.map(({ user_id }) => user_id)
    : [];

  const getMatches = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/users`
, {
        params: { userIds: JSON.stringify(matchedUserIds) }
      });
      setMatchedProfiles(response.data);
    } catch (error) {
      (error);
    }
  };

  useEffect(() => {
    if (matches.length > 0) getMatches();
  }, [matches]);
// const normalizeArray = (arr) =>
//   (arr || []).map((item) => (item || "").toLowerCase().trim()).filter(Boolean);

// const getCommonTraits = (match) => {
//   ("✅ Comparing currentUser:", currentUser);
//   ("✅ Against match:", match);

//   const userSongs = normalizeArray(currentUser.favoriteSongs);
//   const matchSongs = normalizeArray(match.favoriteSongs);
//   ("🎵 Normalized Songs:", { userSongs, matchSongs });

//   const userArtists = normalizeArray(currentUser.favoriteArtists);
//   const matchArtists = normalizeArray(match.favoriteArtists);
//   ("🎤 Normalized Artists:", { userArtists, matchArtists });

//   const userGenres = normalizeArray(currentUser.musicPreferences);
//   const matchGenres = normalizeArray(match.musicPreferences);
//   ("🎧 Normalized Genres:", { userGenres, matchGenres });

//   const commonSongs = matchSongs.filter((s) => userSongs.includes(s));
//   const commonArtists = matchArtists.filter((a) => userArtists.includes(a));
//   const commonGenres = matchGenres.filter((g) => userGenres.includes(g));

//   ("✅ Shared:", { commonSongs, commonArtists, commonGenres });

//   return { commonSongs, commonArtists, commonGenres };
// };

const getCommonTraits = (match) => {
  const userSongs = currentUser.favoriteSongs?.map(s => s.toLowerCase()) || [];
  const userArtists = currentUser.favoriteArtists?.map(a => a.toLowerCase()) || [];
  const userGenres = currentUser.musicPreferences?.map(g => g.toLowerCase()) || [];

  const matchSongs = match.favoriteSongs?.map(s => s.toLowerCase()) || [];
  const matchArtists = match.favoriteArtists?.map(a => a.toLowerCase()) || [];
  const matchGenres = match.musicPreferences?.map(g => g.toLowerCase()) || [];

  const commonSongs = matchSongs.filter((s) => userSongs.includes(s));
  const commonArtists = matchArtists.filter((a) => userArtists.includes(a));
  const commonGenres = matchGenres.filter((g) => userGenres.includes(g));

  return { commonSongs, commonArtists, commonGenres };
};


  return (
    <div className="matches-display">
      {matchedProfiles?.map((match) => {
  const { commonSongs, commonArtists, commonGenres } = getCommonTraits(match);

  return (
    <div
  key={match.user_id}
  className="match-card enhanced"
  onClick={() => setClickedUser(match)}
>
  <div className="img-container">
    <img src={match?.url} alt={`${match?.first_name} profile`} />
  </div>

  <h4>{match?.first_name}</h4>

  {/* 🔥 Compatibility Badge */}
  <div className="compatibility-badge">
    {commonSongs.length + commonArtists.length + commonGenres.length} 🎯 Match Score
  </div>

  {/* ✨ Trait Chips */}
  <div className="trait-chips">
    {commonSongs.slice(0, 2).map((song, i) => (
      <span className="chip animated-chip" key={`s-${i}`}>🎵 {song}</span>
    ))}
    {commonArtists.slice(0, 2).map((artist, i) => (
      <span className="chip animated-chip" key={`a-${i}`}>🎤 {artist}</span>
    ))}
    {commonGenres.slice(0, 2).map((genre, i) => (
      <span className="chip animated-chip" key={`g-${i}`}>🎧 {genre}</span>
    ))}
  </div>
</div>

  );
})}

    </div>
  );
};

export default MatchesDisplay;

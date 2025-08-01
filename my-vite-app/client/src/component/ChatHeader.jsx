
import {useCookies} from "react-cookie"

const ChatHeader = ({user}) => {

  const [cookies , setCookie, removeCookie]=useCookies(["user"])
   const logout = () =>{
    removeCookie("UserId", cookies.UserId)
    removeCookie("AuthToken", cookies.AuthToken)
    window.location.reload()
   }

  return (
    <>
    <div className="chat-container-header">
      <div className="profile">
        <div className="img-container">
          <img src={user.url} alt={"photo of " + user.first_name}/>
        </div>
        <h3>{user.first_name}</h3>
      </div>
        <i className="log-out-icon"  onClick={logout}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-84 31.5-156.5T197-763l56 56q-44 44-68.5 102T160-480q0 134 93 227t227 93q134 0 227-93t93-227q0-67-24.5-125T707-707l56-56q54 54 85.5 126.5T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm-40-360v-440h80v440h-80Z"/></svg></i>
      </div>
</>
    
  )
}

export default ChatHeader
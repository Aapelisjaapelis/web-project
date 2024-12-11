import './Profile.css';
import Navbar from "../components/Navbar.js";
import { useUser } from "../context/useUser.js";
import { useNavigate } from "react-router-dom";
import Popup from 'reactjs-popup';

function Profile() {

  const navigate = useNavigate();

  const {user} = useUser();


  return (
    <>
      <Navbar />
      <h1 id="profileHeader">Profile</h1>
      <div id="profile">

        <div id="leftProfile">
          <button id="changePassword" onClick={e =>  navigate('/changePassword')}>Change password</button>
          <button id="changeEmail" onClick={e =>  navigate('/changeEmail')}>Change email address</button>
          <Popup trigger=
                {<button id="deleteAccount">Delete account</button>}
            modal nested>
            {
                close => (
                    <div>
                        <div>
                          <label for="newDesc">Are you sure you want to delete your account and all the information related</label><br/>
                        </div>
                        <div>
                            <button onClick={e => navigate('/profile')}>Submit</button>
                        </div>
                    </div>
                )
            }
          </Popup>
        </div>

        <div id="middleProfile">
          <h2>Username: {user.username}</h2> 
        </div>

        <div id="rightProfile"></div>

      </div>

      <div></div>
    </>
  );
}

export default Profile;
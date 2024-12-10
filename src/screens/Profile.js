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
      <h1>Profile</h1>
      <h2>Username: {user.username}</h2>
      <button className="changePassword" onClick={e =>  navigate('/changePassword')}>Change password</button>
      <button className="changeEmail" onClick={e =>  navigate('/changeEmail')}>Change email address</button>
      <Popup trigger=
            {<button>Delete account</button>}
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
    </>
  );
}

export default Profile;
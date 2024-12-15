import React from "react";
import "./GroupsPage.css";
import Navbar from "../components/Navbar.js";
import axios from "axios";
import roska from "../pictures/Roska.png";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../context/useUser.js";

const url = process.env.REACT_APP_API_URL

function GroupMembers () {

  const location = useLocation();
  const navigate = useNavigate();
  const group = location.state;

  const [members, setMembers] = useState([])
  const {user, updateToken} = useUser()
  const [joins, setJoinReq] = useState([])
  const [candidates, setCandidates] = useState([])
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [userSure, setSure] = useState(false);


  useEffect(() => {
    const headers = {headers: {Authorization: "Bearer " + user.access_token}}
    axios.get(url + '/group/Members/' + group.id, headers)
      .then(response => {
          setMembers(response.data)
          updateToken(response)
      }).catch(error => {
        alert(error.response.data.error ? error.response.data.error : error)
      })
    }, [])


  
  const deleteMember = (groupID, memberId) => {

      axios.delete(url + '/group/deleteMembers', {
        params: { id1: groupID, id2: memberId },
        headers: {Authorization: "Bearer " + user.access_token}
      }
      )
      .then(response =>{
        const withoutRemoved = members.filter((member)=> member.account_id !== memberId)
        setMembers(withoutRemoved)
        updateToken(response)
        alert("Member removed succesfully!")
      }).catch(error => {
        alert(error.response.data.error ? error.response.data.error : error)
      })
    }
    
  const getJoinRequests = (groupId) => {
    const headers = {headers: {Authorization: "Bearer " + user.access_token}}
    axios.get(url + '/group/getJoinReq/' + groupId, headers)
      .then(response => {
        if(response.data.length >0){
          setJoinReq(response.data)}
        else {
          setJoinReq([{account_id: 0 , username: "There is no more join requests", email: '-'}])
        }
          updateToken(response)
      }).catch(error => {
        alert(error.response.data.error ? error.response.data.error : error)
      })

  }
  const acceptRequest = (groupId, accountId) => {
    const headers = {headers: {Authorization: "Bearer " + user.access_token}}
    axios.post(url + '/group/postNewMember',{
      id1: groupId,
      id2: accountId
    }, headers)
      .then(response => {
        setMembers(response.data)
        let withoutRemoved = joins.filter((join)=> join.account_id !==accountId )
        if( withoutRemoved.length === 0){
            withoutRemoved = [{account_id: 0 , username: "There is no more join requests", email: '-'}]
        }
        setJoinReq(withoutRemoved)
        updateToken(response)
      }).catch(error => {
        alert(error.response.data.error ? error.response.data.error : error)
      })
  }
  
const denyRequest = (groupId, accountId) => {
  axios.delete(url + '/group/deleteJoinRequest',{
    params: { id1: groupId, id2: accountId },
    headers: {Authorization: "Bearer " + user.access_token}
  })
    .then(response => {
      let withoutRemoved = joins.filter((join)=> join.account_id !==accountId )
      if( withoutRemoved.length === 0){
          withoutRemoved = [{account_id: 0 , username: "There is no more join requests", email: '-'}]

      }
      setJoinReq(withoutRemoved)

        updateToken(response)
    }).catch(error => {
      alert(error.response.data.error ? error.response.data.error : error)
    })
}

const userInfo = () => {

  const headers = {headers: {Authorization: "Bearer " + user.access_token}}
  axios.get(url + '/group/getAllUsers', headers)
    .then(response => {
        setCandidates(response.data)
        updateToken(response)
    }).catch(error => {
      alert(error.response.data.error ? error.response.data.error : error)
    })

}

const changeAdmin = () => {
  if (selectedCandidate !== null) {
    const headers = {headers: {Authorization: "Bearer " + user.access_token}}
    axios.post(url + '/group/changeAdmin',{
      id1: user.id,
      id2: group.id,
      id3: selectedCandidate
    }, headers)
      .then(response => {
        alert("Admin change was succesfull! You are no longer in charge of this group")
        navigate('/GroupMy');
        updateToken(response)
      }).catch(error => {
        alert(error.response.data.error ? error.response.data.error : error)
      })

  } else {
    alert("Please select a candidate.");
  }
}

const groupDeletion = () => {
  if(userSure === true) {
    const headers = {headers: {Authorization: "Bearer " + user.access_token}}
    axios.delete(url + '/group/deleteGroup/'+group.id, headers)
      .then(response => {
        alert("Group was removed succesfully!")
        navigate('/GroupMy');
        updateToken(response)
      }).catch(error => {
        alert(error.response.data.error ? error.response.data.error : error)
      })
  }else {
    alert("Please confirm you are sure!");
  }

}
  return (
    <>
    <Navbar/>
    <div className="group-body">
      <div>
        <h1 >{group?.group_name} Settings</h1>
        <div className="littleInfo">
            <p>In the settings you can remove members, acces join requests, change ownership and delete group.</p>
        </div>
        <button className="info-button" onClick={() =>  navigate('/SpecificGroupPage',{ state: group})}>Group page</button>
        <Popup 
            trigger = {<button className="info-button">
              Join Requests
            </button>}
            modal nested
            onOpen={() => {
              getJoinRequests(group.id)
            }}


            
            >
            {
              (close) => (
                <div className='popup'>
                  <div className='content'>
                  <div className="header-container">
                    <h2>Join Requests</h2>
                    <div className="closepopup">
                      <button className="info-button" onClick={close}>X</button>
                    </div>
                  </div>
                    <table id="popuptable">
                      <thead>
                        <tr>
                          <th>Member name</th>
                          <th>Email</th>
                          <th></th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {joins.map(join => (
                          <tr key={join.account_id}>
                            <td data-label="Member">{join.username}</td>
                            <td data-label="Email" >{join.email}</td>
                            {join.account_id !== 0  ? (
                              <>
                            <td>
                              <button className="tablepopupbuttonYes" onClick={() => acceptRequest(group.id, join.account_id)}>
                                Accept
                              </button>
                            </td>
                            <td>
                              <button className="tablepopupbuttonNo"  onClick={() => denyRequest(group.id, join.account_id)}>
                                Decline
                              </button>
                            </td>
                            </>
                            ) :(
                              <></>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )
          }
          </Popup>
        <table id="groupTable">
          <thead>
            <tr>
              <th>Member</th>
              <th>Email</th>
              <th></th>
            </tr>
          </thead>
            <tbody>
              {members.map(member => (
                <tr key={member.account_id}>
                  <td data-label="Member" >{member.username}</td>
                  <td data-label="Email" >{member.email}</td>
                  <td>
                  {user.id === member.account_id ? (
                      "Owner"
                  ):(
                  <button 
                    onClick={() => deleteMember(group.id, member.account_id)} 
                    className="removebutton">
                    <img src={roska} alt="Remove" width={20} height={20}/>

                  </button>
                  )}
                  </td>
              </tr>
                ))}
            </tbody>
        </table>
        <Popup 
            trigger = {<button className="dangerousbutton">
              Change Admin
            </button>}
            modal nested
            onOpen={() => {
              userInfo(user.id, group.id)
            }}
            >
            {
              (close) => (
                <div className='popup'>
                  <div className='content'>
                  <h2 className="header-container ">Change Admin</h2>

                    <table id="popuptable">
                      <thead>
                        <tr>
                          <th>Username</th>
                          <th>Email</th>
                          <th>Select</th>
                        </tr>
                      </thead>
                      <tbody>
                        {candidates.map(candidate => (
                          candidate.account_id != user.id ? (
                            <tr key={candidate.account_id}>
                              <td data-label="Username ">{candidate.username}</td>
                              <td data-label="Email" >{candidate.email}</td>
                              <td data-label="Select" ><input type="radio" value={candidate.account_id} name="selectAdmin" onChange={() => setSelectedCandidate(candidate.account_id)}></input></td>
                            </tr>
                          ):(
                            null
                          )
                        ))}
                      </tbody>
                    </table>
                    <div>
                      <p>Enter is final and can not be changed later!</p>
                      <button className="info-button" onClick={changeAdmin}>
                        Enter
                      </button>
                      <button className="info-button" onClick={close}>
                        Cancel
                      </button>
                    </div>
                  </div>

                </div>
              )
          }
          </Popup>

          <Popup 
            trigger = {<button className="deletegroup">
              Delete group
            </button>}
            modal nested
            >
            {
              (close) => (
                <div className='popup'>
                  <div className='content'>
                    <h2>Are you sure?</h2>
                    <p>Are you sure you want to delete this group? If yes, check the dot and press continue.</p>
                    <p>Yes I am sure:</p>
                    <input type="radio" value="true" name="sure" onChange={() => setSure(true)}></input>

                    <div>
                      <p>Enter is final and can not be changed later!</p>
                      <button className="info-button" onClick={e => groupDeletion()}>
                        Enter
                      </button>
                      <button className="info-button" onClick={close}>
                        Cancel
                      </button>
                    </div>
                  </div>

                </div>
              )
          }
          </Popup>
      </div>
    </div>
    </>
    )
}

export default GroupMembers;
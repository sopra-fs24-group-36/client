import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/UserProfile.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from 'prop-types';
//import Modal from "react-boostrap/Modal";

// @ts-ignore
import rightBrok from "../../assets/rightBrok.png";
// @ts-ignore
import defaultUser from "../../assets/defaultUser.png"
// @ts-ignore
import camera from "../../assets/camera.png"
import UserProfile from "./UserProfile";
const Icon = ({ flip }) => {
  const iconClass = flip ? "icon flip-horizontal" : "icon";
  return <img src={rightBrok} alt="Icon" className={iconClass} />;
};
Icon.propTypes = {
  flip: PropTypes.bool,
};

const FormField=(props)=>{
  return(
    <div className="userprofile user-data-item">
      <label className="userprofile item-label">{props.label}</label>
      <input
        className="userprofile input"
        placeholder={props.placeholder}
        value={props.value}
        onChange={(e)=>props.onChange(e.target.value)}
      />
    </div>
  )
}

type FormFieldProps = {
  label: PropTypes.string;
  value: PropTypes.string;
  placeholder: PropTypes.string;
  onChange: PropTypes.func;
};
FormField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

const EditProfile=()=>{
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [email, setEmail]=useState(null);
  const [username, setUsername] = useState(null);
  const [name, setName]=useState(null);
  const [profilepicture, setProfilepicture]=useState(null);

  //const [showModal, setShowModal] = useState(false);

  const {id} = useParams();

  //const handleCloseModal = () => setShowModal(false);
  //const handleShowModal = () => setShowModal(true);

  const saveChanges=async ()=>{
    try{
      //check if there are any changes

      const requestBody=JSON.stringify({
        "id":id,
        "username":username,
        "name":name,
        "email":email,
        "profilePicture":profilepicture,
      })
      const response=await api.put("/users/"+id,requestBody);
    }catch(error){
      console.error('An error occurred while saving changes:', error);
      alert('An error occurred while saving changes. Please try again later.');
    }
  }
  useEffect(() => {
    async function fetchData(){
      try{
        const response=await api.get(`/users/${id}`);
        setUser(response.data)
        const token=localStorage.getItem("token");
        if(!token){
          // if a user has not logged yet, then navigate to the userprofile page
          navigate("/users/login");
          return;
        }
        if (localStorage.getItem("token") !== response.data.token) {
          const trueResponse =await api.get(`/users/token/${token}`);
          alert("You can only change your own profile!")
          const trueId = trueResponse.data.id
          console.log("trueid",trueId)
          navigate(`/users/profile/edit/${trueId}`)
        }
      }catch(error){
        console.error("Details:",error)
        alert("Something went wrong while fetching the users! See the console for details.");
      }
    }
    fetchData()
  }, []);

  return(
    <BaseContainer>
      <div className="userprofile container">
        <div className="userprofile form">
          <div className="userprofile title">
            <Icon flip />
            Edit your profile
            <Icon flip={false} />
          </div>
          <div>
            {/*<div className="item-img">
              {user.profilePicture ? (
                <img src={user.profilePicture} alt="Icon" />
              ) : (
                <img src={defaultUser} alt="Icon" />
              )}
            </div>*/}
            <div>
              <div className="userprofile imageContainer">
                <div className="userprofile circle-img">
                  <img src={defaultUser} alt="Icon" />
                </div>
              </div>
{/*              <Button onClick={handleShowModal}>
                <div className="userprofile circle-img">
                  <img src={camera} alt={"Icon"} />
                </div>
              </Button>
              {showModal&& (
                <div className="userprofile modal">
                  <input
                    type="text"
                    placeholder="Enter new profile picture URL"
                    value={profilepicture}
                    onChange={(e)=>setProfilepicture(e.target.value)}
                  />
                  <Button onClick={saveChanges}>Save</Button>
                  <Button onClick={handleCloseModal}>Close</Button>
                </div>
              )}*/}
            </div>
            <div className="userprofile user-data-item">
              <span className="userprofile item-label">ID:</span>
              <span className="userprofile ite m-value">{1}</span>
              {/*<span className="userprofile item-value">{user.id}</span>*/}
            </div>
            <FormField
              label="E-Mail:"
              value={email}
              /*placeholder={user.email}*/
              placeholder={"brocc.oli@domain.com"}
              onChange={(un: string) => setEmail(un)}
            />
            <FormField
              label="Username:"
              value={user}
              /*placeholder={user.username}*/
              placeholder={"broccHead1"}
              onChange={(un: string) => setUsername(un)}
            />
            <FormField
              label="Name:"
              value={name}
              placeholder={"Oliver Broc"}
              onChange={(un: string) => setName(un)}
            />
            <div className="userprofile user-data-item">
              <span className="userprofile item-label">Creationdate:</span>
              <span className="userprofile item-value">{1}</span>
              {/*<span className="userprofile item-value">{user.creationdate}</span>*/}
            </div>
            <div className="userprofile user-data-item">
              <span className="userprofile item-label">Status:</span>
              <span className="item-value">{1}</span>
              {/*<span className="userprofile item-value">{user.status}</span>*/}
            </div>
          </div>
          <div className="userprofile button-container">
            <Button
              className="userprofile button-lightgreen"
              width="50%"
              onClick={() => navigate(`/users/profile`)}>
              Back
            </Button>
            <Button
              className="userprofile button-darkpink"
              /*disabled={!(user.token === localStorage.getItem("token"))}*/
              width="50%"
              onClick={()=>saveChanges()}>
              Save
            </Button>
          </div>
        </div>
      </div>
    </BaseContainer>
  )
}
export default EditProfile;
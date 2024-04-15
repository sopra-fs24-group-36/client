import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { useNavigate, useParams } from "react-router-dom";
import ReactDOM from "react-dom";
import { Button } from "components/ui/Button";
import "styles/views/UserProfile.scss";
import "styles/views/EditPictureModal.scss"
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
//import Modal from "react-boostrap/Modal";

// @ts-ignore
import rightBrok from "../../assets/rightBrok.png";
// @ts-ignore
import defaultUser from "../../assets/defaultUser.png"
// @ts-ignore
import select_image from "../../assets/select_image.png"
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

FormField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

const ProfileFormField=(props)=>{

  return(
    <div className="editPicture field">
      <div className="editPicture input-container">
        <input
          className="editPicture input"
          placeholder="Enter the url for the new picture..."
          value={props.value}
        />
      </div>
    </div>
  )
}
ProfileFormField.propTypes = {
  value: PropTypes.string.isRequired,
};
const EditPictureModal = ({ open, onClose, profilepicture,setProfilepicture})=>{

  if(!open) return null;
  const handleSave=async()=>{
    setProfilepicture(profilepicture)
    onClose();
  };

  return (
    <>
      <div className="editPicture backdrop"></div>
      <div className="editPicture container">
        <div className="editPicture title">Change Profile Picture</div>
        <ProfileFormField
          value={profilepicture}
        />
        <div className="editPicture button-container">
          <Button className="editPicture button" onClick={onClose}>
            Cancel
          </Button>
          <Button className="editPicture highlight" onClick={handleSave}>
            Save
          </Button>
        </div>
      </div>
    </>
  );
}
EditPictureModal.propTypes={
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  profilepicture: PropTypes.string.isRequired,
  setProfilepicture: PropTypes.func.isRequired,
}
const EditProfile = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [email, setEmail]=useState(null);
  const [username, setUsername] = useState(null);
  const [name, setName]=useState(null);
  const [profilepicture, setProfilepicture]=useState(null);
  const [isModalOpen,setIsModalOpen]=useState(false);

  const {id} = useParams();


  const saveChanges=async ()=>{
    try{
      //TODO:check if there are any changes, send http request when changes occur

      const requestBody=JSON.stringify({
        "id":id,
        "username":username,
        "name":name,
        "email":email,
        "profilePicture":profilepicture,
      })
      const response=await api.put("/users/"+id,requestBody);
    }catch(error){
      console.error("An error occurred while saving changes:", error);
      alert("An error occurred while saving changes. Please try again later.");
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
            {/*
TODO:add the following part and delete the default
*/}
            {/*<div className="item-img">
              {user.profilePicture ? (
                <img src={user.profilePicture} alt="Icon" />
              ) : (
                <img src={defaultUser} alt="Icon" />
              )}
            </div>*/}
            <div >
              <div className="userprofile imageContainer">
                <div className="userprofile circle-img" style={{position:"relative"}}>{/*set the father component relative and then it can be regarded as reference point*/}
                  <img src={defaultUser} alt="Icon" />
                  <Button
                    className="userprofile button-with-picture"
                    style={{
                      position:"absolute",
                      right:"120px",
                      bottom:"0px",
                      backgroundImage: `url(${select_image})` }}
                    onClick={()=>setIsModalOpen(true)}>
                  </Button>
                </div>
              </div>

              <EditPictureModal
                open={isModalOpen}
                onClose={()=>setIsModalOpen(false)}
                profilepicture={profilepicture}
                setProfilepicture={setProfilepicture}
              />
            </div>
            <div className="userprofile user-data-item">
              <span className="userprofile item-label">ID:</span>
              <span className="userprofile ite m-value">{1}</span>
              {/*
TODO:add the following line*
*/}
              {/*<span className="userprofile item-value">{user.id}</span>*/}
            </div>
            <FormField
              label="E-Mail:"
              value={email}
              /*
TODO:add the following line
*/
              /*placeholder={user.email}*/
              placeholder={"brocc.oli@domain.com"}
              onChange={(un: string) => setEmail(un)}
            />
            <FormField
              label="Username:"
              value={user}
              /*
TODO:add the following line
*/
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
              {/*
TODO:add the following line
*/}
              {/*<span className="userprofile item-value">{user.creationdate}</span>*/}
            </div>
            <div className="userprofile user-data-item">
              <span className="userprofile item-label">Status:</span>
              <span className="item-value">{1}</span>
              {/*
TODO:add the following line
*/}
              {/*<span className="userprofile item-value">{user.status}</span>*/}
            </div>
          </div>
          <div className="userprofile button-container">
            <Button
              className="userprofile button-lightgreen"
              width="50%"
              onClick={() => navigate("/users/profile")}>
              Back
            </Button>
            <Button
              className="userprofile button-darkpink"
              /*
TODO:add the following line
*/
              /*disabled={!(user.token === localStorage.getItem("token"))}*/
              width="50%"
              onClick={()=>saveChanges()}>
              Save
            </Button>
          </div>
        </div>
      </div>
    </BaseContainer>
  );
};

export default EditProfile;
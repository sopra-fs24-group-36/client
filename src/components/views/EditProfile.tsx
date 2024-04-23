import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { useNavigate, useParams } from "react-router-dom";
import ReactDOM from "react-dom";
import { Button } from "components/ui/Button";
import "styles/views/UserProfile.scss";
import "styles/views/EditPictureModal.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
//import Modal from "react-boostrap/Modal";

// @ts-ignore
import rightBrok from "../../assets/rightBrok.png";
// @ts-ignore
import defaultUser from "../../assets/defaultUser.png";
// @ts-ignore
import select_image from "../../assets/select_image.png";
import UserProfile from "./UserProfile";
// @ts-ignore
import leftBrok from "../../assets/leftBrok.png";


const FormField = (props) => {
  return (
    <div className="userprofile user-data-item">
      <label className="userprofile item-label">{props.label}</label>
      <input
        className="userprofile input"
        placeholder={props.placeholder}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

const ProfileFormField = (props) => {
  return (
    <div className="editPicture field">
      <div className="editPicture input-container">
        <input
          className="editPicture input"
          placeholder="Enter the url for the new picture..."
          value={props.value}
        />
      </div>
    </div>
  );
};

ProfileFormField.propTypes = {
  value: PropTypes.string.isRequired,
};

const EditPictureModal = ({ open, onClose, profilepicture, setProfilepicture }) => {

  if (!open) return null;
  const handleSave = async () => {
    setProfilepicture(profilepicture);
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
};

EditPictureModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  profilepicture: PropTypes.string.isRequired,
  setProfilepicture: PropTypes.func.isRequired,
};

const EditProfile = () => {
  const navigate = useNavigate();
  const { userID } = useParams();
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState(null);
  const [username, setUsername] = useState(null);
  const [name, setName] = useState(null);
  const [profilepicture, setProfilepicture] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const loggedInUser = parseInt(localStorage.getItem("userID")); /*getting the ID of the currently logged in user*/

  if (parseInt(userID) !== loggedInUser){
    // alert("Unauthorized Access!!");
    navigate(`/users/${userID}`);
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get(`/users/${userID}`);
        setUser(response.data);
      } catch (error) {
        console.error("Details:", error);
        alert("Something went wrong while fetching the users! See the console for details.");
      }
    }
    fetchData();
  }, [userID]);

  const saveChanges = async () => {
    try {
      const requestBody = JSON.stringify({
        "id": userID,
        "username": username,
        "name": name,
        "email": email,
        "profilePicture": profilepicture,
      });
      const response = await api.put(`/users/${userID}`, requestBody);
      navigate(`/users/${userID}`)
    } catch (error) {
      console.error("An error occurred while saving changes:", error);
      alert("An error occurred while saving changes. Please try again later.");
    }
  };

  return (
    <BaseContainer>
      {user && (
        <div className="userprofile container">
          <div className="userprofile form">
            <div className="userprofile title">
              <img src={leftBrok} alt="Icon" style={{ transform: "scale(0.7)" }} />
              User Profile
              <img src={rightBrok} alt="Icon" style={{ transform: "scale(0.7)" }} />
            </div>
            <div>
              <div>
                <div className="userprofile imageContainer">
                  <div className="userprofile circle-img"
                    style={{ position: "relative" }}>{/*set the father component relative and then it can be regarded as reference point*/}
                    {user.profilePicture ? (
                      <img src={user.profilePicture} alt="Profile" />
                    ) : (
                      <img src={defaultUser} alt="Default Profile" />
                    )}
                    <Button
                      className="userprofile button-with-picture"
                      style={{
                        position: "absolute",
                        right: "120px",
                        bottom: "0px",
                        backgroundImage: `url(${select_image})`,
                      }}
                      onClick={() => setIsModalOpen(true)}>
                    </Button>
                  </div>
                </div>

                <EditPictureModal
                  open={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                  profilepicture={profilepicture}
                  setProfilepicture={setProfilepicture}
                />
              </div>
              <div className="userprofile user-data-item">
                <span className="userprofile item-label">ID:</span>
                <span className="userprofile item-value">{user.id}</span>
              </div>
              <FormField
                label="E-Mail:"
                value={email}
                placeholder={user.email}
                onChange={(un: string) => setEmail(un)}
              />
              <FormField
                label="Username:"
                value={username}
                placeholder={user.username}
                onChange={(un: string) => setUsername(un)}
              />
              <FormField
                label="Name:"
                value={name}
                placeholder={user.name}
                onChange={(un: string) => setName(un)}
              />
              <div className="userprofile user-data-item">
                <span className="userprofile item-label">Creationdate:</span>
                <span className="userprofile item-value">{user.creationDate}</span>
              </div>
              <div className="userprofile user-data-item">
                <span className="userprofile item-label">Status:</span>
                <span className="userprofile item-value">{user.status}</span>
              </div>
            </div>
            {/*---------------------end of modifications*/}
            <div className="userprofile button-container">
              <Button
                className="userprofile button-lightgreen"
                width="50%"
                onClick={() => navigate(`/users/${userID}`)}>
                Back
              </Button>
              <Button
                className="userprofile button-darkpink"
                disabled={user.id !== loggedInUser}
                width="50%"
                onClick={() => saveChanges()}>
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </BaseContainer>
  );
};

export default EditProfile;
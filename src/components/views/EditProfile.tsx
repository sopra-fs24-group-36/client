import React, { useEffect, useState } from "react";
import { api } from "helpers/api";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/UserProfile.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";

// @ts-ignore
import rightBrok from "../../assets/rightBrok.png";
// @ts-ignore
import select_image from "../../assets/select_image.png";
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

const EditProfile = () => {
  const navigate = useNavigate();
  const { userID } = useParams();
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState(null);
  const [username, setUsername] = useState(null);
  const [name, setName] = useState(null);
  const [profilepicture, setProfilepicture] = useState(null);
  const loggedInUser = parseInt(localStorage.getItem("userID")); /*getting the ID of the currently logged in user*/

  if (parseInt(userID) !== loggedInUser) {
    // alert("Unauthorized Access!!");
    navigate(`/users/${userID}`);
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get(`/users/${userID}`);
        setUser(response.data);
        setProfilepicture(response.data.profilePicture);
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
      await api.put(`/users/${userID}`, requestBody);
      navigate(`/users/${userID}`);
    } catch (error) {
      console.error("An error occurred while saving changes:", error);
      alert("An error occurred while saving changes. Please try again later.");
    }
  };

  const addImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const dataURL = event.target.result;
          setProfilepicture(dataURL);
        };
        reader.readAsDataURL(file as Blob);
      }
    };
    input.click();
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
                    <img src={profilepicture} alt="Default Profile" />
                    <Button
                      className="userprofile button-with-picture"
                      style={{
                        position: "absolute",
                        right: "120px",
                        bottom: "0px",
                        backgroundImage: `url(${select_image})`,
                      }}
                      onClick={() => addImage()}>
                    </Button>
                  </div>
                </div>

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
import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/UserProfile.scss";
import BaseContainer from "components/ui/BaseContainer";
// @ts-ignore
import rightBrok from "../../assets/rightBrok.png";
// @ts-ignore
import leftBrok from "../../assets/leftBrok.png";


const UserProfile = () => {
  const navigate = useNavigate();
  const { userID } = useParams();
  const [user, setUser] = useState(null);
  const loggedInUser = parseInt(localStorage.getItem("userID")); /*getting the ID of the currently logged in user*/


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/users/${userID}`);
        setUser(response.data);
      } catch (error) {
        console.error(
          `Something went wrong while fetching the users: \n${handleError(
            error,
          )}`,
        );
        console.error("Details:", error);
        alert(
          "Something went wrong while fetching the users! See the console for details.",
        );
      }
    };
    fetchData();
  }, [userID]);


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
              <div className="userprofile imageContainer">
                <div className="userprofile circle-img">
                  <img src={user.profilePicture} alt="Profile" />
                </div>
              </div>
              <div>
                <div className="userprofile user-data-item">
                  <span className="userprofile item-label">ID:</span>
                  <span className="userprofile item-value">{user.id}</span>
                </div>
                <div className="userprofile user-data-item">
                  <span className="userprofile item-label">E-Mail:</span>
                  <span className="userprofile item-value">{user.email}</span>
                </div>
                <div className="userprofile user-data-item">
                  <span className="userprofile item-label">Username:</span>
                  <span className="userprofile item-value">{user.username}</span>
                </div>
                <div className="userprofile user-data-item">
                  <span className="userprofile item-label">Name:</span>
                  <span className="userprofile item-value">{user.name}</span>
                </div>
                <div className="userprofile user-data-item">
                  <span className="userprofile item-label">Creationdate:</span>
                  <span className="userprofile item-value">{user.creationDate}</span>
                </div>
                <div className="userprofile user-data-item">
                  <span className="userprofile item-label">Status:</span>
                  <span className="userprofile item-value">{user.status}</span>
                </div>
              </div>
            </div>
            <div className="userprofile button-container">
              <Button
                className="userprofile button-lightgreen"
                width="50%"
                onClick={() => navigate("/home")}>
                Back
              </Button>
              <Button
                className="userprofile button-darkpink"
                disabled={user.id !== loggedInUser}
                width="50%"
                onClick={() => navigate(`/users/${userID}/edit`)}>
                Edit
              </Button>
            </div>
          </div>
        </div>
      )}
    </BaseContainer>
  );
};

export default UserProfile;

import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/UserProfile.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
// @ts-ignore
import rightBrok from "../../assets/rightBrok.png";
// @ts-ignore
import defaultUser from "../../assets/defaultUser.png"
const Icon = ({ flip }) => {
  const iconClass = flip ? "icon flip-horizontal" : "icon";

  return <img src={rightBrok} alt="Icon" className={iconClass} />;
};
Icon.propTypes = {
  flip: PropTypes.bool,
};

const UserProfile=()=>{
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const {id} = useParams();

  useEffect(() => {
    const fetchData=async()=>{
      try{
        //TODO: add the following codes to ensure only logged-in user can fetch data
        /*const token=localStorage.getItem("token");
        if(!token){
          // if a user has not logged yet, then navigate to the login page
          navigate("/users/login");
          return;
        }*/
        //---------------------end of modifications
        const response=await api.get(`/users/${id}`);
        setUser(response.data);
      }catch(error){
        console.error(
          `Something went wrong while fetching the users: \n${handleError(
            error
          )}`
        );
        console.error("Details:", error);
        alert(
          "Something went wrong while fetching the users! See the console for details."
        );
      }
    }
    fetchData()
  }, [id,navigate]);


  return(
    <BaseContainer>
      <div className="userprofile container">
        <div className="userprofile form">
          <div className="userprofile title">
            <Icon flip />
            User Profile
            <Icon flip={false} />
          </div>
          <div>
            {/* TODO:add functional codes and delete the default             */}
            {/*<div className="item-img">
              {user.profilePicture ? (
                <img src={user.profilePicture} alt="Icon" />
              ) : (
                <img src={defaultUser} alt="Icon" />
              )}
            </div>*/}
            <div className="userprofile imageContainer">
              <div className="userprofile circle-img">
                <img src={defaultUser} alt="Icon" />
              </div>
            </div>
            <div style={{ marginTop: "1em" }}></div>
            <div className="userprofile user-data-item">
              <span className="userprofile item-label">ID:</span>
              <span className="userprofile ite m-value">{1}</span>
              {/*<span className="userprofile item-value">{user.id}</span>*/}
            </div>
            <div className="userprofile user-data-item">
              <span className="userprofile item-label">E-Mail:</span>
              <span className="userprofile ite m-value">{1}</span>
              {/*<span className="userprofile item-value">{user.Email}</span>*/}
            </div>
            <div className="userprofile user-data-item">
              <span className="userprofile item-label">Username:</span>
              <span className="userprofile ite m-value">{1}</span>
              {/*<span className="userprofile item-value">{user.username}</span>*/}
            </div>
            <div className="userprofile user-data-item">
              <span className="userprofile item-label">Name:</span>
              <span className="userprofile ite m-value">{1}</span>
              {/*<span className="userprofile item-value">{user.name}</span>*/}
            </div>
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
            {/*---------------------end of modifications*/}
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
              /* TODO:add the following line            */
              /*disabled={!(user.token === localStorage.getItem("token"))}*/
              width="50%"
              onClick={() => navigate("/users/profile/edit")}>
              Edit
            </Button>
          </div>
        </div>
      </div>
    </BaseContainer>
  )

}

export default UserProfile;
import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { Form, useNavigate, useParams } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Invitations.scss";
import PropTypes from "prop-types";
import Dashboard from "components/ui/Dashboard";
import Footer from "components/ui/footer";
import BaseContainer from "components/ui/BaseContainer_new";
import Header_new from "components/views/Header_new";


const Invitations = () => {
  const navigate = useNavigate();
  const { userID } = useParams();
  const [refreshInvitation, setRefreshInvitation] = useState(false);
  const [invitations, setInvitations] = useState<[]>(null);
  //TODO:
  useEffect(() => {
    async function fetchInvitations() {
      try {
        const response = await api.get(`/users/${userID}/invitations`);
        setInvitations(response.data);
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
    }

    fetchInvitations();
  }, [refreshInvitation]);
  const handleAccept = async (invitation) => {
    try {
      const response = await api.post(`users/${userID}/accept/${invitation.groupID}`);
      setRefreshInvitation(prev => !prev);
    } catch (error) {
      alert("Accepting failed.");
    }
  };
  const handleDecline = async (invitation) => {
    try {
      const response = await api.post(`users/${userID}/deny/${invitation.groupID}`);
      setRefreshInvitation(prev => !prev);
    } catch (error) {
      alert("Declining failed.");
    }
  };

  return (
    <div>
      <Header_new></Header_new>
      <Dashboard
        showButtons={{
          recipe: true,
          group: true,
          calendar: true,
          shoppinglist: true,
          invitations: true,
        }}
        activePage="invitations"
      />
      <BaseContainer>
        <div className="invitations headerContainer">
          <div className="invitations backButtonContainer">
            <Button
              className="backButton"
              onClick={() => navigate("/home")}
            >Back</Button>
          </div>
          <h2 className="invitations title">Invitations</h2>
        </div>
        <div className="invitations backContainer">
          {(invitations?.length ?? 0) === 0 ? (
            <p className="invitations noInvitation">No invitations yet....</p>
          ) : (
            <div className="invitations invitationContainer">
              {invitations.map(invitation => (
                <div key={invitation.id} className="invitations invitationField">
                  <div className="invitations invitationImgContainer">
                    <img className="invitations invitationImg" src={invitation.groupImage} alt="Group Image" />
                  </div>
                  <div className="invitations invitationGroupName">
                    {invitation.groupName}
                  </div>
                  <div className="invitations buttonContainer">
                    <Button
                      className="invitations acceptButton"
                      onClick={() => handleAccept(invitation)}>
                      Accept
                    </Button>
                  </div>
                  <div className="invitations buttonContainer">
                    <Button
                      className="invitations declineButton"
                      onClick={() => handleDecline(invitation)}>
                      Decline
                    </Button>
                  </div>
                </div>

              ))}
            </div>
          )}
        </div>
      </BaseContainer>
      <Footer></Footer>
    </div>
  );
};

export default Invitations;
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


//TODO: define the Invitation
interface Invitation{
}

const invitationField=(props)=>{}

const Invitations = (invitation) => {
  const navigate = useNavigate();
  const {userid} = useParams();
  const [refreshinvitation,setRefreshinvitation]=useState(false);
  const [invitations,setInvitations]=useState<Invitation[]>(null)

  useEffect(()=>{
    async function fetchInvitations(){
      try{
        const response=await api.get(`/users/${userid}/invitations`)
        setInvitations(response.data);
      }catch (error) {
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
    fetchInvitations();
  }, [refreshinvitation]);
  const handleAccept= async (invitation)=>{
    try{
      const response=await  api.put(`users/${userid}/${invitation.id}/accept`);
      //TODO:navigate means refresh data and allow us to see the joined group right now??
      navigate("/home")
    }catch (error){
      alert("Accepting failed.");
    }
  }
  const handleDeny=async (invitation)=>{
    try{
      const response=await  api.put(`users/${userid}/${invitation.id}/deny`);
      //after denying an invitation, reload the user's invitations
      setRefreshinvitation(prev=>!prev);
    }catch (error){
      alert("Denying failed.");
    }
  }

  return(
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
        {/*default invitations*/}
        <ul className="invitations container">
          <li className="invitations invitationHead">
            <div className="invitations column1">Group Game</div>
            <div className="invitations column2">Inviter&apos;s Email</div>
            <div className="invitations column3">Accept</div>
            <div className="invitations column3">Deny</div>
          </li>
          <li className="invitations invitationField">
            <div
              style={{ paddingLeft: "10px" }}
              className="invitations column1">
              Carrot Crew
            </div>
            <div className="invitations column2">brocc.oli@domain.com</div>
            <div className="invitations column3">
              <Button
                className="invitations acceptButton"
                onClick={() => handleAccept(invitation)}>
              </Button>
            </div>
            <div className="invitations column3">
              <Button
                className="invitations denyButton"
                onClick={() => handleDeny(invitation)}>
              </Button>
            </div>
          </li>
          <li className="invitations invitationField">
            <div
              style={{ paddingLeft: "10px" }}
              className="invitations column1">
              Potato Crew
            </div>
            <div className="invitations column2">brocc.oli@domain.com</div>
            <div className="invitations column3">
              <Button
                className="invitations acceptButton"
                onClick={() => handleAccept(invitation)}>
              </Button>
            </div>
            <div className="invitations column3">
              <Button
                className="invitations denyButton"
                onClick={() => handleDeny(invitation)}>
              </Button>
            </div>
          </li>
          {/*TODO:display the actual invitation data rather than the default
        </ul>
        {invitations.length===0?(
          <p className="invitations noInvitation">No invitations....</p>
        ):(
          <ul className="invitations container">
            <li className="invitations invitationHead">
              <div className="invitations column1">Group Game</div>
              <div className="invitations column2">Inviter&apos;s Email</div>
              <div className="invitations column3">Accept</div>
              <div className="invitations column3">Deny</div>
            </li>
            <div>
              {invitations.map(invitation=> (
                <li key={invitation.id} className="invitations invitationField">
                  <div
                    style={{ paddingLeft: "10px" }}
                    className="invitations column1">
                    invitation.groupName
                  </div>
                  <div className="invitations column2">
                    invitation.inviterEmail
                  </div>
                  <div className="invitations column3">
                    <Button
                      className="invitations acceptButton"
                      onClick={() => handleAccept(invitation)}>
                    </Button>
                  </div>
                  <div className="invitations column3">
                    <Button
                      className="invitations denyButton"
                      onClick={() => handleDeny(invitation)}>
                    </Button>
                  </div>
                </li>
              ))}
            </div>

          </ul>*/}
        </ul>

      </BaseContainer>
    </div>
  )
}

export default Invitations;
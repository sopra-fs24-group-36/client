import React, { useState } from "react";
import "../../styles/ui/Dashboard.scss";
import { Button } from "components/ui/Button";
import { useNavigate, useParams } from "react-router-dom";
import PropTypes from "prop-types";
// @ts-ignore
import login from "../../assets/login.png";
import InviteUserModal from "components/views/InviteUserModal";


const Dashboard = ({ showButtons, activePage }) => {
  const navigate = useNavigate();
  const { groupID } = useParams();

  const userID = parseInt(localStorage.getItem("userID"));
  const [isInviteUserModalOpen, setIsInviteUserModalOpen] = useState(false);

  const doRecipe = async () => {
    navigate("/recipes");
  };
  const doGroup = async () => {
    navigate("/groups");
  };
  const doCalendar = async () => {
    navigate("/calendars");
  };
  const doGroupCalendar = async () => {
    navigate(`/groups/${userID}/calendars`);
  };
  const doShopping = async () => {
    navigate(`/users/${userID}/shoppinglists`);
  };
  const doGroupShopping = async () => {
    navigate(`/groups/${groupID}/shoppinglists`);
  };
  const doInvitations = async () => {
    navigate(`/users/${userID}/invitations`);
  };
  const doLeaveGroup = async () => {
    /*TODO: to leave a group DELETE
    * navigate("/groups/:groupID/:id")*/
    navigate("/home");
  };
  const doLogout = async () => {
    //TODO:clear local storage
    navigate("/users/login");
  };

  return (
    <div className="dashboard container">
      <div className="dashboard header">
        <h2 className="dashboard title">Dashboard</h2>
      </div>
      {showButtons.recipe && (
        <div className="dashboard button-container">
          <Button
            className={`db${activePage === "recipe" ? " highlight" : ""}`}
            onClick={() => doRecipe()}
          >
            Add a recipe
          </Button>
        </div>
      )}
      {showButtons.group && (
        <div className="dashboard button-container">
          <Button
            className={`db${activePage === "group" ? " highlight" : ""}`}
            onClick={() => doGroup()}
          >
            Add a group
          </Button>
        </div>
      )}
      {showButtons.calendar && (
        <div className="dashboard button-container">
          <Button
            className={`db${activePage === "calendar" ? " highlight" : ""}`}
            onClick={() => doCalendar()}
          >
            Calendar
          </Button>
        </div>
      )}
      {showButtons.groupCalendar && (
        <div className="dashboard button-container">
          <Button
            className={`db${activePage === "groupCalendar" ? " highlight" : ""}`}
            onClick={() => doGroupCalendar()}
          >
            Group - Calendar
          </Button>
        </div>
      )}
      {showButtons.shoppinglist && (
        <div className="dashboard button-container">
          <Button
            className={`db${activePage === "shoppinglist" ? " highlight" : ""}`}
            onClick={() => doShopping()}
          >
            Shopping list
          </Button>
        </div>
      )}
      {showButtons.groupShoppinglist && (
        <div className="dashboard button-container">
          <Button
            className={`db${activePage === "groupShoppinglist" ? " highlight" : ""}`}
            onClick={() => doGroupShopping()}
          >
            Group - Shopping list
          </Button>
        </div>
      )}
      {showButtons.inviteUser && (
        <div className="dashboard button-container">
          <Button
            className={`db${activePage === "inviteUser" ? " highlight" : ""}`}
            onClick={() => setIsInviteUserModalOpen(true)}>
            Invite a user
          </Button>
          <InviteUserModal
            open={isInviteUserModalOpen}
            onClose={() => setIsInviteUserModalOpen(false)}>
          </InviteUserModal>
        </div>
      )}
      {showButtons.invitations && (
        <div className="dashboard button-container">
          <Button
            className={`db${activePage === "invitations" ? " highlight" : ""}`}
            onClick={() => doInvitations()}
          >
            Invitations
          </Button>
        </div>
      )}
      {showButtons.leaveGroup && (
        <div className="dashboard button-container">
          <Button
            className={`db${activePage === "leaveGroup" ? " highlight" : ""}`}
            onClick={() => doLeaveGroup()}
          >
            Leave the group
          </Button>
        </div>
      )}
      <div className="dashboard logout-container">
        <Button className="db logout" onClick={() => doLogout()}>
          <img className={"dashboard logout-img"} src={login} alt="Icon" />
          Log out
        </Button>
      </div>
    </div>
  );
};

Dashboard.propTypes = {
  showButtons: PropTypes.object.isRequired,
  activePage: PropTypes.string.isRequired,
};

export default Dashboard;
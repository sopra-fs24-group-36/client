import React from "react";
import "../../styles/ui/Dashboard.scss";
import { Button } from "components/ui/Button";
import {useNavigate} from "react-router-dom";
import PropTypes from "prop-types";

/*creation of the dashboard with buttons*/
const Dashboard = () => {
  const navigate = useNavigate();
  const doRecipe = async () => {
    navigate("/game");
  }
  const doGroup = async () => {
    navigate("/groups");
  }
  const doCalendar = async () => {
    navigate("/calendars");
  }
  const doShopping = async () => {
    navigate("/shoppinglists");
  }
  const doInvitations = async () => {
    navigate("/invitations");
  }
  const doLogout = async () => {
    navigate("/users/login");
  }

  return (
    <div className="dashboard container">
      <div className ="dashboard header">
        <h2 className ="dashboard title">Dashboard</h2>
      </div>
      <div className = "dashboard button-container">
        <Button className = "db"
          onClick={() => doRecipe()}>
            Add a recipe
        </Button>
      </div>
      <div className = "dashboard button-container">
        <Button className = "db"
          onClick={() => doGroup()}>
            Add a group
        </Button>
      </div>
      <div className = "dashboard button-container">
        <Button className = "db"
          onClick={() => doCalendar()}>
            Calendar
        </Button>
      </div>
      <div className = "dashboard button-container">
        <Button className = "db"
          onClick={() => doShopping()}>
            Shopping list
        </Button>
      </div>
      <div className = "dashboard button-container ">
        <Button className = "db invitations"
          onClick={() => doInvitations()}>
            Invitations
        </Button>
      </div>
      <div className ="dashboard logout-container">
        <Button className = "db logout"
          onClick={() => doLogout()}>
            Log out 
        </Button>
      </div>
    </div>
  );
};


export default Dashboard;
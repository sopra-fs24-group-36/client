import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { Form, useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/AddGroup.scss";
import PropTypes from "prop-types";
import Dashboard from "components/ui/Dashboard";
import Footer from "components/ui/footer";
import BaseContainer from "components/ui/BaseContainer_new";
import Header_new from "components/views/Header_new";
// @ts-ignore
import select_image from "../../assets/select_image.png";

const FormField = (props) => {
  return (
    <div className="groups field">
      <label className="groups label">{props.label}</label>
      <input
        className="groups input"
        placeholder="enter here..."
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

const MembersField = (props) => {
  return (
    <div className="groups membersField">
      <input className="groups membersInput" value={props.value} readOnly />
      <Button className="group plus" onClick={props.onRemove}>
        Remove
      </Button>
    </div>
  );
};


MembersField.propTypes = {
  value: PropTypes.string,
  onRemove: PropTypes.func,
};

const AddGroup = () => {
  const navigate = useNavigate();
  const [group_name, set_group_name] = useState("");
  const [group_members, set_group_members] = useState([]);
  const [new_member, set_new_member] = useState("");

  const addMember = () => {
    if (new_member.trim() !== "") { // Make sure the input is not empty
      set_group_members([...group_members, new_member]);
      set_new_member("");
    }
  };

  const removeMember = (index) => {
    const new_members = [...group_members];
    new_members.splice(index, 1);
    set_group_members(new_members);
  };

  const addImage = () => { /*to add an image to a group*/
  };

  const saveChanges = async () => {
    try {
      const requestBody = JSON.stringify({
        group_name: group_name,
        group_members: group_members,
      });
      const response = await api.post("/groups", requestBody);
    } catch (error) {
      console.error("An error occurred while creating groups:", error);
      alert("Creating a group failed because the details were incomplete.");
    }
  };

  return (
    <div>
      <Header_new></Header_new>
      <Dashboard></Dashboard>
      <BaseContainer>
        <div className="groups headerContainer">
          <div className="groups backButtonContainer">
            <Button
              className="backButton"
              onClick={() => navigate("/home")}
            >Back</Button>
          </div>
          <div className="groups titleContainer">
            <h2 className="groups title">Add a group</h2>
          </div>
          <div className="groups addButtonContainer">
            <Button
              className="group add"
              disabled={group_name.trim() === "" || group_members.length === 0}
              onClick={() => saveChanges()}>
              Add Group
            </Button>
          </div>
        </div>
        <div className="groups container">
          <div className="groups formLeft">
            <div
              className="groups imageContainer"
              onClick={addImage}
            >
              <img src={select_image} alt="icon" className="groups image"></img>
            </div>
          </div>

          <div className="groups formRight">
            <div className="groups addNameContainer">
              <label className="groups label">Add a name:</label>
              <FormField
                value={group_name}
                onChange={(rl: string) => set_group_name(rl)}
              ></FormField>
            </div>

            <p className="groups p">Add group members:</p>
            {group_members.map((new_member, index) => (
              <MembersField
                key={index}
                value={new_member}
                onRemove={() => removeMember(index)}
              />
            ))}

            <div className="groups addNameContainer">
              <label className="groups label">Enter the E-mail:</label>
              <FormField
                value={new_member}
                onChange={(rl: string) => set_new_member(rl)}
              ></FormField>
              <Button className="group plus" onClick={addMember}>
                +
              </Button>
            </div>
          </div>
        </div>
      </BaseContainer>
      <Footer></Footer>
    </div>
  );
};

export default AddGroup;

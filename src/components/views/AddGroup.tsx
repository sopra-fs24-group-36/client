import React, { useEffect, useState } from "react";
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
import Group from "models/Group";
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
      <Button
        className="group plus"
        onClick={props.onRemove}
        disabled={props.value === props.currentUserEmail}
      >
        Remove
      </Button>
    </div>
  );
};


MembersField.propTypes = {
  value: PropTypes.string,
  onRemove: PropTypes.func,
  currentUserEmail: PropTypes.string,
};

const AddGroup = () => {
  const navigate = useNavigate();
  const [name, set_group_name] = useState("");
  const [membersNames, set_group_members] = useState([]);
  const [new_member, set_new_member] = useState("");
  const [user_email, setEmail] = useState<string>(null);
  const [userID, setUserID] = useState<string>(null);
  const [selectedImage, set_selectedImage] = useState(null);

  const addMember = () => {
    if (new_member.trim() !== "") { // Make sure the input is not empty
      set_group_members([...membersNames, new_member]);
      set_new_member("");
    }
  };

  const removeMember = (index) => {
    const new_members = [...membersNames];
    new_members.splice(index, 1);
    set_group_members(new_members);
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
          set_selectedImage(dataURL);
        };
        reader.readAsDataURL(file as Blob);
      }
    };
    input.click();
  };


  const getEmail = async () => {
    try {
      //get current user 
      setUserID(parseInt(localStorage.getItem("userID")));
      const response = await api.get(`/users/${userID}`);
      const email = response.data.email;
      console.log(email);
      setEmail(email);//getting the username so we can show in the header
    } catch (error) {
      console.error(`Error getting username: ${handleError(error)}`);
    }
  };

  useEffect(() => {
    getEmail();
    set_selectedImage(select_image);
  }, []);

  const saveChanges = async () => {
    try {
      const requestBody = JSON.stringify({
        name: name,
        membersNames: membersNames,
        image: selectedImage,
        creator: userID,
      });
      const response = await api.post("/groups", requestBody);
      const group = new Group(response.data);
    } catch (error) {
      console.error("An error occurred while creating groups:", error);
      alert("Creating a group failed because the details were incomplete.");
    }
    navigate("/home");
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
        activePage="group"
      />
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
              disabled={name.trim() === "" || membersNames.length === 0}
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
              <img src={selectedImage} alt="icon" className="groups image"></img>
            </div>
          </div>

          <div className="groups formRight">
            <div className="groups addNameContainer">
              <label className="groups label">Add a name:</label>
              <FormField
                value={name}
                onChange={(rl: string) => set_group_name(rl)}
              ></FormField>
            </div>

            <p className="groups p">Add group members:</p>
            {membersNames.map((new_member, index) => (
              <MembersField
                key={index}
                value={new_member}
                currentUserEmail={user_email}
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

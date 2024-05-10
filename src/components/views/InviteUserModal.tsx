import React, { useState } from "react";
import { api } from "helpers/api";
import PropTypes from "prop-types";
import { Button } from "components/ui/Button";
import ReactDOM from "react-dom";
import "styles/views/Modal.scss";
import { useParams } from "react-router-dom";

const FormField = (props) => {
  return (
    <div className="modal field">
      <div className="modal input-container">
        <input
          className="modal input"
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
          placeholder="Enter an email address"
        />
      </div>
    </div>
  );
};

FormField.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

const InviteUserModal = ({ open, onClose }) => {
  const [email, setEmail] = useState("");
  const { groupID } = useParams();
  if (!open) return null;

  const handleInvite = async () => {
    const userEmail = localStorage.getItem("userEmail");
    if (email === "") {
      alert("Please enter an email address.");

      return;
    }
    if (email === userEmail) {
      alert("You can't invite yourself");

      return;
    }
    try {
      const requestBody = JSON.stringify({
        email: email,
      });
      await api.post(`/groups/${groupID}/invitations`, requestBody);
    } catch (error) {
      console.error("An error occurred while inviting a user:", error);
      alert("Inviting a user failed.");
    }
    onClose();
  };

  return ReactDOM.createPortal(
    <>
      <div className="modal backdrop"></div>
      ;
      <div className="modal conatiner">
        <div className="modal title">Invite a User</div>
        <div className="modal text">
          Enter the email address of the user you want to invite below
        </div>
        <FormField
          value={email}
          onChange={setEmail} />
        <div className="modal button-container">
          <Button className="modal button" onClick={onClose}>
            Cancel
          </Button>
          <Button className="modal highlight" onClick={handleInvite}>
            Send
          </Button>
        </div>
      </div>
    </>,
    document.getElementById("portal-invite-user"),
  );
};

InviteUserModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default InviteUserModal;
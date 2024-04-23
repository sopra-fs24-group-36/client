import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import PropTypes from "prop-types";
import { Button } from "components/ui/Button";
import ReactDOM from "react-dom";
import "styles/views/InviteUserModal.scss";
import { useParams } from "react-router-dom";

const FormField = (props) => {
  return (
    <div className="invite field">
      <div className="invite input-container">
        <input
          className="invite input"
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
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
  const {groupID}=useParams();
  if (!open) return null;

  const handleInvite = async () => {
    try{
      const requestBody=JSON.stringify({
        email:email,
      })
      const response=await api.post(`/groups/${groupID}/invitations`,requestBody);
    }catch (error){
      console.error("An error occurred while inviting a user:",error);
      alert("Inviting a user failed.");
    }
    /*TODO: handel invite a user
    *  check if email is vaild, send invitation*/
    onClose();
  };

  return ReactDOM.createPortal(
    <>
      <div className="invite backdrop"></div>;
      <div className="invite conatiner">
        <div className="invite title">Invite a User</div>
        <FormField
          value={email}
          onChange={setEmail} />
        <div className="invite button-container">
          <Button className="invite button" onClick={onClose}>
            Cancel
          </Button>
          <Button className="invite highlight" onClick={handleInvite}>
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
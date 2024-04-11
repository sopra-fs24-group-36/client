import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button } from "components/ui/Button";
import ReactDOM from "react-dom";
import "styles/views/InviteUserModal.scss";

const FormField = (props) => {
  return (
    <div className="invite field">
      <div className="invite input-container">
        <input
          className="invite input"
          placeholder="Enter the User's Email..."
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
  if (!open) return null;

  const handleInvite = async () => {
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
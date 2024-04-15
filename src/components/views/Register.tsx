import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { Form, useNavigate } from "react-router-dom";

import { Button } from "components/ui/Button";
import "styles/views/Login.scss";
import PropTypes from "prop-types";
// @ts-ignore
import rightBrok from "../../assets/rightBrok.png";

const Icon = ({ flip }) => {
  const iconClass = flip ? "icon flip-horizontal" : "icon";
  
  return <img src={rightBrok} alt="Icon" className={iconClass} />;
};
Icon.propTypes = {
  flip: PropTypes.bool,
};

const FormField = (props) => {
  return (
    <div className="login field">
      <label className="login label">{props.label}</label>
      <input
        className="login input"
        placeholder="type here..."
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

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>(null);
  const [email, setEmail] = useState<string>(null);
  const [password, setPassword] = useState<string>(null);
  const [name, setName] = useState<string>(null);

  const doRegister = async () => {
    try {
      const requestBody = JSON.stringify({ username, email, password, name });
      const response = await api.post("/users", requestBody);

      if (!response.data) {
        throw new Error();
      }
      const user = new User(response.data);
      //store ID in the local storage
      localStorage.setItem("userID", user.id);
      // Store the token into the local storage.
      localStorage.setItem("token", user.token);
      navigate("/home"); //navigating to home after successful login
    } catch (error) {
      alert(
        `Something went wrong during the register: \n${handleError(error)}`,
      );
      setName("");
      setEmail("");
      setUsername("");
      setPassword("");
    }
  };

  return (
    <div>
      <div className="login container">
        <div className="login form">
          <div className="login title">
            <Icon flip />
            Register
            <Icon flip={false}/>
          </div>
          <FormField
            label="Username:"
            value={username}
            onChange={(un: string) => setUsername(un)}
          />
          <FormField
            label="Name(optional):"
            value={name}
            onChange={(un: string) => setName(un)}
          />
          <FormField
            label="Email:"
            value={email}
            onChange={(e) => setEmail(e)}
          />
          <FormField
            label="Password:"
            value={password}
            onChange={(n) => setPassword(n)}
          />
          <div className="login button-container">
            <Button
              width="50%"
              onClick={() => navigate("/users/login")}
            >
              Return
            </Button>
            <Button
              disabled={!username || !password || !email}
              width="50%"
              onClick={() => doRegister()}
            >
              Register
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

};

export default Register;

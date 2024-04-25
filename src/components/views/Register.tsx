import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { Form, useNavigate } from "react-router-dom";

import { Button } from "components/ui/Button";
import "styles/views/Login.scss";
import PropTypes from "prop-types";
// @ts-ignore
import rightBrok from "../../assets/rightBrok.png";
// @ts-ignore
import defaultUser from "../../assets/defaultUser.png";

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
        type = {props.type}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  type: PropTypes.string,
};

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>(null);
  const [email, setEmail] = useState<string>(null);
  const [password, setPassword] = useState<string>(null);
  const [name, setName] = useState<string>(null);

  const doRegister = async () => {
    try {
      const requestBody = JSON.stringify({
        username: username,
        email: email,
        password: password,
        name: name,
        profilePicture: defaultUser,
      });
      const response = await api.post("/users", requestBody);

      if (!response.data) {
        throw new Error();
      }
      const user = new User(response.data);
      //store ID in the local storage
      localStorage.setItem("userID", user.id);
      // Store the token into the local storage.
      localStorage.setItem("token", user.token);
      navigate("/users/login"); //navigating to home after successful login
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
            <Icon flip={false} />
          </div>
          <FormField
            label="Username:"
            value={username}
            onChange={(un: string) => setUsername(un)}
            type="text"
          />
          <FormField
            label="Name (optional):"
            value={name}
            onChange={(un: string) => setName(un)}
            type="text"
          />
          <FormField
            label="Email:"
            value={email}
            onChange={(e) => setEmail(e)}
            type="text"
          />
          <FormField
            label="Password:"
            value={password}
            onChange={(n) => setPassword(n)}
            type="password"
          />
          <div className="login button-container">
            <Button
              width="45%"
              onClick={() => navigate("/users/login")}
            >
              Return
            </Button>
            <Button
              disabled={!username || !password || !email}
              width="45%"
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

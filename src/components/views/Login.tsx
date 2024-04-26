import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Login.scss";
import BaseContainer from "components/ui/BaseContainer";
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

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>(null);
  const [password, setPassword] = useState<string>(null);
  const handleRegisterClick = () => {
    navigate("/users");
  };

  const doLogin = async () => {
    try {
      const requestBody = JSON.stringify({ username, password });
      const response = await api.post("/users/login", requestBody);

      // Get the returned user and update a new object.
      const user = new User(response.data);

      // Store the token into the local storage.
      localStorage.setItem("token", user.token);
      //store ID in the local storage 
      localStorage.setItem("userID", user.id);
      localStorage.setItem("userEmail", user.email);

      // Login successfully worked --> navigate to the route /home
      navigate("/home");
    } catch (error) {
      alert(
        `Something went wrong during the login: \n${handleError(error)}`,
      );
    }
  };

  return (
    <BaseContainer>
      <div className="login container">
        <div className="login form">
          <div className="login title">
            <Icon flip />
            Login
            <Icon flip={false} />
          </div>
          <FormField
            label="Please enter your username:"
            value={username}
            onChange={(un: string) => setUsername(un)}
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
              disabled={!username || !password}
              width="100%"
              onClick={() => doLogin()}
            >
              Login
            </Button>
          </div>
          <div style={{ textAlign: "center" }}>
            <p>
              Don`t have an account?<br />
              You can register{" "}
              <span className="register-link" onClick={handleRegisterClick}>
              here
              </span>
              .
            </p>
          </div>
        </div>
      </div>
    </BaseContainer>
  );
};

/**
 * You can get access to the history object's properties via the useLocation, useNavigate, useParams, ... hooks.
 */
export default Login;

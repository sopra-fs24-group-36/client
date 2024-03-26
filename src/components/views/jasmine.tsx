import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import {useNavigate} from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/jasmine.scss";
import BaseContainer_new from "components/ui/BaseContainer_new";
import Dashboard from "components/ui/Dashboard";
import PropTypes from "prop-types";
import Footer from "components/ui/footer"

/*
It is possible to add multiple components inside a single file,
however be sure not to clutter your files with an endless amount!
As a rule of thumb, use one file per component and only add small,
specific components that belong to the main one in the same file.
 */
const FormField = (props) => {
  return (
    <div className="login field">
      <label className="login label">{props.label}</label>
      <input
        className="login input"
        placeholder="enter here.."
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

const Login = () => {
  const navigate = useNavigate();
  const [name, setName] = useState<string>(null);
  const [username, setUsername] = useState<string>(null);

  const doLogin = async () => {
    try {
      const requestBody = JSON.stringify({ username, name });
      const response = await api.post("/users", requestBody);

      // Get the returned user and update a new object.
      const user = new User(response.data);

      // Store the token into the local storage.
      localStorage.setItem("token", user.token);

      // Login successfully worked --> navigate to the route /game in the GameRouter
      navigate("/game");
    } catch (error) {
      alert(
        `Something went wrong during the login: \n${handleError(error)}`
      );
    }
  };


  return (
    <div>
        <Dashboard>
        </Dashboard>
        <BaseContainer_new>
        <div className="login container">
            <div className="login form">
            <FormField
                label="Username"
                value={username}
                onChange={(un: string) => setUsername(un)}
            />
            <FormField
                label="Name"
                value={name}
                onChange={(n) => setName(n)}
            />
            <div className="login button-container">
                <Button
                disabled={!username || !name}
                width="100%"
                onClick={() => doLogin()}
                >
                Login
                </Button>
            </div>
            </div>
        </div>
        </BaseContainer_new>
        <Footer></Footer>
    </div>
  );
};

/**
 * You can get access to the history object's properties via the useLocation, useNavigate, useParams, ... hooks.
 */
export default Login;

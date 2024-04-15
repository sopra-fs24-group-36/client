import React, { useState } from "react";
import PropTypes from "prop-types";
import "../../styles/views/Header_new.scss";
import { Button } from "components/ui/Button";
// @ts-ignore
import User from "../../assets/defaultUser.png"; 
import {useNavigate} from "react-router-dom";
import { api, handleError } from "helpers/api";

/**
 * This is an example of a Functional and stateless component (View) in React. Functional components are not classes and thus don't handle internal state changes.
 * Conceptually, components are like JavaScript functions. They accept arbitrary inputs (called “props”) and return React elements describing what should appear on the screen.
 * They are reusable pieces, and think about each piece in isolation.
 * Functional components have to return always something. However, they don't need a "render()" method.
 * https://react.dev/learn/your-first-component and https://react.dev/learn/passing-props-to-a-component 
 * @FunctionalComponent
 */

const Header_new = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>(null);

  const doProfile = () => {
    navigate("/users/profile");
  };
  //to show the userame in the header -> get request not implemented yet in backend
  const getUsername = async () => {
    try{
      //get current user 
      const currentUserID = localStorage.getItem("userID"); //get the username of the currently logged in user 
      const response = await api.get(`/users/${currentUserID}`)
      const user = new User(response.data); //user returned from getting the user 
      const uname = user.username;
      setUsername(uname) //getting the username so we a) know who is currently logged in and b) can say Hello {username}!
    }
    catch (error) {
      console.error(`Error getting username: ${handleError(error)}`);
    }
  }

  return (
    <div className="header_new container">
      <Button className="header_new userProfile" onClick={doProfile}>
        <img src={User} alt="Profile Picture" className="header_new profileImage" />
        <h2 className="header_new title">username</h2> 
      </Button>
    </div>
  );
};

export default Header_new;

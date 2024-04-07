import React from "react";
import PropTypes from "prop-types";
import "../../styles/views/Header_new.scss";
import { Button } from "components/ui/Button";
// @ts-ignore
import User from "../../assets/defaultUser.png"; 
import {useNavigate} from "react-router-dom";

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

  const doProfile = () => {
    navigate("/users/profile");
  };

  return (
    <div className="header_new container">
      <Button className="header_new userProfile" onClick={doProfile}>
        <img src={User} alt="Profile Picture" className="header_new profileImage" />
        <h2 className="header_new title">Username</h2>
      </Button>
    </div>
  );
};

export default Header_new;

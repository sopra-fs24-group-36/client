import React from "react";
import {ReactLogo} from "../ui/ReactLogo";
import PropTypes from "prop-types";
import "../../styles/views/Header_new.scss";

/**
 * This is an example of a Functional and stateless component (View) in React. Functional components are not classes and thus don't handle internal state changes.
 * Conceptually, components are like JavaScript functions. They accept arbitrary inputs (called “props”) and return React elements describing what should appear on the screen.
 * They are reusable pieces, and think about each piece in isolation.
 * Functional components have to return always something. However, they don't need a "render()" method.
 * https://react.dev/learn/your-first-component and https://react.dev/learn/passing-props-to-a-component 
 * @FunctionalComponent
 */
const Header_new = props => (
  <div className="header_new container">
    <ReactLogo classname="header_new logo" width="60px" height="60px"/>
    <h2 className="header_new title">Username</h2>
  </div>
);

/**
 * Don't forget to export your component!
 */
export default Header_new;

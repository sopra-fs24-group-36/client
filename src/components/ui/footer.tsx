import React from "react";
import {ReactLogo} from "../ui/ReactLogo";
import PropTypes from "prop-types";
import "../../styles/ui/Footer.scss";
import { Form } from "react-router-dom";
import { Button } from "components/ui/Button";

/**
 * This is an example of a Functional and stateless component (View) in React. Functional components are not classes and thus don't handle internal state changes.
 * Conceptually, components are like JavaScript functions. They accept arbitrary inputs (called “props”) and return React elements describing what should appear on the screen.
 * They are reusable pieces, and think about each piece in isolation.
 * Functional components have to return always something. However, they don't need a "render()" method.
 * https://react.dev/learn/your-first-component and https://react.dev/learn/passing-props-to-a-component 
 * @FunctionalComponent
 */

const FormField = (props) => {
  return (
    <div className="footer field">
      <label className="footer label">{props.label}</label>
      <input
        className="footer input"
        placeholder="search here..."
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

const Footer = () => (
  <div className="footer container">
    <h2 className="footer title">Search for recipe</h2>
    <FormField>
    </FormField>
    <div  className="footer button-container">
      <Button className="footer-button">Search</Button>
    </div>    
  </div>
);

/**
 * Don't forget to export your component!
 */
export default Footer;

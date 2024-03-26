import React from "react";
import "../../styles/ui/BaseContainer_new.scss";
import PropTypes from "prop-types";

/*** NEW BASE CONTAINER CREATING GREEN BOX ***/
const BaseContainer = props => (
  <div {...props} className={`base-container-new ${props.className ?? ""}`}>
    {props.children}
  </div>
);

BaseContainer.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

export default BaseContainer;
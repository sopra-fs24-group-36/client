import React from "react";
import {useParams, Navigate, Outlet} from "react-router-dom";
import PropTypes from "prop-types";

/**
 * @Guard
 * @param props
 */
export const RecipeGuard = () => {
  const {authorID, recipeID} = useParams();
  const userID = localStorage.getItem("userID")
  if (userID === authorID) {
    
    return <Outlet />;
  }
  
  return <Navigate to={"/home"} replace />;
};

RecipeGuard.propTypes = {
  children: PropTypes.node
};
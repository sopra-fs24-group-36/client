import React from "react";
import {useParams, Navigate, Outlet} from "react-router-dom";
import PropTypes from "prop-types";

/**
 * @Guard
 * @param props
 */
export const EditRecipeGuard = () => {
  const {authorID, recipeID} = useParams();
  const userID = localStorage.getItem("userID")
  if (userID ===authorID) {
    
    return <Outlet />;
  }
  
  return <Navigate to={`/users/${authorID}/cookbooks/${recipeID}`} replace />;
};

EditRecipeGuard.propTypes = {
  children: PropTypes.node
};
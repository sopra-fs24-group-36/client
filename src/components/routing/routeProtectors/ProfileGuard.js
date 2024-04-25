import React from "react";
import {useParams, Navigate, Outlet} from "react-router-dom";
import PropTypes from "prop-types";

/**
 * @Guard
 * @param props
 */
export const ProfileGuard = () => {
  const {userID} = useParams();
  const currentUserID = localStorage.getItem("userID")
  if (userID === currentUserID) {
    
    return <Outlet />;
  }
  
  return <Navigate to={"/home"} replace />;
};

ProfileGuard.propTypes = {
  children: PropTypes.node
};
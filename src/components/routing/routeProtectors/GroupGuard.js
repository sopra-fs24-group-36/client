import React, { useEffect, useState } from "react";
import { useParams, Navigate, Outlet } from "react-router-dom";
import PropTypes from "prop-types";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";

export const GroupGuard = ({ children }) => {
  const { groupID, recipe_ID } = useParams();
  const group_ID = groupID
  const userID = localStorage.getItem("userID");
  const [isUserInGroup, setIsUserInGroup] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get(`/users/${userID}/groups`);
        const userGroups = response.data.map(group => parseInt(group.groupID));
        setIsUserInGroup(userGroups.includes(parseInt(group_ID)));
      } catch (error) {
        console.error(`Something went wrong while fetching the groups: \n${handleError(error)}`);
        console.error("Details:", error);
        alert("Something went wrong while fetching the groups! See the console for details.");
      }
    }
    fetchData();
  }, [userID, group_ID]);

  if (isUserInGroup === null) {
    // Loading state, you may want to render a spinner or a loading indicator here
    return <Spinner/>;
  }

  if (!isUserInGroup) {
    // User is not in the group, navigate to home
    return <Navigate to="/home" replace />;
  }

  // User is in the group, render the child components
  return <Outlet />;
};

GroupGuard.propTypes = {
  children: PropTypes.node,
};

export default GroupGuard;
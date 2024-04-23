import React, { useEffect, useState } from "react";
import { useParams, Navigate, Outlet } from "react-router-dom";
import PropTypes from "prop-types";
import { api, handleError } from "helpers/api";

export const GroupRecipeGuard = () => {
    const { group_ID, recipeID } = useParams();
    const userID = localStorage.getItem("userID"); 
    let [checker, setChecker] = useState(false);
  
    useEffect(() => {
        async function fetchData() {
          try {
            const response = await api.get(`/users/${userID}/groups`);
            const isUserInGroup = response.data.some(group => parseInt(group.groupID) === parseInt(group_ID));
            console.log(isUserInGroup); 
            if(isUserInGroup === true){
                setChecker(true); 
            }
            console.log(checker)
          } catch (error) {
            console.error(`Something went wrong while fetching the groups: \n${handleError(error)}`);
            console.error("Details:", error);
            alert("Something went wrong while fetching the groups! See the console for details.");
          }
        }
        fetchData();
      }, [userID, group_ID]);

    if (checker) {
      return <Outlet />;
    }
  
    // If the user is not part of the group, navigate to the home page
    return <Navigate to="/home" replace />;
};

GroupRecipeGuard.propTypes = {
    children: PropTypes.node,
};

export default GroupRecipeGuard;
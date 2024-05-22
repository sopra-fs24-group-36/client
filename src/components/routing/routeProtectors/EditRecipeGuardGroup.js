import React, {useState, useEffect} from "react";
import {useParams, Navigate, Outlet} from "react-router-dom";
import PropTypes from "prop-types";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";

/**
 * @Guard
 * @param props
 */
export const EditRecipeGuardGroup = () => {
  const {groupID, recipeID} = useParams();
  const userID = localStorage.getItem("userID");
  const [recipeFromUser, setRecipeFromUser] = useState(null);

  useEffect(() => { //retrieve the recipe based on the ID from the URL 
    async function fetchData() {
      try {
        const response = await api.get(`/users/${userID}/cookbooks`);
        console.log(response)
        const userRecipes = response.data.map(recipe => parseInt(recipe.id));
        console.log(userRecipes)
        setRecipeFromUser(userRecipes.includes(parseInt(recipeID)));
      } catch (error) {
        console.error(
          `Something went wrong while fetching the recipes: \n${handleError(error)}`,
        );
        console.error("Details:", error);
        alert("Something went wrong while fetching the recipes! See the console for details.");
      }
    }

    fetchData();
  }, [userID, recipeID]);

  if (recipeFromUser === null) {
    return <Spinner/>;
  }

  if (!recipeFromUser) {
    // User is not in the group, navigate to home
    return <Navigate to={`/groups/${groupID}/cookbooks/${recipeID}`} replace />;
  }
  
  return <Navigate to={`/users/${userID}/cookbooks/${recipeID}/edit`} replace />;
};

EditRecipeGuardGroup.propTypes = {
  children: PropTypes.node
};

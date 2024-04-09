import "styles/views/Home.scss";
import Dashboard from "components/ui/Dashboard";
import PropTypes from "prop-types";
import Footer from "components/ui/footer"
import Header_new from "components/views/Header_new";
import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import {useNavigate} from "react-router-dom";
import { Button } from "components/ui/Button";
// @ts-ignore
import rightBrok from "../../assets/rightBrok.png";
// @ts-ignore
import leftBrok from "../../assets/leftBrok.png";
// @ts-ignore
import wildGarlic from "../../assets/defaultRecipe1.png"; 
// @ts-ignore
import potatoes from "../../assets/defaultRecipe3.png"; 
// @ts-ignore
import Group from "../../assets/defaultUser.png"; 

const Home = () => {
  const navigate = useNavigate();
  const userID = localStorage.getItem("userID"); /*getting the ID of the currently logged in user*/

  const doPersonalRecipes = async () => {
    navigate("/users/cookbooks"); /*to navigate to personal cookbook*/
  }

  const doRecipe = async (recipeID) => { /*to navigate to a recipe*/
    try{
      navigate(`/users/${userID}/cookbooks/${recipeID}`) 
    }
    catch (error) {
      alert(
        `User could not be found: \n${handleError(error)}`
      );
    }
  }

  const doGroup = async(groupID) => {/*to navigate to a group*/
    try{
      navigate(`/logout/${groupID}`) 
    }
    catch (error) {
      alert(
        `User could not be found: \n${handleError(error)}`
      );
    }
  }

  return (
    <div>
      <Header_new />
      <Dashboard />
      <div className="Home containerLeft">
        <div className="Home header">
          <img src={leftBrok} alt="Icon" className="Home icon" />
          <div className="Home headerTitle">
            <h2 className="Home personalTitle">Personal</h2>
            <h2 className="Home personalTitle">Cookbook</h2>
          </div>
          <img src={rightBrok} alt="Broccoli" className="Home icon" />
        </div>
        <div className="Home recipeContainer">
          <Button className="Home recipe">
            <img src={wildGarlic} alt="Recipe" className="Home recipeImage" />
            <div className="Home recipeInfo">
              <h3 className="Home recipeTitle">Wild garlic curry</h3>
              <p className="Home recipeDescription">The perfect recipe for a nice summer evening to enjoy with your friends.</p>
              <p className="Home recipeTime">Total Time: 45min</p>
              <p className="Home recipeTags">Tags: lactose-free, gluten-free</p>
            </div>
          </Button>
          <Button className="Home recipe">
            <img src={potatoes} alt="Recipe" className="Home recipeImage" />
            <div className="Home recipeInfo">
              <h3 className="Home recipeTitle">Friend potatoes with kale</h3>
              <p className="Home recipeDescription">Can’t do anything wrong with this recipe if you don’t have much time. </p>
              <p className="Home recipeTime">Total Time: 30min</p>
              <p className="Home recipeTags">Tags: vegetarian, gluten-free</p>
            </div>
          </Button>
          <div className="Home recipesButtonContainer">
            <Button className="Home personalRecipes" onClick={() => {doPersonalRecipes() }}>
                View all Personal Recipes
            </Button>
          </div>
        </div>
      </div>
      <div className ="Home containerRight">
        <div className = "Home header">
          <h2 className = "Home groupTitle">Group Cookbooks</h2>
        </div>
        <div className="Home groupContainer">
          <div className="Home buttonContainer">
            <Button className="Home group" /*onClick={() => { doGroup(groupID) }}*/>
              <img src={Group} alt="Group" className="Home groupImage" />
              Carrot Crew
            </Button>
          </div>
          <div className="Home buttonContainer">
            <Button className="Home group" /*onClick={() => { doGroup(groupID) }}*/>
              <img src={Group} alt="Group" className="Home groupImage" />
              Spice Girls
            </Button>
          </div>
          <div className="Home buttonContainer">
            <Button className="Home group" /*onClick={() => { doGroup(groupID) }}*/>
              <img src={Group} alt="Group" className="Home groupImage" />
              Lords of Wings
            </Button>
          </div>
          <div className="Home buttonContainer">
            <Button className="Home group" /*onClick={() => { doGroup(groupID) }}*/>
              <img src={Group} alt="Group" className="Home groupImage" />
              Pasta La Vista
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
/**
 * You can get access to the history object's properties via the useLocation, useNavigate, useParams, ... hooks.
 */

export default Home;
import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import {useNavigate} from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Home.scss";
import Dashboard from "components/ui/Dashboard";
import PropTypes from "prop-types";
import Footer from "components/ui/footer"

/*
It is possible to add multiple components inside a single file,
however be sure not to clutter your files with an endless amount!
As a rule of thumb, use one file per component and only add small,
specific components that belong to the main one in the same file.
 */

const Home = () => {
  const navigate = useNavigate();
  const [name, setName] = useState<string>(null);
  const [username, setUsername] = useState<string>(null);

  const doLogin = async () => {
    try {
      const requestBody = JSON.stringify({ username, name });
      const response = await api.post("/users", requestBody);

      // Get the returned user and update a new object.
      const user = new User(response.data);

      // Store the token into the local storage.
      localStorage.setItem("token", user.token);

      // Login successfully worked --> navigate to the route /game in the GameRouter
      navigate("/game");
    } catch (error) {
      alert(
        `Something went wrong during the login: \n${handleError(error)}`
      );
    }
  };


  return (
    <div>
      <Dashboard>
      </Dashboard>
      <div className = "Home containerLeft">
        <div className ="Home header">
          <h2 className = "Home personalTitle">Personal</h2>
          <h2 className = "Home personalTitle">Cookbook</h2>
        </div>
        <div className ="Home recipeContainer">
          <Button className ="Home recipe">

          </Button>
          <Button className ="Home recipe">

          </Button>
        </div>
        <div className ="Home buttonContainer">
          <Button className="Home personalRecipes">
            View all Personal Recipes
          </Button>
        </div>
      </div>
      <div className ="Home containerRight">
        <div className = "Home header">
          <h2 className = "Home groupTitle">Group Cookbooks</h2>
        </div>
        <div className ="Home groupContainer">
          <div className ="Hoome buttonContainer">
            <Button className ="Home group">
                Carrot Crew
            </Button>
          </div>
          <div className ="Hoome buttonContainer">
            <Button className ="Home group">
                Spice Girls
            </Button>
          </div>
          <div className ="Hoome buttonContainer">
            <Button className ="Home group">
                Lords of Wings
            </Button>
          </div>
          <div className ="Hoome buttonContainer">
            <Button className ="Home group">
                Pasta La Vista
            </Button>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
};

/**
 * You can get access to the history object's properties via the useLocation, useNavigate, useParams, ... hooks.
 */
export default Home;

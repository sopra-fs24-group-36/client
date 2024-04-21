import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "../../styles/ui/Footer.scss";
import { useNavigate } from "react-router-dom";
import { api, handleError } from "helpers/api";
import { Button } from "components/ui/Button";
import Recipe from "models/Recipe";
// @ts-ignore
import rightBrok from "../../assets/rightBrok.png"

/**
 * @FunctionalComponent
 */

const FormField = (props) => { /*general form fields for inputting information (e.g. title, description, etc.)*/
  return (
    <div className="recipes field">
      <label className="recipes label">{props.label}</label>
      <input
        className="recipes input"
        placeholder="enter here..."
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

const Footer = () => {
  const currentUserID = localStorage.getItem("userID");
  const navigate = useNavigate(); 
  const [title, set_recipe_title] = useState<string>(null);
  const [link, set_recipe_link] = useState<string>(null);
  const [shortDescription, set_recipe_description] = useState<string>(null); 
  const [image, set_recipe_image] = useState<string>(null); 
  const [cookingTime, set_recipe_prep] = useState<string>(null); 

  const [searchQuery, set_search_query] = useState<string>('');

  const AddRecipe = async() =>{
    try{
      const requestBody = JSON.stringify({title, shortDescription, cookingTime, image, link})
      const response = await api.post(`/users/${currentUserID}/cookbooks`, requestBody);
      const recipe = new Recipe(response.data);
      localStorage.setItem("recipeID", recipe.id); //not 100% sure if we need this, need to check with getting a recipe
      const recipeID = localStorage.getItem("recipeID");
      navigate(`/users/${currentUserID}/cookbooks/${recipeID}`);
    }
    catch(error){
      alert(
        `Something went wrong when saving the recipe: \n${handleError(error)}`,
      );
    }
  }

  return (
    <div className = "footer content">
      <div className = "footer searchbar">
        <div className = "footer searchTitle">
          <p>Search for recipes:</p>
        </div>
        <div className = "footer searchContent">
          <FormField
            value = {title}
            onChange={(rt: string) => set_recipe_title(rt)}>
          </FormField>
        </div>
        <div className = "footer searchButton">
          <Button className = "footer-button">
            Search
          </Button>
        </div>
      </div>
      <div className = "footer recipesContainer">
        <div className = "footer recipe">
          <div className = "footer recipeContent">
            <div className ="footer recipeTitleContainer">
              <p className = "footer recipeTitle">
                The first Recipe
              </p>
            </div>
            <div className = "footer recipeImageContainer">
            <img src={rightBrok} alt="Broccoli" className="Home icon" />
            </div>
            <div className = "footer recipeDescriptionContainer">
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            </div>
            <div className = "footer recipeButton">
              <Button className = "footer-footerButton">View recipe</Button>
            </div>
            <div className = "footer recipeButton">
              <Button className = "footer-footerButton">Add recipe</Button>
            </div>
          </div>
        </div>
        <div className = "footer recipe">
          <div className = "footer recipeContent">
            <div className ="footer recipeTitleContainer">
              <p className = "footer recipeTitle">
                The second Recipe
              </p>
            </div>
            <div className = "footer recipeImageContainer">
              <img src={rightBrok} alt="Broccoli" className="Home icon" />
            </div>
            <div className = "footer recipeDescriptionContainer">
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            </div>
            <div className = "footer recipeButton">
              <Button className = "footer-footerButton">View recipe</Button>
            </div>
            <div className = "footer recipeButton">
              <Button className = "footer-footerButton">Add recipe</Button>
            </div>
          </div>
        </div>
        <div className = "footer recipe">
          <div className = "footer recipeContent">
            <div className ="footer recipeTitleContainer">
              <p className = "footer recipeTitle">
                The second Recipe
              </p>
            </div>
            <div className = "footer recipeImageContainer">
              <img src={rightBrok} alt="Broccoli" className="Home icon" />
            </div>
            <div className = "footer recipeDescriptionContainer">
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            </div>
            <div className = "footer recipeButton">
              <Button className = "footer-footerButton">View recipe</Button>
            </div>
            <div className = "footer recipeButton">
              <Button className = "footer-footerButton">Add recipe</Button>
            </div>
          </div>
        </div>
        <div className = "footer recipe">
          <div className = "footer recipeContent">
            <div className ="footer recipeTitleContainer">
              <p className = "footer recipeTitle">
                The second Recipe
              </p>
            </div>
            <div className = "footer recipeImageContainer">
              <img src={rightBrok} alt="Broccoli" className="Home icon" />
            </div>
            <div className = "footer recipeDescriptionContainer">
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            </div>
            <div className = "footer recipeButton">
              <Button className = "footer-footerButton">View recipe</Button>
            </div>
            <div className = "footer recipeButton">
              <Button className = "footer-footerButton">Add recipe</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
  

/**
 * Don't forget to export your component!
 */
export default Footer;

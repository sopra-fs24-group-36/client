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
    <div className="footer-field">
      <label className="footer-label">{props.label}</label>
      <input
        className="footer-input"
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

  const [searchQuery, set_search_query] = useState<string>("");
  const [searchResults, setSearchResults] = useState<object[]>([]);
  const appID = process.env.API_ID;
  const appKEY = process.env.API_KEY;

  const addRecipe = async(title, cookingTime, link) =>{
    try{
      const requestBody = JSON.stringify({title, cookingTime, link})
      const response = await api.post(`/users/${currentUserID}/cookbooks`, requestBody);
      const recipe = new Recipe(response.data);
      localStorage.setItem("recipeID", recipe.id); //not 100% sure if we need this, need to check with getting a recipe
      const recipeID = localStorage.getItem("recipeID");
      navigate(`/users/${currentUserID}/cookbooks/${recipeID}/edit`);
    }
    catch(error){
      alert(
        `Something went wrong when saving the recipe: \n${handleError(error)}`,
      );
    }
  }

  const handleSearch = async () => {
    try {
      const response = await fetch(`https://api.edamam.com/search?q=${searchQuery}&app_id=${appID}&app_key=${appKEY}`);
      const data = await response.json(); 
      setSearchResults(data.hits); 
      console.log(searchResults)
    }catch (error){
      alert(
        `Something went wrong when saving the recipe: \n${handleError(error)}`,
      );
    }
  }

  const doLink = (link) =>{
    window.open(link); 
  }

  const doNoRecipe = () =>{

    return <p className = "footer noRecipe">no recipes found</p>
  }

  const showRecipe = () =>{
    const validRecipes = searchResults.filter(recipe => recipe)
    if (validRecipes.length > 0){
      return validRecipes.map((recipe, index) => (
        <div key = {index} className = "footer recipe">
          <div className = "footer recipeContent">
            <div className ="footer recipeTitleContainer">
              <p className = "footer recipeTitle">
                {recipe.recipe.label}
              </p>
            </div>
            <div className = "footer recipeImageContainer">
              <img src={recipe.recipe.image} alt="recipeImage" className = "footer recipeImage"/>
            </div>
            <div className = "footer recipeDescriptionContainer">
              <p><strong>Source:</strong> {recipe.recipe.source}</p>
            </div>
            <div className = "footer recipeButton">
              <Button className = "footer-footerButton"
                onClick = {() => doLink(recipe.recipe.url)}>
                  View recipe
              </Button>
            </div>
            <div className = "footer recipeButton">
              <Button className = "footer-footerButton"
                onClick = {() => addRecipe(recipe.recipe.label, String(recipe.recipe.totalTime), recipe.recipe.url)}>
                Add recipe
              </Button>
            </div>
          </div>
        </div>
      ))
    }
    else{
      return doNoRecipe(); 
    }
  }

  return (
    <div className = "footer content">
      <div className = "footer searchbar">
        <FormField
          label="Search for a recipe"
          value = {searchQuery}
          onChange = {(sq:string) => set_search_query(sq)}>
        </FormField>
        <div className = "footer-searchButton">
          <Button className = "footer-button"
            onClick={handleSearch}>
            Search
          </Button>
        </div>
      </div>
      <div className = "footer recipesContainer">
        {showRecipe()}
      </div>
    </div>
  );
}
  

/**
 * Don't forget to export your component!
 */
export default Footer;

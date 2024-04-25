import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Recipe.scss";
import Dashboard from "components/ui/Dashboard";
import Footer from "components/ui/footer";
import BaseContainer from "components/ui/BaseContainer_new";
import Header_new from "components/views/Header_new";
import {Spinner} from "components/ui/Spinner";
// @ts-ignore
import select_image from "../../assets/select_image.png";


const UserRecipe = () => {
  const navigate = useNavigate();
  const {authorID, recipeID} = useParams(); //User ID of recipe's author and recipeID 
  const [recipe, setRecipe] = useState(null); //getting the recipe we are currently viewing 
  const userID = localStorage.getItem("userID");

  const editRecipe = () => {
    navigate(`/users/${authorID}/cookbooks/${recipeID}/edit`)
  };


  const doTags = () => {
    const recipeTags = recipe.tags;
    let webpageTags = "";
    if(recipeTags.length === 0){
      webpageTags += "no tags set"
    }
    recipeTags.forEach(tag => {
      webpageTags += tag.toLowerCase() + ", "; // Add each tag to the webpageTags string
    });
    // Remove the trailing comma and space
    if (webpageTags !== "no tags set"){
      webpageTags = webpageTags.slice(0, -2);
    }

    return webpageTags;
  };

  const doIngredients = () => {
    const recipeIngredients = recipe.ingredients;
    const recipeAmounts = recipe.amounts;
    if (recipeIngredients.length === 0) {
      return <p>This recipe has no ingredients</p>
    }
    // Map each ingredient to a JSX <li> element
    const ingredientList = recipeIngredients.map((ingredient, index) => (
      <li key={index}>{recipeAmounts[index]} {ingredient}</li>
    ));

    return ingredientList;
  };

  const doInstructions = () =>{
    const recipeInstructions = recipe.instructions;
    if (recipeInstructions.length === 0){
      return <p>This recipe has no instructions</p>
    }
    const instructionsList = recipeInstructions.map((instruction, index) => (
      <li key={index}>{instruction}</li>
    ));

    return instructionsList; 
  }

  useEffect(() => { //retrieve the recipe based on the ID from the URL 
    async function fetchData(){
      try{
        const response = await api.get(`/users/${authorID}/cookbooks/${recipeID}`);
        // delays continuous execution of an async operation for 0.5 second -> can be removed 
        await new Promise((resolve) => setTimeout(resolve, 500));
        //returned recipe based on the id from the URL 
        setRecipe(response.data)
      }catch(error){
        console.error(
          `Something went wrong while fetching the users: \n${handleError(error)}`
        );
        console.error("Details:", error);
        alert("Something went wrong while fetching the users! See the console for details.");
      };
    };
    fetchData(); 
  }, []);

  let content;
  if(!recipe){
    content = <Spinner/>; //had to use the spinner because it takes a while to render the content
  }
  else if (recipe.link){
    window.open(recipe.link);
    navigate("/home"); //potentially needs taking out when we connect to cookbooks 
  }else{
    const canEdit = userID === authorID; 
    content = (
      <div>
        <Header_new></Header_new>
        <Dashboard
          showButtons={{
            recipe: true,
            group: true,
            calendar: true,
            shoppinglist: true,
            invitations: true,
          }}
          activePage=""
        />
        <BaseContainer>
          <div className="recipe headerContainer">
            <div className="recipe backButtonContainer">
              <Button className="backButton"
                onClick={()=>navigate(-1)}>
                Back
              </Button>
            </div>
            <div className="recipe titleContainer">
              <h2 className="recipe title">{recipe.title}</h2>
            </div>
            {canEdit &&(<div className="recipe editButtonContainer">
              <Button
                className="recipe edit"
                onClick={() => editRecipe()}>
                Edit Recipe
              </Button>
            </div>)}
          </div>
          <div className="recipe container">
            <div className="recipe left">
              <div className="recipe imageContainer">
                <img src={select_image} alt="icon" className="recipes image"></img>
              </div>
              <div className="recipe rating">
              </div>
              <div className="recipe description">
                <p>{recipe.shortDescription}</p>
              </div>
              <div className="recipe time">
                <p><strong>Total Time:</strong> {recipe.cookingTime}</p>
              </div>
              <div className="recipe tags">
                <p><strong>Tags:</strong> {doTags()}</p>
              </div>
            </div>
            <div className="recipe right">
              <div className="recipe ingredients">
                <div className="recipe ingredientsTitle">
                  <h2>Ingredients</h2>
                </div>
                <ul className="recipe list">
                  {doIngredients()}
                </ul>
              </div>
              <div className="recipe steps">
                <div className="recipe stepsTitle">
                  <h2>Step by Step</h2>
                </div>
                <ol className="recipe list">
                  {doInstructions()}
                </ol>
              </div>
            </div>
          </div>
        </BaseContainer>
        <Footer></Footer>
      </div>
    );
  }

  return(
    <div>
      {content}
    </div>
  )
};

export default UserRecipe;

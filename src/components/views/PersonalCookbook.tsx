import React, { useEffect, useState } from "react";
import { Form, useNavigate, useParams } from "react-router-dom";
import { api, handleError } from "helpers/api";
import { Button } from "components/ui/Button";
import PropTypes from "prop-types";
import "styles/views/PersonalCookbook.scss";
import User from "models/User";
import Dashboard from "components/ui/Dashboard";
import Footer from "components/ui/footer";
import Header_new from "components/views/Header_new";
import BaseContainer from "components/ui/BaseContainer_new";


const FormField = (props) => {
  return (
    <div className="cookbook field">
      <input
        className="cookbook input"
        placeholder="Search for your recipes..."
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  );
};
FormField.propTypes = {
  value: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};


const PersonalCookbook = () => {
  const navigate = useNavigate();
  const [filterKeyword, setFilterKeyword] = useState<string>(null);
  const userID = localStorage.getItem("userID"); /*getting the ID of the currently logged in user*/
  const [recipeState, setRecipeState] = useState(false);
  const [recipeList, setRecipeList] = useState<object[]>([]);

  const filterRecipe = () => {
    //TODO:add the filter func by tags or names
  };
  const deleteRecipe = () => {
    //TODO:add the deleteRecipe when connecting with backend

  };
  const doNoRecipe = () => {
    return <p className="cookbook noRecipeText">no recipes saved yet</p>;
  };
  const handleClickRecipe = (user: User, recipeId: string) => {
    navigate(`/users/${userID}/cookbooks/${recipeId}`);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get(`/users/${userID}/cookbooks`);
        await new Promise((resolve) => setTimeout(resolve, 500));
        setRecipeState(true);
        if (!response || response.length === 0) {
          return doNoRecipe();
        } else {
          const formattedRecipes = response.data.map((recipe: any) => ({
            id: recipe.id,
            title: recipe.title,
            shortDescription: recipe.shortDescription,
            cookingTime: recipe.cookingTime,
            tags: recipe.tags,
            image: recipe.image,
          }));
          setRecipeList(formattedRecipes);
        }
      } catch (error) {
        console.error(
          `Something went wrong while fetching the recipes: \n${handleError(
            error,
          )}`,
        );
        console.error("Details:", error);
        alert(
          "Something went wrong while fetching the users! See the console for details.",
        );
      }
    }

    fetchData();
  }, []);


  const Recipe = ({ id, title, description, time, tag, imageUrl, onClick }: any) => (
    <div className="cookbook recipeContainer">
      <button className="cookbook recipeButton" onClick={() => navigate(`/users/${userID}/cookbooks/${id}`)}>
        <div className="cookbook recipeImgContainer">
          <img className="cookbook recipeImg" src={imageUrl} alt="Recipe Image" />
        </div>
        <div className="cookbook recipeContent">
          <h2 className="cookbook recipeTitle">{title}</h2>
          <p className="cookbook recipeDescription">Description:{description}</p>
          <p className="cookbook recipeTime">Total Time:{time}</p>
          <p className="cookbook recipeTags">Tags:{tag}</p>
        </div>
      </button>
    </div>

  );
  const RecipeList = ({ recipes, onClickRecipe }: any) => (
    <div className="cookbook recipeListContainer">
      {recipes.map((recipe: any, index: number) => (
        <Recipe
          key={index}
          onClick={() => onClickRecipe(recipe.id)}
          id={recipe.id}
          title={recipe.title}
          description={recipe.shortDescription}
          time={recipe.cookingTime}
          tag={recipe.tags}
          imageUrl={recipe.image}
        />
      ))}
    </div>
  );

  return (
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
        {/*head field*/}
        <div className="cookbook headerContainer">
          <div className="cookbook backButtonContainer">
            <Button className="cookbook backButton" onClick={() => navigate("/home")}>
              Back
            </Button>
          </div>
          <div className="cookbook titleContainer">
            <h2 className="cookbook title">Personal Cookbook</h2>
          </div>
          <div className="cookbook backButtonContainer">
            <Button className="cookbook backButton" onClick={deleteRecipe()}>
              Delete Recipes
            </Button>
          </div>
        </div>
        {/*filter field*/}
        <div className="cookbook filterContainer">
          <div className="cookbook filterButtonContainer">
            <Button className="cookbook filterButton" onClick={filterRecipe()}>filter</Button>
          </div>
          <FormField
            className="cookbook input"
            value={filterKeyword}
            onClick={(fk: string) => setFilterKeyword()}>
          </FormField>
        </div>
        {/*recipe field*/}
        <RecipeList recipes={recipeList} onClickRecipe={handleClickRecipe} />
      </BaseContainer>
      <Footer>
      </Footer>
    </div>
  );
};

export default PersonalCookbook;
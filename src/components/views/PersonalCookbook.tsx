import React, { useEffect, useState } from "react";
import { Form, useNavigate, useParams } from "react-router-dom";
import { api, handleError } from "helpers/api";
import { Button } from "components/ui/Button";
import PropTypes from "prop-types";
import "styles/views/PersonalCookbook.scss";
import User from "models/User";
import Recipe from "models/Recipe"
import Dashboard from "components/ui/Dashboard";
import Footer from "components/ui/footer";
import Header_new from "components/views/Header_new";
import BaseContainer from "components/ui/BaseContainer_new";


const FormField = (props) => {
  return (
    <div className="personalCookbook field">
      <input
        className="personalCookbook input"
        placeholder="Search for your recipes by name or tag"
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
  const [originalRecipeList, setOriginalRecipeList] = useState<object[]>([]); // 新增原始食谱列表状态


  const filterRecipe = () => {
    const lowerCaseFilterKeyword = filterKeyword.toLowerCase();
    const filteredRecipes = originalRecipeList.filter(recipe => {
      const lowerCaseTitle = recipe.title.toLowerCase();
      const lowerCaseTags = recipe.tags.map(tag => tag.toLowerCase());
      return lowerCaseTitle.includes(lowerCaseFilterKeyword) || lowerCaseTags.includes(lowerCaseFilterKeyword);
    });
    setRecipeList(filteredRecipes);
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

  const handleFilterChange = (newValue) => {
    setFilterKeyword(newValue);
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
          setOriginalRecipeList(formattedRecipes);
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
    <div className="personalCookbook recipeContainer">
      <button className="personalCookbook recipeButton" onClick={() => navigate(`/users/${userID}/cookbooks/${id}`)}>
        <div className="personalCookbook recipeImgContainer">
          <img className="personalCookbook recipeImg" src={imageUrl} alt="Recipe Image" />
        </div>
        <div className="personalCookbook recipeContent">
          <h2 className="personalCookbook recipeTitle">{title}</h2>
          <p className="personalCookbook recipeDescription">Description:{description}</p>
          <p className="personalCookbook recipeTime">Total Time:{time}</p>
          <p className="personalCookbook recipeTags">Tags:{tag.join(",")}</p>
        </div>
      </button>
    </div>

  );
  const RecipeList = ({ recipes, onClickRecipe }: any) => (
    <div className="personalCookbook recipeListContainer">
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
        <div className="personalCookbook headerContainer">
          <div className="personalCookbook backButtonContainer">
            <Button className="backButton" onClick={() => navigate(`/home`)}>
              Back
            </Button>
          </div>
          <div className="personalCookbook titleContainer">
            <h2 className="personalCookbook title">Personal Cookbook</h2>
          </div>
          <div className="personalCookbook backButtonContainer">
            <Button className=" backButton" onClick={deleteRecipe()}>
              Delete Recipes
            </Button>
          </div>
        </div>
        <div className="personalCookbook filterContainer">
          <div className="personalCookbook filterButtonContainer">
            <Button className="personalCookbook filterButton" onClick={filterRecipe}>filter</Button>
          </div>
          <FormField
            value={filterKeyword}
            onChange={handleFilterChange}>
          </FormField>
        </div>
        <RecipeList recipes={recipeList} onClickRecipe={handleClickRecipe} />
      </BaseContainer>
      <Footer>
      </Footer>
    </div>
  );
};

export default PersonalCookbook;
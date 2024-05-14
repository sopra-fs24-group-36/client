import "styles/views/Home.scss";
import Dashboard from "components/ui/Dashboard";
import Footer from "components/ui/footer";
import Header_new from "components/ui/Header_new";
import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";
import { Spinner } from "components/ui/Spinner";
// @ts-ignore
import rightBrok from "../../assets/rightBrok.png";
// @ts-ignore
import leftBrok from "../../assets/leftBrok.png";

const Home = () => {
  const navigate = useNavigate();
  const userID = localStorage.getItem("userID");
  const [recipeList, setRecipeList] = useState<object[]>([]);
  const [groupList, setGroupList] = useState<object[]>([]);
  const [firstRecipe, setFirstRecipe] = useState(null);
  const [secondRecipe, setSecondRecipe] = useState(null);
  const [thirdRecipe, setThirdRecipe] = useState(null);
  const [recipeState, setRecipeState] = useState(false);

  useEffect(() => {
    if (!userID) {
      alert("You are not logged in!");
      navigate("/users/login");
    }
  }, [userID, navigate]);

  const doTags = (recipeTags) => {
    let webpageTags = "";
    if (recipeTags.length === 0) {
      webpageTags += "no tags set";
    }
    recipeTags.forEach(tag => {
      webpageTags += tag.toLowerCase() + ", "; // Add each tag to the webpageTags string
    });
    // Remove the trailing comma and space
    if (webpageTags !== "no tags set") {
      webpageTags = webpageTags.slice(0, -2);
    }

    return webpageTags;
  };

  const doDescription = (description) =>{
    if(description){
      if(description.length < 50){
        return description
      }
      else{
        return `${description.substring(0, 50)}...`;
      }
    }
  }

  const doNoRecipe = () => {
    return <p className="Home noRecipeText">no recipes saved yet</p>;
  };
  const doNoGroup = () => {
    return <p className="Home noGroupText">not part of any groups yet</p>;
  };

  useEffect(() => { //retrieve the recipe based on the ID from the URL 
    async function fetchData() {
      if (!userID) {
        return;
      }
      try {
        const response = await api.get(`/users/${userID}/cookbooks`);
        await new Promise((resolve) => setTimeout(resolve, 500));
        setRecipeState(true);
        const reversedData = response.data.reverse();

        setRecipeList(reversedData);

        if (!response || response.length === 0) {

          return doNoRecipe();
        } else {
          if (reversedData.length >= 3) {
            setFirstRecipe(reversedData[0]);
            setSecondRecipe(reversedData[1]);
            setThirdRecipe(reversedData[2]);
          } else if (reversedData.length === 2) {
            setFirstRecipe(reversedData[0]);
            setSecondRecipe(reversedData[1]);
          } else {
            setFirstRecipe(reversedData[0]);
          }
        }
        //returned recipe based on the id from the URL
      } catch (error) {
        console.error(
          `Something went wrong while fetching the recipes: \n${handleError(error)}`,
        );
        console.error("Details:", error);
        alert("Something went wrong while fetching the recipes! See the console for details.");
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (!userID) {
      return;
    }

    async function fetchData() {
      try {
        const response = await api.get(`/users/${userID}/groups`);
        setGroupList(response.data);
      } catch (error) {
        console.error(`Something went wrong while fetching the groups: \n${handleError(error)}`);
        console.error("Details:", error);
        alert("Something went wrong while fetching the groups! See the console for details.");
      }
    }

    fetchData();
  }, []);

  const doRecipes = () => {
    const recipes = [firstRecipe, secondRecipe, thirdRecipe]; // Collect recipes in an array

    // Filter out undefined or null recipes
    const validRecipes = recipes.filter(recipe => recipe);

    // If there are valid recipes, render recipe cards
    if (validRecipes.length > 0) {
      return validRecipes.map((recipe, index) => (
        <Button key={index} className="Home recipe" onClick={() => navigate(`/users/${userID}/cookbooks/${recipe.id}`)}>
          <img src={recipe.image} alt="Recipe" className="Home recipeImage" />
          <div className="Home recipeInfo">
            <h3 className="Home recipeTitle">{recipe.title}</h3>
            <p className="Home recipeDescription">{doDescription(recipe.shortDescription)}</p>
            <p className="Home recipeTime"><strong>Total time: </strong>{recipe.cookingTime}</p>
            <p className="Home recipeTags"><strong>Tags: </strong>{doTags(recipe.tags)}</p>
          </div>
        </Button>
      ));
    } else {

      return doNoRecipe(); // Return JSX element indicating no recipes
    }
  };

  const doGroup = () => {
    const validGroups = groupList.filter(group => group);
    if (validGroups.length > 0) {
      return validGroups.map((group, index) => (
        <div key={index} className="Home buttonContainer">
          <Button className="Home group" onClick={() => navigate(`/groups/${group.groupID}/cookbooks/`)}>
            <img src={group.groupImage} alt="Group" className="Home groupImage" />
            {group.groupName}
          </Button>
        </div>
      ));
    } else {

      return doNoGroup();
    }
  };

  let content;
  if (!recipeState) {
    content = <Spinner />; //had to use the spinner because it takes a while to render the content
  } else {
    content = (
      <div className="allcontent">
        <Header_new></Header_new>
        <Dashboard
          showButtons={{
            home: true,
            cookbook: true,
            recipe: true,
            group: true,
            calendar: true,
            shoppinglist: true,
            invitations: true,
          }}
          activePage="home"
        />
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
            {doRecipes()}
          </div>
          <div className="Home recipesButtonContainer">
            <Button className="Home personalRecipes" onClick={() => navigate(`/users/${userID}/cookbooks/`)}>
              View all Personal Recipes
            </Button>
          </div>
        </div>
        <div className="Home containerRight">
          <div className="Home header">
            <h2 className="Home groupTitle">Group Cookbooks</h2>
          </div>
          <div className="Home groupContainer">
            {doGroup()}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      {content}
    </div>
  );
};

export default Home;
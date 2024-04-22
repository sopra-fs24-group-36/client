import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "components/ui/Button";
import PropTypes from "prop-types";
import "styles/views/GroupCookbooks.scss";
import User from "models/User";
import Dashboard from "components/ui/Dashboard";
import { api, handleError } from "helpers/api";
import Footer from "components/ui/footer";
import Header_new from "components/views/Header_new";
import BaseContainer from "components/ui/BaseContainer_new";


const FormField = (props) => {
  return (
    <div className="cookbook field">
      <input
        className="cookbook input"
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

const GroupCookbook = () => {
  const navigate = useNavigate();
  const [filterKeyword, setFilterKeyword] = useState<string>(null);
  const userID = localStorage.getItem("userID"); /*getting the ID of the currently logged in user*/
  const { groupID } = useParams();
  const [groupInfo, setGroupInfo] = useState<any[]>([]);
  const [recipeState, setRecipeState] = useState(false);
  const [recipeList, setRecipeList] = useState<any[]>([]);
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

  const removeRecipe = () => {
  };

  const doNoRecipe = () => {
    return <p className="cookbook noRecipeText">no recipes saved yet</p>;
  };

  const handleClickRecipe = (user: User, recipeId: string) => {
    navigate(`/groups/${groupID}/cookbooks/${recipeId}`);
  };

  const handleFilterChange = (newValue) => {
    setFilterKeyword(newValue);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/groups/${groupID}`);
        setGroupInfo(response.data);
      } catch (error) {
        alert("Something went wrong while fetching the group");
      }
    };
    fetchData();
  }, [groupID]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/groups/${groupID}/cookbooks`);
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
          `Something went wrong while fetching the groups: \n${handleError(
            error,
          )}`,
        );
        console.error("Details:", error);
        alert(
          "Something went wrong while fetching the recipes! See the console for details.",
        );
      }
    };
    fetchData();
  }, []);


  const Recipe = ({ id, title, description, time, tag, imageUrl, userImgUrl, onClick }: any) => (
    <div className="cookbook recipeContainer">
      <button className="cookbook recipeButton" onClick={() => navigate(`/groups/${groupID}/cookbooks/${id}`)}>
        <div className="cookbook recipeImgContainer">
          <img className="cookbook recipeImg" src={imageUrl} alt="Recipe Image" />
        </div>
        <div className="cookbook recipeContent">
          <h2 className="cookbook recipeTitle">{title}</h2>
          <p className="cookbook recipeDescription">Description:{description}</p>
          <p className="cookbook recipeTime">Total Time:{time}</p>
          <p className="cookbook recipeTags">Tags:{tag.join(",")}</p>
        </div>
        <div className="cookbook recipeUserImgContainer">
          <img className="cookbook recipeUserImg" src={userImgUrl} alt="User Image" />
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
          userImgUrl={recipe.userImg}
        />
      ))}
    </div>
  );

  return (
    <div>
      <Header_new />
      <Dashboard
        showButtons={{
          recipe: true,
          groupCalendar: true,
          groupShoppinglist: true,
          inviteUser: true,
          leaveGroup: true,
        }}
        activePage="leaveGroup"
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
            <h2 className="cookbook title">{groupInfo.name} - Cookbook</h2>
          </div>
          <div className="cookbook backButtonContainer">
            <Button className="cookbook backButton" onClick={removeRecipe}>
              Remove Recipes
            </Button>
          </div>
        </div>
        <div className="cookbook filterContainer">
          <div className="cookbook filterButtonContainer">
            <Button className="cookbook filterButton" onClick={filterRecipe}>filter</Button>
          </div>
          <FormField
            className="cookbook input"
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

export default GroupCookbook;
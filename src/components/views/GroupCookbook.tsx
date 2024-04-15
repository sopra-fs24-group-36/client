import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "components/ui/Button";
import PropTypes from "prop-types";
import "styles/views/GroupCookbooks.scss";
import User from "models/User";
import Dashboard from "components/ui/Dashboard";
import Footer from "components/ui/footer";
import BaseContainer from "components/ui/BaseContainer_new";
// @ts-ignore
import defaultRecipe1 from "../../assets/defaultRecipe1.png";
// @ts-ignore
import defaultRecipe2 from "../../assets/defaultRecipe2.png";
// @ts-ignore
import defaultRecipe3 from "../../assets/defaultRecipe3.png";
// @ts-ignore
import defaultRecipe4 from "../../assets/defaultRecipe4.png";
// @ts-ignore
import defaultRecipe1UserImg from "../../assets/defaultRecipe1UserImg.png";
// @ts-ignore
import defaultRecipe2UserImg from "../../assets/defaultRecipe2UserImg.png";
// @ts-ignore
import defaultRecipe3UserImg from "../../assets/defaultRecipe3UserImg.png";
// @ts-ignore
import defaultRecipe4UserImg from "../../assets/defaultRecipe4UserImg.png";
import Header from "./Header";
import Header_new from "./Header_new";
// @ts-ignore
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
  onChange: PropTypes.func.isRequired,
};

const Recipe = ({ title, description, time, tag, imageUrl, userImgUrl, onClick }: any) => (
  <div className="cookbook recipeContainer">
    <button className="cookbook recipeButton" onClick={onClick}>
      <div className="cookbook recipeImgContainer">
        <img className="cookbook recipeImg" src={imageUrl} alt="Recipe Image" />
      </div>
      <div className="cookbook recipeContent">
        <h2 className="cookbook recipeTitle">{title}</h2>
        <p className="cookbook recipeDescription">Description:{description}</p>
        <p className="cookbook recipeTime">Total Time;{time}</p>
        <p className="cookbook recipeTags">Tags:{tag}</p>

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
        title={recipe.title}
        description={recipe.shortDescription}
        time={recipe.cooking_time}
        tag={recipe.tags}
        imageUrl={recipe.image}
        userImgUrl={recipe.userImg}
      />
    ))}
  </div>
);

const defaultRecipes = [
  {
    title: "Breakfast burritos",
    shortDescription: "Fat and easy recipe for a good start of your day.",
    cooking_time: "30min",
    tags: "vegetarian",
    image: defaultRecipe1,
    userImg: defaultRecipe1UserImg,
  },
  {
    title: "Quick fried rice",
    shortDescription: "Not enough time? No problem, because this recipe is fast and delicious",
    cooking_time: "25 min",
    tags: "vegetarian",
    image: defaultRecipe2,
    userImg: defaultRecipe2UserImg,
  },
  {
    title: "Spring onion soup",
    shortDescription: "Enjoy our spring onion soup, bursting with fresh, vibrant flavour",
    cooking_time: "30 min",
    tags: "vegetarian",
    image: defaultRecipe3,
    userImg: defaultRecipe3UserImg,
  },
  {
    title: "Pork medallions",
    shortDescription: "Juicy pork medallions, perfectly seared for exquisite flavour.",
    cooking_time: "45min",
    tags: "dinner",
    image: defaultRecipe4,
    userImg: defaultRecipe4UserImg,
  },
];

const GroupCookbook = () => {
  const navigate = useNavigate();
  const [filterKeyword, setFilterKeyword] = useState<string>(null);
  const { id } = useParams();
  const filterRecipe = () => {
  };
  const removeRecipe = () => {
  };
  const handleClickRecipe = (user: User, recipeId: string) => {
    navigate(`/users/${user.id}/cookbooks/${recipeId}`);
  };

  /*  useEffect(() => {
      async function fetchData(){
        try{
          const response = await api.get(`/users/${user.id}/cookbooks`)
        }
      }
    }, []);*/


  return (
    <div>
      <Header_new />
      <Dashboard
        showButtons={{
          recipe: true,
          groupCalendar: true,
          groupShoppinglist: true,
          invitations: true,
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
            <h2 className="cookbook title">Carrot Crew - Cookbook</h2>
          </div>
          <div className="cookbook backButtonContainer">
            <Button className="cookbook backButton" onClick={removeRecipe()}>
              Remove Recipes
            </Button>
          </div>
        </div>
        <div className="cookbook filterContainer">
          <div className="cookbook filterButtonContainer">
            <Button className="cookbook filterButton" onClick={filterRecipe()}>filter</Button>
          </div>
          <FormField
            className="cookbook input"
            value={filterKeyword}
            onChange={(fk: string) => setFilterKeyword()}>
          </FormField>
        </div>
        <RecipeList recipes={defaultRecipes} onClickRecipe={handleClickRecipe} />
      </BaseContainer>
      <Footer>
      </Footer>
    </div>
  );
};

export default GroupCookbook;
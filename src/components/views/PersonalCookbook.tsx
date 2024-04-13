import React, { useEffect, useState } from "react";
import { Form, useNavigate, useParams } from "react-router-dom";
import { api, handleError } from "helpers/api";
import { Button } from "components/ui/Button";
import PropTypes from "prop-types";
import "styles/views/PersonalCookbook.scss"
import User from "models/User";
import Arecipe from "models/Recipe"
import Dashboard from "components/ui/Dashboard";
import Footer from "components/ui/footer";
import BaseContainer from "components/ui/BaseContainer_new";
// @ts-ignore
import defaultRecipe1 from "../../assets/defaultRecipe1.png"
// @ts-ignore
import defaultRecipe2 from "../../assets/defaultRecipe2.png";
// @ts-ignore
import defaultRecipe3 from "../../assets/defaultRecipe3.png";
// @ts-ignore
import defaultRecipe4 from "../../assets/defaultRecipe4.png";
import Header from "./Header";
import Header_new from "./Header_new";
// @ts-ignore
const FormField=(props)=>{
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

const Recipe=({title,description,time,tag,imageUrl,onClick}:any)=>(
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
      />
    ))}
  </div>
);

const defaultRecipes = [
  {
    title: "Breakfast burritos",
    shortDescription: "Fat and easy recipe for a good start of your day.",
    cooking_time:'30min',
    tags:'vegetarian',
    image:defaultRecipe1,
  },
  {
    title:'Quick fried rice',
    shortDescription:'Not enough time? No problem, because this recipe is fast and delicious',
    cooking_time:'25 min',
    tags:'vegetarian',
    image:defaultRecipe2,
  },
  {
    title:'Spring onion soup',
    shortDescription:'Enjoy our spring onion soup, bursting with fresh, vibrant flavour',
    cooking_time:'30 min',
    tags:'vegetarian',
    image:defaultRecipe3,
  },
  {
    title:'Pork medallions',
    shortDescription:'Juicy pork medallions, perfectly seared for exquisite flavour.',
    cooking_time:'45min',
    tags:'dinner',
    image:defaultRecipe4,
  },
]

const PersonalCookbook=()=>{
  const navigate = useNavigate();
  const [filterKeyword, setFilterKeyword]=useState<string>(null)
  const {id} = useParams();
  const [recipes,setRecipes]=useState<Arecipe[]>(null);

  const filterRecipe=()=>{
    //TODO:add the filter func by tags or names
  }
  const deleteRecipe=()=>{
    //TODO:add the deleteRecipe when connecting with backend

  }
  const handleClickRecipe=(user:User,recipeId:string)=>{
    navigate(`/users/${user.id}/cookbooks/${recipeId}`)
  }
//TODO: add the fetchData func when connecting with backend
/*  useEffect(() => {
    async function fetchData(){
      try{
        const response = await api.get(`/users/${user.id}/cookbooks`)
        setRecipes(response.data);
      }catch(error){
        console.error(
          `Something went wrong while fetching the users: \n${handleError(
            error
          )}`
          );
          console.error("Details:", error);
          alert(
          "Something went wrong while fetching the users! See the console for details."
        );
      }
    }
    fetchData();
  }, []);
*/


  return(
    <div>
      <Header_new />
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
            <Button className="cookbook backButton" onClick={() => navigate(`/home`)}>
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
            onClick={(fk:string)=>setFilterKeyword()}>
          </FormField>
        </div>
{/*recipe field*/}
        <RecipeList recipes={defaultRecipes} onClickRecipe={handleClickRecipe} />
{/*
TODO：add the following line and delete the line above
        <RecipeList recipes={recipes} onClickRecipe={handleClickRecipe} />
*/}
      </BaseContainer>
      <Footer>
      </Footer>
    </div>
  )
}

export default PersonalCookbook;
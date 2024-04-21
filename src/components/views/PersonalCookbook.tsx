import React, { useEffect, useState } from "react";
import { Form, useNavigate, useParams } from "react-router-dom";
import { api, handleError } from "helpers/api";
import { Button } from "components/ui/Button";
import PropTypes from "prop-types";
import "styles/views/PersonalCookbook.scss"
import User from "models/User";
import Recipe from "models/Recipe"
import Dashboard from "components/ui/Dashboard";
import Footer from "components/ui/footer";
import Header_new from "components/views/Header_new";
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
// @ts-ignore
const FormField=(props)=>{
  return (
    <div className="personalCookbook field">
      <input
        className="personalCookbook input"
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

const RecipeItem=({title,description,time,tag,imageUrl,onClick}:any)=>(
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
  <div className="personalCookbook recipeListContainer">
    {recipes.map((recipe: any, index: number) => (
      <RecipeItem
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
    cooking_time:"30min",
    tags:"vegetarian",
    image:defaultRecipe1,
  },
  {
    title:"Quick fried rice",
    shortDescription:"Not enough time? No problem, because this recipe is fast and delicious",
    cooking_time:"25 min",
    tags:"vegetarian",
    image:defaultRecipe2,
  },
  {
    title:"Spring onion soup",
    shortDescription:"Enjoy our spring onion soup, bursting with fresh, vibrant flavour",
    cooking_time:"30 min",
    tags:"vegetarian",
    image:defaultRecipe3,
  },
  {
    title:"Pork medallions",
    shortDescription:"Juicy pork medallions, perfectly seared for exquisite flavour.",
    cooking_time:"45min",
    tags:"dinner",
    image:defaultRecipe4,
  },
]

const PersonalCookbook=()=>{
  const navigate = useNavigate();
  const [filterKeyword, setFilterKeyword]=useState<string>(null)
  const {id} = useParams();
  const[allRecipes,setAllRecipes]=useState<Recipe[]>(null);
  const [filteredRecipes,setFilteredRecipes]=useState<Recipe[]>(null);

  const filterRecipe=()=>{
    if(!filterKeyword){
      setFilteredRecipes(allRecipes);
      return;
    }
    const lowerCaseFilterKeyword = filterKeyword.toLowerCase();
    const filtered=allRecipes.filter(recipe=>
      recipe.title.toLowerCase().includes(lowerCaseFilterKeyword) ||
      recipe.tags.toLowerCase().includes(lowerCaseFilterKeyword)
    );
    setFilteredRecipes(filtered);
  }
  const deleteRecipe=()=>{
    //TODO:add the deleteRecipe when connecting with backend
  }
  const handleClickRecipe=(user:User,recipeId:string)=>{
    navigate(`/users/${user.id}/cookbooks/${recipeId}`)
  }
//TODO: add the fetchData func when connecting with backend
  useEffect(() => {
    async function fetchData(){
      try{
        /*TODO: change when connecting with backend
        const response = await api.get(`/users/${user.id}/cookbooks`)
        setAllRecipes(response.data);
        setFilteredRecipes(response.data);*/
        setAllRecipes(defaultRecipes);
        setFilteredRecipes(defaultRecipes);
      }catch(error){
        console.error(
          `Something went wrong while fetching the recipes: \n${handleError(
            error
          )}`
          );
        }
      }
    fetchData();
  }, []);


  return(
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
{/*filter field*/}
        <div className="personalCookbook filterContainer">
          <div className="personalCookbook filterButtonContainer">
            <Button className="personalCookbook filterButton" onClick={filterRecipe}>filter</Button>
          </div>
          <FormField
            className="personalCookbook input"
            value={filterKeyword}
            onChange={(newValue) => setFilterKeyword(newValue)}>
          </FormField>
        </div>
{/*recipe field*/}
        {filteredRecipes && <RecipeList recipes={filteredRecipes} onClickRecipe={handleClickRecipe} />}
      </BaseContainer>
      <Footer>
      </Footer>
    </div>
  )
}

export default PersonalCookbook;
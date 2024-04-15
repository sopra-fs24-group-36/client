import React, { useEffect, useState } from "react";
import { Form, useNavigate, useParams } from "react-router-dom";
import { api, handleError } from "helpers/api";
import { Button } from "components/ui/Button";
import PropTypes from "prop-types";
import "styles/views/Calendar.scss"
import User from "models/User";
import Recipe from "models/Recipe"
import Dashboard from "components/ui/Dashboard";
import Footer from "components/ui/footer";
import Header_new from "components/views/Header_new";
import BaseContainer from "../ui/BaseContainer_new";
// @ts-ignore
import search from "../../assets/search.png";
// @ts-ignore
import defaultRecipe1 from "../../assets/defaultRecipe1.png";
// @ts-ignore
import defaultRecipe2 from "../../assets/defaultRecipe2.png";
// @ts-ignore
import defaultRecipe3 from "../../assets/defaultRecipe3.png";
// @ts-ignore
import defaultRecipe4 from "../../assets/defaultRecipe4.png";

const FormField=(props)=>{
  return(
    <div className="calendar input">
      <input
        className="calendar input"
        placeholder="Search for your recipes..."
        value={props.value}
        onChange={(e)=>props.onChange(e.target.value)}
        />
    </div>
  )
}
FormField.propTypes = {
  value: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};


const defaultRecipes=[
  {
    title: "Breakfast burritos",
    image:defaultRecipe1,
    id:1,
  },
  {
    title:'Quick fried rice',
    image:defaultRecipe2,
    id:2,
  },
  {
    title:'Spring onion soup',
    image:defaultRecipe3,
    id:3,
  },
  {
    title:'Pork medallions',
    image:defaultRecipe4,
    id:4,
  }
]
const Calendar = () =>{
  const navigate = useNavigate();
  const [recipes,setRecipes]=useState<Recipe[]>(null);
  const [filterKeyword, setFilterKeyword]=useState<string>(null)
  const searchRecipe=()=>{}
  /*TODO:add the fetchData func when connecting with backend
    useEffect(()=>{
      async function fetchData(){
        try{
          const response=await api.get(`/users/${user.id}/cookbooks`);
          setRecipes(response.data);
        }catch(error){
          console.error("Details:", error);
          alert(
            "Something went wrong while fetching the users! See the console for details.");
        }
      }
      fetchData();
    })*/

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
        activePage="calendar"
      />
      <div className="calendar container" >
{/*your recipes field*/}
        <BaseContainer className="calendar baseContainerLeft">
          <div className="calendar headContainer">
            <h2 className="calendar title1">Your Recipes</h2>
          </div>
          <div className="calendar searchContainer">
            <FormField
              value={filterKeyword}
              onClick={(fk: string) => setFilterKeyword()}>
            </FormField>
            <div className="calendar searchButtonContainer">
              <Button
                className="calendar searchButton"
                style={{
                  backgroundSize: "100% 100%",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  backgroundImage: `url(${search})`,
                }}
                onClick={searchRecipe()}></Button>
            </div>
          </div>
          <div className="calendar recipeListContainer">
{/*TODO: display the recipes in database
recipes.map...*/}
            {defaultRecipes.map((recipe) => (
              <div className="calendar recipeContainer" key={recipe.id}>
                <button className="calendar recipeButton">
                  <div className="calendar recipeImgContainer">
                    <img className="calendar recipeImg" src={recipe.image} alt="Recipe Image" />
                  </div>
                  <h2 className="calendar recipeTitle">{recipe.title}</h2>
                </button>
              </div>
            ))}
          </div>
        </BaseContainer>
        {/*calendar field*/}
        <BaseContainer className="calendar baseContainerRight">
          <div className="calendar headContainer">
            <div className="calendar backButtonContainer">
              <Button className="backButton" onClick={() => navigate(`/home`)}>
                Back
              </Button>
            </div>
            <div className="calendar titleContainer">
              <h2 className="calendar title2">Your Calendar</h2>
            </div>
          </div>
          <div className="calendar arrowButtonContainer">
            <Button className="calendar arrowButton">
              ⬅
            </Button>
            <Button className="calendar arrowButton">
              ➡
            </Button>
          </div>

        </BaseContainer>
        <Footer></Footer>
      </div>
    </div>
  )
}
export default Calendar;
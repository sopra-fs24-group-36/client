import React, { useState, useEffect } from "react";
import { api, handleError } from "helpers/api";
import {Form, useNavigate, useParams} from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/EditRecipe.scss";
import PropTypes from "prop-types";
import Dashboard from "components/ui/Dashboard";
import Footer from "components/ui/footer";
import BaseContainer from "components/ui/BaseContainer_new";
import Header_new from "components/views/Header_new";
import Recipe from "models/Recipe";
import {Spinner} from "components/ui/Spinner";
// @ts-ignore
import select_image from "../../assets/select_image.png";

const FormField = (props) => { /*general form fields for inputting information (e.g. title, description, etc.)*/
  return (
    <div className="recipes field">
      <label className="recipes label">{props.label}</label>
      <input
        className="recipes input"
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

const IngredientsField = (props) => { /*separate for when adding new fields as we dont want each newly added field to have a label*/ 
  return (
    <div className="recipes field">
      <input
        className="recipes input"
        placeholder="enter here..."
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  );
};

IngredientsField.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
};

const StepsField = (props) => { /*separate for when adding new fields as we dont want each newly added field to have a label 
-> sepearate from IngredientsField as we jave different formatting*/ 
  return (
    <div className="recipes stepsField"> 
      <input
        className="recipes stepsInput" /*has different styling for the input fields*/
        placeholder="enter here..."
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  );
};

StepsField.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
};

const editRecipe = () => {
  const navigate = useNavigate();
  const {authorID, recipeID} = useParams(); //User ID of recipe's author and recipeID 
  const [recipe, setRecipe] = useState(null); //getting the recipe we are currently viewing 

  const currentUserID = localStorage.getItem("userID"); 
  const [title, set_recipe_title] = useState<string>(null);
  const [link, set_recipe_link] = useState<string>(null);
  const [shortDescription, set_recipe_description] = useState<string>(null); 
  const [image, set_recipe_image] = useState<string>(null); 
  const [cookingTime, set_recipe_prep] = useState<string>(null); 
  const [ingredients, set_recipe_ing] = useState<string[]>([]);
  const [amount, set_recipe_amount] = useState<string[]>([]);
  const [instructions, set_recipe_steps] = useState<string[]>([]);
  const [tags, set_recipe_tags] = useState<string[]>([]);
  const [cookbooks, set_cookbooks] = useState<string[]>([]);
  

  const addField = () =>{ /*to add a field for adding ingredients and their amount*/
    set_recipe_ing([...ingredients, ""]);
    set_recipe_amount([...amount, ""]);
  }

  const addStep = () =>{/*to add a field for adding steps to complete recipe*/
    set_recipe_steps([...instructions, ""]);
  }

  const addRecipeTag = (tag) =>{ /*to add a tag to a recipe*/
    const isSelected = tags.includes(tag); /*to see if something has already been selected, we check if there is a tag in the recipe_tags list*/
      if (isSelected) {
        set_recipe_tags(prevTags => prevTags.filter((selectedTag) => selectedTag !== tag)); /*if there is a tag, check the current one clicked is not the same */
      } else {
        if(tags.length <= 3){
          set_recipe_tags([...tags, tag]);
        }
        else{
          console.log("Maximum number of tags reached");
        }
      }
    }

  const addGroupTag = (tag) =>{ /*to add a group tag to a recipe*/
    const isSelected = cookbooks.includes(tag);
    if (isSelected) {
      set_cookbooks(prevTags => prevTags.filter((selectedTag) => selectedTag !== tag));
    } else {
      set_cookbooks([...tags, tag]);
    }
  }
  
  useEffect(() => { //retrieve the recipe based on the ID from the URL 
    async function fetchData(){
      try{
        const response = await api.get(`/users/${authorID}/cookbooks/${recipeID}`);
        console.log(response);
        // delays continuous execution of an async operation for 1 second -> can be removed 
        await new Promise((resolve) => setTimeout(resolve, 500));
        //returned recipe based on the id from the URL 
        setRecipe(response.data);
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

  const saveChanges = async() => {
    try{
      if(link){ /*if we have a link, we save the following information*/
        const requestBody1=JSON.stringify({title, shortDescription, cookingTime, image, link, tags, cookbooks});
        const response1 = await api.put(`/users/${currentUserID}/cookbooks/${recipeID}`, requestBody1);
        const recipe = new Recipe(response1.data); 
        localStorage.setItem("recipeID", recipe.id); //not 100% sure if we need this, need to check with getting a recipe
        navigate(-1);
      }
      else{
        const requestBody2=JSON.stringify({/*if we have no link, we have steps and ingredients and save the following information*/
        title, shortDescription, cookingTime, image, amount, ingredients, instructions, tags, cookbooks});
        const response2 = await api.put(`/users/${currentUserID}/cookbooks/${recipeID}`, requestBody2);
        const recipe = new Recipe(response2.data); 
        localStorage.setItem("recipeID", recipe.id); //not 100% sure if we need this, need to check with getting a recipe
        navigate(-1);
      }
    }
    catch(error){
      alert(
      `Something went wrong when saving the recipe: \n${handleError(error)}`,
    );
    set_recipe_title("");
    set_recipe_link("");
    set_recipe_description("");
    set_recipe_image("");
    set_recipe_prep("");
    set_recipe_ing();
    set_recipe_amount([]);
    set_recipe_steps([]);
    set_recipe_tags([]);
    set_cookbooks([]);    
    }
  }
  let content; 
  if(!recipe){
    content = <Spinner/>; //had to use the spinner because it takes a while to render the content 
  }else content =  (
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
        <div className="recipes headerContainer">
          <div className="recipes backButtonContainer">
            <Button
              className="backButton"
              onClick={() => navigate("/home")}
            >Back</Button>
          </div>
          <div className = "recipes titleContainer">
            <h2 className ="recipes title">Edit recipe</h2>
          </div>
          <div className="recipes addButtonContainer">
            <Button 
              /*button is disabled unless we have a link or we have some steps*/
              className="recipes add"
              disabled={!link && !instructions.some(step => step.trim() !== "")} /*checks if there are no recipe steps with content -> curtesy of chatGPT*/
              onClick={()=>saveChanges()}>
              Update Recipe
            </Button>
          </div>
        </div>
        <div className = "recipes container">
          <div className = "recipes formLeft">
            <div className ="recipes imageContainer"
              onChange={(img: string) => set_recipe_image(img)}>
              <img src={select_image} alt="icon" className = "recipes image"></img>
            </div>
            <FormField
              label ="Add a title:"
              value = {title}
              placeholder = {recipe.title}
              onChange={(rt: string) => set_recipe_title(rt)}>
            </FormField>
            <FormField
              label ="Description:"
              value = {shortDescription}
              onChange={(rd: string) => set_recipe_description(rd)}>
            </FormField>
            <FormField
              label ="Preparation time:"
              value = {cookingTime}
              onChange={(rp: string) => set_recipe_prep(rp)}>
            </FormField>
          </div>
          <div className = "recipes formRight">
            <FormField
              label="Add a recipe by URL link:"
              value = {link}
              onChange = {(rl:string) => set_recipe_link(rl)}>
            </FormField>
            <div className="recipes ingredients">
              <p className ="recipes p">Add all ingredients:</p>
              <div className="recipes ingredientsHeader">
                <p className ="recipes ingredientsHeaderAmount">Amount:</p>
                <p className ="recipes ingredientsHeaderIng">Ingredient:</p>
              </div>
              {ingredients.map((_, index) => (
                <div key={index} className="recipes ingredientFields">
                  <div className="recipes ingredientsAmount">
                    <IngredientsField
                      value={amount[index]} 
                      onChange={(value) => {
                        const newAmounts = [...amount]; /*creating a copy of recipe_ing_amount*/
                        newAmounts[index] = value; /*setting the index from the amount to the value*/
                        set_recipe_amount(newAmounts); /*overwriting previous aray with newAmounts array*/
                      }}
                    />
                  </div>
                  <div className="recipes ingredientsIng">
                    <IngredientsField
                      value={ingredients[index]}
                      onChange={(value) => {
                        const newIngredients = [...ingredients];
                        newIngredients[index] = value;
                        set_recipe_ing(newIngredients);
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="recipes plusButton">
              <Button className="recipes plus" onClick={addField}>
                +
              </Button>
            </div>
            <div className = "recipes steps">
              <p className ="recipes p">Add all steps:</p>
              {instructions.map((step, index) => (
                <div key = {index} className = "recipes stepField">
                  <div className="recipes stepNumber">{index+1}.</div>
                  <StepsField
                    value = {step}
                    onChange={(value)=>{
                      const newSteps = [...instructions];
                      newSteps[index] = value; 
                      set_recipe_steps(newSteps);
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="recipes plusButton">
              <Button className="recipes plus" onClick={addStep}>
                +
              </Button>
            </div>
            <div className = "recipes tags">
              <p className ="recipes p tags">Select tags (max 3):</p>
              <Button 
                className={`recipes tag ${tags.includes("VEGETARIAN") ? "selected" : ""}`}
                onClick={() => addRecipeTag("VEGETARIAN")}
                disabled={tags.length >= 3 && !tags.includes("VEGETARIAN")}>
                Vegetarian
              </Button>
              <Button 
                className={`recipes tag ${tags.includes("VEGAN") ? "selected" : ""}`}
                onClick={() => addRecipeTag("VEGAN")}
                disabled={tags.length >= 3 && !tags.includes("VEGAN")}>
                Vegan
              </Button>
              <Button 
                className={`recipes tag ${tags.includes("LACTOSEFREE") ? "selected" : ""}`}
                onClick={() =>addRecipeTag("LACTOSEFREE")}
                disabled={tags.length >= 3 && !tags.includes("LACTOSEFREE")} >
                Lactose-free
              </Button>
              <Button 
                className={`recipes tag ${tags.includes("GLUTENFREE") ? "selected" : ""}`}
                onClick={() =>addRecipeTag("GLUTENFREE")}
                disabled={tags.length >= 3 && !tags.includes("GLUTENFREE")}>
                Gluten-free
              </Button>
              <Button 
                className={`recipes tag ${tags.includes("BREAKFAST") ? "selected" : ""}`}
                onClick={() =>addRecipeTag("BREAKFAST")}
                disabled={tags.length >= 3 && !tags.includes("BREAKFAST")}>
                Breakfast
              </Button>
              <Button 
                className={`recipes tag ${tags.includes("LUNCH") ? "selected" : ""}`}
                onClick={() =>addRecipeTag("LUNCH")}
                disabled={tags.length >= 3 && !tags.includes("LUNCH")}>
                Lunch
              </Button>
              <Button 
                className={`recipes tag ${tags.includes("APÉRO") ? "selected" : ""}`}
                onClick={() =>addRecipeTag("APÉRO")}
                disabled={tags.length >= 3 && !tags.includes("APÉRO")}>
                Apéro
              </Button>
              <Button 
                className={`recipes tag ${tags.includes("DESSERT") ? "selected" : ""}`}
                onClick={() =>addRecipeTag("DESSERT")}
                disabled={tags.length >= 3 && !tags.includes("DESSERT")}>
                Desert
              </Button>
            </div>
            <div className = "recipes tags groups">
              <p className ="recipes p tags">Select Groups:</p>
              <Button 
                className={`recipes tag ${cookbooks.includes("Carrot Crew") ? "selected" : ""}`}
                onClick={() =>addGroupTag("Carrot Crew")}>
                Carrot Crew
              </Button>
              <Button 
                className={`recipes tag ${cookbooks.includes("Spice Girls") ? "selected" : ""}`}
                onClick={() =>addGroupTag("Spice Girls")}>
                Spice Girls
              </Button>
              <Button 
                className={`recipes tag ${cookbooks.includes("Lords of Wings") ? "selected" : ""}`}
                onClick={() =>addGroupTag("Lords of Wings")}>
                Lords of Wings
              </Button>
              <Button 
                className={`recipes tag ${cookbooks.includes("Pasta La Vista") ? "selected" : ""}`}
                onClick={() =>addGroupTag("Pasta La Vista")}>
                Pasta La Vista
              </Button>
            </div>
          </div>
        </div>
      </BaseContainer>
      <Footer></Footer>
    </div>
  );

  return(
    <div>
      {content}
    </div>
  )
};

export default editRecipe;

import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import {Form, useNavigate} from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/AddRecipe.scss";
import PropTypes from "prop-types";
import Dashboard from "components/ui/Dashboard";
import Footer from "components/ui/footer";
import BaseContainer from "components/ui/BaseContainer_new";
import Header_new from "components/views/Header_new"
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

const addRecipe = () => {
  const navigate = useNavigate();
  const [recipe_title, set_recipe_title] = useState<string>(null);
  const [recipe_link, set_recipe_link] = useState<string>(null);
  const [recipe_description, set_recipe_description] = useState<string>(null); 
  const [recipe_prep, set_recipe_prep] = useState<string>(null); 
  const [recipe_ing, set_recipe_ing] = useState([""]); /*are arrays*/
  const [recipe_ing_amount, set_recipe_ing_amount] = useState([""]); /*are arrays*/
  const [recipe_steps, set_recipe_steps] = useState([""]); /*are arrays*/
  const [recipe_tags, set_recipe_tags] = useState([""]); /*are arrays*/
  const [group_tags, set_group_tags] = useState([""]); /*are arrays*/
  const [showHelp, setShowHelp] = useState(false); 

  const addField = () =>{ /*to add a field for adding ingredients and their amount*/
    set_recipe_ing([...recipe_ing, ""]);
    set_recipe_ing_amount([...recipe_ing_amount,""]);
  }

  const addStep = () =>{/*to add a field for adding steps to complete recipe*/
    set_recipe_steps([...recipe_steps, ""]);
  }

  const addRecipeTag = (tag) =>{ /*to add a tag to a recipe*/
    const isSelected = recipe_tags.includes(tag); /*to see if something has already been selected, we check if there is a tag in the recipe_tags list*/
    if (isSelected) {
      set_recipe_tags(prevTags => prevTags.filter((selectedTag) => selectedTag !== tag)); /*if there is a tag, check the current one clicked is not the same */
    } else {
      set_recipe_tags([...recipe_tags, tag]);
    }
  }

  const addGroupTag = (tag) =>{ /*to add a group tag to a recipe*/
    const isSelected = group_tags.includes(tag);
    if (isSelected) {
      set_group_tags(prevTags => prevTags.filter((selectedTag) => selectedTag !== tag));
    } else {
      set_group_tags([...group_tags, tag]);
    }
  }

  const addImage = () =>{ /*to add an image to a recipe*/ 

  }

  const HelpPopup = ({ onClose }) => {/*when clicking on help, the following pop up is displayed explaining how to add a recipe*/ 
    return (
      <div className="recipes popupContainer">
        <div className="recipes popup">
          <p>Recipes must have a title, description and preparation time.</p>
          <p>Recipes can either be added with a URL link or by manually typing in ingredients and steps.</p>
          <p>Recipe tags can be added.</p>
          <p>Recipes will automatically be added to your personal cookbook and can also be added to group cookbooks.</p>
          <Button 
            className = "help close"
            onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    );
  };
  HelpPopup.propTypes = {
    onClose: PropTypes.func.isRequired,
  };

  const doHelp = () =>{ /*function to show the help section*/ 
    setShowHelp(!showHelp)
  }
  const saveChanges = async() => {
    try{
      const requestBody = null
      if(recipe_link){ /*if we have a link, we save the following information*/
        const requestBody=JSON.stringify({
          "recipe_title":recipe_title, 
          "recipe_description":recipe_description,
          "recipe_prep":recipe_prep,
          "recipe_link":recipe_link, 
          "recipe_tags":recipe_tags,
          "group_tags":group_tags
        })
      }
      else{
        const requestBody=JSON.stringify({/*if we have no link, we have steps and ingredients and save the following information*/
          "recipe_title":recipe_title, 
          "recipe_description":recipe_description,
          "recipe_prep":recipe_prep,
          "recipe_ing":recipe_ing,
          "recipe_ing_amount":recipe_ing_amount,
          "recipe_steps":recipe_steps,
          "recipe_tags":recipe_tags,
          "group_tags":group_tags
        })
      }
      const response = await api.post("/recipes", requestBody)
    }
    catch(error){/*error messages*/
      console.error("An error occurred while saving recipes:", error);
      alert("An error occurred while saving. Please try again later.");
    }
  }

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
        activePage="recipe"
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
            <h2 className ="recipes title">Add a recipe</h2>
          </div>
          <div className ="recipes helpContainer">
            <Button className ="help"
              onClick={doHelp}>
              help
            </Button>
          </div>
          <div className="recipes addButtonContainer">
            <Button 
              /*button is disabled unless we have a link or we have some steps*/
              className="recipes add"
              disabled={!recipe_link && !recipe_steps.some(step => step.trim() !== "")} /*checks if there are no recipe steps with content -> curtesy of chatGPT*/
              onClick={()=>saveChanges()}>
              Create Recipe
            </Button>
          </div>
        </div>
        <div className = "recipes container">
          {showHelp && <HelpPopup onClose={doHelp} />}
          <div className = "recipes formLeft">
            <div className ="recipes imageContainer"
              onClick={addImage}>
              <img src={select_image} alt="icon" className = "recipes image"></img>
            </div>
            <FormField
              label ="Add a title:"
              value = {recipe_title}
              onChange={(rt: string) => set_recipe_title(rt)}>
            </FormField>
            <FormField
              label ="Description:"
              value = {recipe_description}
              onChange={(rd: string) => set_recipe_description(rd)}>
            </FormField>
            <FormField
              label ="Preparation time:"
              value = {recipe_prep}
              onChange={(rp: string) => set_recipe_prep(rp)}>
            </FormField>
          </div>
          <div className = "recipes formRight">
            <FormField
              label="Add a recipe by URL link:"
              value = {recipe_link}
              onChange = {(rl:string) => set_recipe_link(rl)}>
            </FormField>
            <div className="recipes ingredients">
              <p className ="recipes p">Add all ingredients:</p>
              <div className="recipes ingredientsHeader">
                <p className ="recipes ingredientsHeaderAmount">Amount:</p>
                <p className ="recipes ingredientsHeaderIng">Ingredient:</p>
              </div>
              {recipe_ing.map((_, index) => (
                <div key={index} className="recipes ingredientFields">
                  <div className="recipes ingredientsAmount">
                    <IngredientsField
                      value={recipe_ing_amount[index]} 
                      onChange={(value) => {
                        const newAmounts = [...recipe_ing_amount]; /*creating a copy of recipe_ing_amount*/
                        newAmounts[index] = value; /*setting the index from the amount to the value*/
                        set_recipe_ing_amount(newAmounts); /*overwriting previous aray with newAmounts array*/
                      }}
                    />
                  </div>
                  <div className="recipes ingredientsIng">
                    <IngredientsField
                      value={recipe_ing[index]}
                      onChange={(value) => {
                        const newIngredients = [...recipe_ing];
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
              {recipe_steps.map((step, index) => (
                <div key = {index} className = "recipes stepField">
                  <div className="recipes stepNumber">{index+1}.</div>
                  <StepsField
                    value = {step}
                    onChange={(value)=>{
                      const newSteps = [...recipe_steps];
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
                className={`recipes tag ${recipe_tags.includes("Vegetarian") ? "selected" : ""}`}
                onClick={() => addRecipeTag("Vegetarian")}>
                Vegetarian
              </Button>
              <Button 
                className={`recipes tag ${recipe_tags.includes("Vegan") ? "selected" : ""}`}
                onClick={() => addRecipeTag("Vegan")}>
                Vegan
              </Button>
              <Button 
                className={`recipes tag ${recipe_tags.includes("Lactose-free") ? "selected" : ""}`}
                onClick={() =>addRecipeTag("Lactose-free")}>
                Lactose-free
              </Button>
              <Button 
                className={`recipes tag ${recipe_tags.includes("Gluten-free") ? "selected" : ""}`}
                onClick={() =>addRecipeTag("Gluten-free")}>
                Gluten-free
              </Button>
              <Button 
                className={`recipes tag ${recipe_tags.includes("Breakfast") ? "selected" : ""}`}
                onClick={() =>addRecipeTag("Breakfast")}>
                Breakfast
              </Button>
              <Button 
                className={`recipes tag ${recipe_tags.includes("Lunch") ? "selected" : ""}`}
                onClick={() =>addRecipeTag("Lunch")}>
                Lunch
              </Button>
              <Button 
                className={`recipes tag ${recipe_tags.includes("Apéro") ? "selected" : ""}`}
                onClick={() =>addRecipeTag("Apéro")}>
                Apéro
              </Button>
              <Button 
                className={`recipes tag ${recipe_tags.includes("Desert") ? "selected" : ""}`}
                onClick={() =>addRecipeTag("Desert")}>
                Desert
              </Button>
            </div>
            <div className = "recipes tags groups">
              <p className ="recipes p tags">Select Groups:</p>
              <Button 
                className={`recipes tag ${group_tags.includes("Carrot Crew") ? "selected" : ""}`}
                onClick={() =>addGroupTag("Carrot Crew")}>
                Carrot Crew
              </Button>
              <Button 
                className={`recipes tag ${group_tags.includes("Spice Girls") ? "selected" : ""}`}
                onClick={() =>addGroupTag("Spice Girls")}>
                Spice Girls
              </Button>
              <Button 
                className={`recipes tag ${group_tags.includes("Lords of Wings") ? "selected" : ""}`}
                onClick={() =>addGroupTag("Lords of Wings")}>
                Lords of Wings
              </Button>
              <Button 
                className={`recipes tag ${group_tags.includes("Pasta La Vista") ? "selected" : ""}`}
                onClick={() =>addGroupTag("Pasta La Vista")}>
                Pasta La Vista
              </Button>
            </div>
          </div>
        </div>
      </BaseContainer>
      <Footer>

      </Footer>
    </div>
  );
};

export default addRecipe;

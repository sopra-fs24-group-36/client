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

/*
It is possible to add multiple components inside a single file,
however be sure not to clutter your files with an endless amount!
As a rule of thumb, use one file per component and only add small,
specific components that belong to the main one in the same file.
 */
const FormField = (props) => {
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

const StepsField = (props) => { /*separate for when adding new fields as we dont want each newly added field to have a label*/ 
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

  const addField = () =>{
    set_recipe_ing([...recipe_ing, ""]);
    set_recipe_ing_amount([...recipe_ing_amount,""]);
  }

  const addStep = () =>{
    set_recipe_steps([...recipe_steps, ""]);
  }

  const addRecipeTag = (tag) =>{
    const isSelected = recipe_tags.includes(tag);
    if (isSelected) {
      set_recipe_tags(prevTags => prevTags.filter((selectedTag) => selectedTag !== tag));
    } else {
      set_recipe_tags([...recipe_tags, tag]);
    }
  }

  const addGroupTag = (tag) =>{
    const isSelected = group_tags.includes(tag);
    if (isSelected) {
      set_group_tags(prevTags => prevTags.filter((selectedTag) => selectedTag !== tag));
    } else {
      set_group_tags([...group_tags, tag]);
    }
  }

  const HelpPopup = ({ onClose }) => {
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

  const doHelp = () =>{
    setShowHelp(!showHelp)
  }

  return (
    <div>
      <Dashboard>
      </Dashboard>
      <BaseContainer>
        <div className="recipes headerContainer">
          <div className="recipes backButtonContainer">
            <Button className = "backButton">
              Back
            </Button>
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
            <Button className="recipes add">
              Add Recipe
            </Button>
          </div>
        </div>
        <div className = "recipes container">
          {showHelp && <HelpPopup onClose={doHelp} />}
          <div className = "recipes formLeft">
            <div className ="recipes imageContainer">

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
                        const newAmounts = [...recipe_ing_amount];
                        newAmounts[index] = value;
                        set_recipe_ing_amount(newAmounts);
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

/**
 * You can get access to the history object's properties via the useLocation, useNavigate, useParams, ... hooks.
 */
export default addRecipe;

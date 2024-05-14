import React, { useState, useEffect } from "react";
import { api, handleError } from "helpers/api";
import { useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";
import ReactDOM from "react-dom";
import "styles/views/AddRecipe.scss";
import PropTypes from "prop-types";
import Dashboard from "components/ui/Dashboard";
import Footer from "components/ui/footer";
import BaseContainer from "components/ui/BaseContainer_new";
import Header_new from "components/ui/Header_new";
import Recipe from "models/Recipe";
import { Spinner } from "components/ui/Spinner";
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
  const currentUserID = localStorage.getItem("userID");

  const [title, set_recipe_title] = useState<string>(null);
  const [link, set_recipe_link] = useState<string>(null);
  const [shortDescription, set_recipe_description] = useState<string>(null);
  const [image, set_recipe_image] = useState<string>(null);
  const [cookingTime, set_recipe_prep] = useState<string>(null);
  const [ingredients, set_recipe_ing] = useState<string[]>([]);
  const [amounts, set_recipe_amount] = useState<string[]>([]);
  const [instructions, set_recipe_steps] = useState<string[]>([]);
  const [tags, set_recipe_tags] = useState<string[]>([]);
  const [descriptionError, setDescriptionError] = useState(false);

  const [showHelp, setShowHelp] = useState(false);

  const [groupList, setGroupList] = useState<object[]>([]);
  const [groupState, setGroupState] = useState(false);
  const [groups, set_groups] = useState<Int16Array[]>([]);

  const handleDescriptionChange = (value: string) => {
    if (value.length <= 100) { 
      set_recipe_description(value); 
      setDescriptionError(false); 
    } else {
      setDescriptionError(true);
    }
  };

  const LengthExceedModal = ({open, onClose}) =>{
    if (!open) return null; 

    const handleCancel = () => {
      onClose();
    };

    return ReactDOM.createPortal(
      <>
        <div className="modal backdrop"></div>
        ;
        <div className="modal conatiner">
          <div className="modal title">Warning</div>
          <div className="modal text">
          Recipe description has exceeded maximum length of 100 characters
          </div>
          <div className="modal button-container">
            <Button className="modal button-center" onClick={handleCancel}>
              Close
            </Button>
          </div>
        </div>
      </>,
      document.getElementById("portal-invite-user"),
    );
  };

  LengthExceedModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
  };

  const addField = () => { /*to add a field for adding ingredients and their amount*/
    if (ingredients.some(ingredient => ingredient.trim() === "")){

      return; 
    }
    set_recipe_ing([...ingredients, ""]);
    set_recipe_amount([...amounts, ""]);
  };

  const addStep = () => {/*to add a field for adding steps to complete recipe*/
    if (instructions.some(step => step.trim() === "")) { // user will only be able to add new field after the previous one has had details entered
      // If any step field is empty, don't add a new field
      return;
    }
    set_recipe_steps([...instructions, ""]);
  };

  const addRecipeTag = (tag) => { /*to add a tag to a recipe*/
    const isSelected = tags.includes(tag); /*to see if something has already been selected, we check if there is a tag in the recipe_tags list*/
    if (isSelected) {
      set_recipe_tags(prevTags => prevTags.filter((selectedTag) => selectedTag !== tag)); /*if there is a tag, check the current one clicked is not the same */
    } else {
      if (tags.length <= 3) {
        set_recipe_tags([...tags, tag]);
      } else {
        console.log("Maximum number of tags reached");
      }
    }
  };

  const addGroupTag = (id) => { /*to add a group tag to a recipe*/
    const isSelected = groups.includes(id);
    if (isSelected) {
      set_groups(prevID => prevID.filter((selectedID) => selectedID !== id));
    } else {
      set_groups([...groups, id]);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get(`/users/${currentUserID}/groups`);
        await new Promise((resolve) => setTimeout(resolve, 500));
        setGroupState(true);
        setGroupList(response.data);
        set_recipe_image(select_image);
      } catch (error) {
        console.error(`Something went wrong while fetching the groups: \n${handleError(error)}`);
        console.error("Details:", error);
        alert("Something went wrong while fetching the groups! See the console for details.");
      }
    }

    fetchData();
  }, []);


  const HelpPopup = ({ onClose }) => {/*when clicking on help, the following pop up is displayed explaining how to add a recipe*/
    return (
      <div className="recipes popupContainer">
        <div className="recipes popup">
          <p>Recipes must have a title, description and preparation time.</p>
          <p>Recipes can either be added with a URL link or by manually typing in ingredients and steps.</p>
          <p>Recipe tags can be added.</p>
          <p>Recipes will automatically be added to your personal cookbook and can also be added to group cookbooks.</p>
          <Button
            className="help close"
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

  const doHelp = () => { /*function to show the help section*/
    setShowHelp(!showHelp);
  };

  const doNoGroup = () => {

    return <p className="Home noGroupText">not part of any groups yet</p>;
  };

  const showGroups = () => {
    const validGroups = groupList.filter(group => group);
    if (groupList.length > 0) {
      return validGroups.map((group, index) => (
        <Button
          key={index}
          className={`recipes tag ${groups.includes(group.groupID) ? "selected" : ""}`}
          onClick={() => addGroupTag(group.groupID)}>
          {group.groupName}
        </Button>
      ));
    } else {
      return doNoGroup();
    }
  };

  const saveChanges = async () => {
    try {
      const filteredInstructions = instructions.filter(step => step.trim() !== "");
      const filteredAmounts = amounts.filter(amount => amount.trim() !== "");
      const filteredIngredients = ingredients.filter(amount => amount.trim() !== "");
      const requestBody2 = JSON.stringify({/*if we have no link, we have steps and ingredients and save the following information*/
        title, shortDescription, cookingTime, image, link, amounts:filteredAmounts, ingredients:filteredIngredients, instructions:filteredInstructions, tags, groups,
      });
      const response2 = await api.post(`/users/${currentUserID}/cookbooks`, requestBody2);
      const recipe = new Recipe(response2.data);
      localStorage.setItem("recipeID", recipe.id); //not 100% sure if we need this, need to check with getting a recipe
      const recipeID = localStorage.getItem("recipeID");
      navigate(`/users/${currentUserID}/cookbooks/${recipeID}`);
    } catch (error) {
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
      set_groups([]);
    }
  };

  const addImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const dataURL = event.target.result;
          set_recipe_image(dataURL);
        };
        reader.readAsDataURL(file as Blob);
      }
    };
    input.click();
  };


  if (!groupState) {

    return <Spinner />; //had to use the spinner because it takes a while to render the content
  } else {

    return (
      <div>
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
          activePage="recipe"
        />
        <BaseContainer>
          <div className="recipes headerContainer">
            <div className="recipes backButtonContainer">
              <Button
                className="backButton"
                onClick={() => navigate(-1)}
              >Back</Button>
            </div>
            <div className="recipes titleContainer">
              <h2 className="recipes title">Add a recipe</h2>
            </div>
            <div className="recipes helpContainer">
              <Button className="help"
                onClick={doHelp}>
                help
              </Button>
            </div>
            <div className="recipes addButtonContainer">
              <Button
                /*button is disabled unless we have a link or we have some steps*/
                className="recipes add"
                disabled={!link && !instructions.some(step => step.trim() !== "")} /*checks if there are no recipe steps with content -> curtesy of chatGPT*/
                onClick={() => saveChanges()}>
                Create Recipe
              </Button>
            </div>
          </div>
          <div className="recipes container">
            {showHelp && <HelpPopup onClose={doHelp} />}
            <div className="recipes formLeft">
              <div className="recipes imageContainer"
                onClick={addImage}>
                <img src={image} alt="icon" className="recipes image"></img>
              </div>
              <FormField
                label="Add a title:"
                value={title}
                onChange={(rt: string) => set_recipe_title(rt)}>
              </FormField>
              <FormField
                label="Description:"
                value={shortDescription}
                onChange={(rd: string) => handleDescriptionChange(rd)}>
              </FormField>
              <LengthExceedModal
                open={descriptionError}
                onClose={() => setDescriptionError(false)}>
              </LengthExceedModal>
              <FormField
                label="Preparation time:"
                value={cookingTime}
                onChange={(rp: string) => set_recipe_prep(rp)}>
              </FormField>
            </div>
            <div className="recipes formRight">
              <FormField
                label="Add a recipe by URL link:"
                value={link}
                onChange={(rl: string) => set_recipe_link(rl)}>
              </FormField>
              <div className="recipes ingredients">
                <p className="recipes p">Add all ingredients:</p>
                <div className="recipes ingredientsHeader">
                  <p className="recipes ingredientsHeaderAmount">Amount:</p>
                  <p className="recipes ingredientsHeaderIng">Ingredient:</p>
                </div>
                {ingredients.map((_, index) => (
                  <div key={index} className="recipes ingredientFields">
                    <div className="recipes ingredientsAmount">
                      <IngredientsField
                        value={amounts[index]}
                        onChange={(value) => {
                          const newAmounts = [...amounts]; /*creating a copy of recipe_ing_amount*/
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
              <div className="recipes steps">
                <p className="recipes p">Add all steps:</p>
                {instructions.map((step, index) => (
                  <div key={index} className="recipes stepField">
                    <div className="recipes stepNumber">{index + 1}.</div>
                    <StepsField
                      value={step}
                      onChange={(value) => {
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
              <div className="recipes tags">
                <p className="recipes p tags">Select tags (max 3):</p>
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
                  onClick={() => addRecipeTag("LACTOSEFREE")}
                  disabled={tags.length >= 3 && !tags.includes("LACTOSEFREE")}>
                  Lactose-free
                </Button>
                <Button
                  className={`recipes tag ${tags.includes("GLUTENFREE") ? "selected" : ""}`}
                  onClick={() => addRecipeTag("GLUTENFREE")}
                  disabled={tags.length >= 3 && !tags.includes("GLUTENFREE")}>
                  Gluten-free
                </Button>
                <Button
                  className={`recipes tag ${tags.includes("BREAKFAST") ? "selected" : ""}`}
                  onClick={() => addRecipeTag("BREAKFAST")}
                  disabled={tags.length >= 3 && !tags.includes("BREAKFAST")}>
                  Breakfast
                </Button>
                <Button
                  className={`recipes tag ${tags.includes("LUNCH") ? "selected" : ""}`}
                  onClick={() => addRecipeTag("LUNCH")}
                  disabled={tags.length >= 3 && !tags.includes("LUNCH")}>
                  Lunch
                </Button>
                <Button
                  className={`recipes tag ${tags.includes("APÉRO") ? "selected" : ""}`}
                  onClick={() => addRecipeTag("APÉRO")}
                  disabled={tags.length >= 3 && !tags.includes("APÉRO")}>
                  Apéro
                </Button>
                <Button
                  className={`recipes tag ${tags.includes("DESSERT") ? "selected" : ""}`}
                  onClick={() => addRecipeTag("DESSERT")}
                  disabled={tags.length >= 3 && !tags.includes("DESSERT")}>
                  Desert
                </Button>
              </div>
              <div className="recipes tags groups">
                <p className="recipes p tags">Select Groups:</p>
                {showGroups()}
              </div>
            </div>
          </div>
        </BaseContainer>
        <Footer>
        </Footer>
      </div>
    );
  }

};

export default addRecipe;
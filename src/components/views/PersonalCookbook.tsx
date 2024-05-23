import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useNavigate } from "react-router-dom";
import { api, handleError } from "helpers/api";
import { Button } from "components/ui/Button";
import PropTypes from "prop-types";
import "styles/views/Cookbooks.scss";
import "styles/views/Modal.scss";
import Dashboard from "components/ui/Dashboard";
import Footer from "components/ui/footer";
import Header_new from "components/ui/Header_new";
import BaseContainer from "components/ui/BaseContainer_new";
import { Spinner } from "../ui/Spinner";


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
  onChange: PropTypes.func.isRequired,
};


const PersonalCookbook = () => {
  const navigate = useNavigate();
  const [filterKeyword, setFilterKeyword] = useState<string>("");
  const userID = localStorage.getItem("userID"); /*getting the ID of the currently logged in user*/
  const [recipeState, setRecipeState] = useState(false);
  const [recipeList, setRecipeList] = useState<object[]>([]);
  const [originalRecipeList, setOriginalRecipeList] = useState<object[]>([]);
  const [deleteState, setDeleteState] = useState(false);
  const [selectedRecipeList, setSelectedRecipeList] = useState<object[]>([]);
  const [isConsentModalOpen, setIsConsentModalOpen] = useState(false);


  const fetchData = async () => {
    try {
      const response = await api.get(`/users/${userID}/cookbooks`);
      await new Promise((resolve) => setTimeout(resolve, 500));
      setRecipeState(true);

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
      setRecipeState(true);
    } catch (error) {
      console.error(
        `Something went wrong while fetching the recipes: \n${handleError(
          error,
        )}`,
      );
      console.error("Details:", error);
      alert(
        "Something went wrong while fetching the users! See the console for details.",
      );
    }
    setSelectedRecipeList([]);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleClickRecipe = (recipeId: string) => {
    if (!deleteState) {
      navigate(`/users/${userID}/cookbooks/${recipeId}`);
    } else {
      if (selectedRecipeList.includes(recipeId)) {
        // if already selected, remove it
        setSelectedRecipeList(selectedRecipeList.filter(id => id !== recipeId));
      } else {
        // if not selected, add it
        setSelectedRecipeList([...selectedRecipeList, recipeId]);
      }
    }
  };
  const handleClickEdit=(event,recipeId:string)=>{
    event.stopPropagation();
    navigate(`/users/${userID}/cookbooks/${recipeId}/edit`);
  }


  const handleFilterChange = (newValue) => {
    setFilterKeyword(newValue);
  };

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
      if(description.length < 20){
        return description
      }
      else{
        return `${description.substring(0, 20)}...`;
      }
    }
  }

  const filterRecipe = () => {
    if(filterKeyword){
      const lowerCaseFilterKeyword = filterKeyword.toLowerCase();
      const filteredRecipes = originalRecipeList.filter(recipe => {
        const lowerCaseTitle = recipe.title.toLowerCase();
        const lowerCaseTags = recipe.tags.map(tag => tag.toLowerCase());

        return lowerCaseTitle.includes(lowerCaseFilterKeyword) || lowerCaseTags.some(tag => tag.includes(lowerCaseFilterKeyword));
      });
      setRecipeList(filteredRecipes);
    }else{
      alert("Filter keyword cannot be empty");
    }
  };
  const clearRecipe=()=>{
    setRecipeList(originalRecipeList);
    setFilterKeyword("");
  }

  const Recipe = ({ id, title, description, time, tag, imageUrl,onClick}: any) => {
    const isSelected = selectedRecipeList.includes(id);

    return (
      <div className="cookbook recipeContainer">
        <button className={`cookbook recipeButton ${isSelected ? "selected" : ""}`} onClick={onClick}>
          <div className="cookbook recipeImgContainer">
            <img className="cookbook recipeImg" src={imageUrl} alt="Recipe Image" />
          </div>
          <div className="cookbook recipeContent">
            <h2 className="cookbook recipeTitle">{title}</h2>
            <p className="cookbook recipeDescription">{doDescription(description)}</p>
            <p className="cookbook recipeTime"><strong>Total Time: </strong>{time}</p>
            <p className="cookbook recipeTags"><strong>Tags: </strong>{doTags(tag)}</p>
          </div>
          <div className="cookbook editButtonContainer">
            <Button className="cookbook editRecipeButton" onClick={(event) => handleClickEdit(event, id)}>Edit Recipe</Button>
          </div>
        </button>
      </div>
    );
  };

  const RecipeList = ({ recipes,onClickRecipe  }: any) => (
    <div className="cookbook recipeListContainer">
      {recipes.map((recipe: any, index: number) => (
        <Recipe
          key={index}
          id={recipe.id}
          title={recipe.title}
          onClick={() => onClickRecipe (recipe.id)}
          description={recipe.shortDescription}
          time={recipe.cookingTime}
          tag={recipe.tags}
          imageUrl={recipe.image}
        />
      ))}
    </div>
  );

  const handelSelectRecipe = () => {
    setDeleteState(!deleteState);
    if (deleteState === true && selectedRecipeList.length > 0) {
      setIsConsentModalOpen(true);
    }
  };

  const ConsentModal = ({ open, onClose }) => {
    if (!open) return null;

    const deleteRecipe = async () => {
      if (selectedRecipeList.length === 0) {
        alert("Please select at least one recipe to delete!");

        return;
      }
      for (const recipeid of selectedRecipeList) {
        try {
          const requestBody = JSON.stringify(recipeid);
          const response = await api.delete(`/users/${userID}/cookbooks/${recipeid}`, requestBody);
          await new Promise((resolve) => setTimeout(resolve, 500));
          if (!response) {
            alert("Something went wrong while deleting the recipes!");
          }
        } catch (error) {
          console.error(
            `Something went wrong while deleting the recipes: \n${handleError(
              error,
            )}`,
          );
          console.error("Details:", error);
          alert(
            "Something went wrong while deleting the recipe! See the console for details.",
          );
        }
      }
      fetchData();
      onClose();
    };

    const handleCancel = () => {
      setSelectedRecipeList([]);
      onClose();
    };

    return ReactDOM.createPortal(
      <>
        <div className="modal backdrop"></div>
        ;
        <div className="modal conatiner">
          <div className="modal title">Warning</div>
          <div className="modal text">
            All the recipes you selected will be deleted from your personal cookbook and all the associated group
            cookbooks
          </div>
          <div className="modal text">
            Are you sure?
          </div>
          <div className="modal button-container">
            <Button className="modal button" onClick={handleCancel}>
              Cancel
            </Button>
            <Button className="modal highlight" onClick={deleteRecipe}>
              Yes
            </Button>
          </div>
        </div>
      </>,
      document.getElementById("portal-invite-user"),
    );
  };

  ConsentModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
  };


  if (!recipeState) {

    return <Spinner />;
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
          activePage="personalCookbook"
        />
        <BaseContainer>

          {/*head field*/}
          <div className="cookbook headerContainer">
            <Button className="backButton" onClick={() => navigate(-1)}>
              Back
            </Button>
            <h2 className="cookbook title">Personal Cookbook</h2>
            <Button
              className={`${deleteState ? "hightlightButton" : "backButton"}`}
              onClick={handelSelectRecipe}>
              Delete Recipes
            </Button>
            <ConsentModal
              open={isConsentModalOpen}
              onClose={() => setIsConsentModalOpen(false)}>
            </ConsentModal>
          </div>

          <div className="cookbook filterContainer">
            <div className="cookbook filterButtonContainer">
              <Button className="cookbook filterButton" onClick={filterRecipe} disabled={!filterKeyword}>filter</Button>
              <Button className="cookbook clearButton" onClick={clearRecipe} disabled={!filterKeyword && recipeList.length === originalRecipeList.length}>clear</Button>
            </div>
            <FormField
              value={filterKeyword}
              onChange={handleFilterChange}>
            </FormField>
          </div>

          <div>
            {recipeList.length === 0 ? (
              <p className="cookbook noRecipeText">no recipes saved yet</p>
            ) : (
              <RecipeList recipes={recipeList} onClickRecipe={handleClickRecipe} />
            )}
          </div>
        </BaseContainer>
        <Footer>
        </Footer>
      </div>
    );
  }
};

export default PersonalCookbook;
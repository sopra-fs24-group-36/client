import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactDOM from "react-dom";
import { Button } from "components/ui/Button";
import PropTypes from "prop-types";
import "styles/views/Cookbooks.scss";
import "styles/views/Modal.scss";
import Recipe from "models/Recipe";
import Dashboard from "components/ui/Dashboard";
import { api, handleError } from "helpers/api";
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

const GroupCookbook = () => {
  const navigate = useNavigate();
  const [filterKeyword, setFilterKeyword] = useState<string>("");
  const userID = localStorage.getItem("userID"); /*getting the ID of the currently logged in user*/
  const { groupID } = useParams();
  const [groupInfo, setGroupInfo] = useState<any[]>([]);
  const [recipeState, setRecipeState] = useState(false);
  const [recipeList, setRecipeList] = useState<any[]>([]);
  const [originalRecipeList, setOriginalRecipeList] = useState<object[]>([]);
  const [removeState, setRemoveState] = useState(false);
  const [selectedRecipeList, setSelectedRecipeList] = useState<object[]>([]);
  const [isConsentModalOpen, setIsConsentModalOpen] = useState(false);

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


  const fetchData = async () => {
    try {
      const response = await api.get(`/groups/${groupID}/cookbooks`);
      await new Promise((resolve) => setTimeout(resolve, 500));
      setRecipeState(true);

      const formattedRecipes = response.data.map((recipe: any) => ({
        id: recipe.id,
        title: recipe.title,
        shortDescription: recipe.shortDescription,
        cookingTime: recipe.cookingTime,
        tags: recipe.tags,
        image: recipe.image,
        autherID: recipe.authorID,
      }));
      setRecipeState(true);
      setRecipeList(formattedRecipes);
      setOriginalRecipeList(formattedRecipes);
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
    setSelectedRecipeList([]);
  };

  useEffect(() => {
    fetchData();
  }, [groupID]);


  const handleClickRecipe = (recipeId: string) => {
    if (!removeState) {
      navigate(`/groups/${groupID}/cookbooks/${recipeId}`);
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

  const handleClickEdit=(event,recipeId:string,autherID)=>{
    event.stopPropagation();
    navigate(`/users/${autherID}/cookbooks/${recipeId}/edit`);
  }
  const handleFilterChange = (newValue) => {
    setFilterKeyword(newValue);
  };

  const filterRecipe = () => {
    const lowerCaseFilterKeyword = filterKeyword.toLowerCase();
    const filteredRecipes = originalRecipeList.filter(recipe => {
      const lowerCaseTitle = recipe.title.toLowerCase();
      const lowerCaseTags = recipe.tags.map(tag => tag.toLowerCase());

      return lowerCaseTitle.includes(lowerCaseFilterKeyword) || lowerCaseTags.some(tag => tag.includes(lowerCaseFilterKeyword));
    });
    setRecipeList(filteredRecipes);
    setFilterKeyword("");
  };


  const handelSelectRecipe = (recipe: Recipe) => {
    setRemoveState(!removeState);
    if (removeState === true && selectedRecipeList.length > 0) {
      setIsConsentModalOpen(true);
    }
  };

  const ConsentModal = ({ open, onClose }) => {
    if (!open) return null;

    const removeRecipe = async () => {
      if (selectedRecipeList.length === 0) {
        alert("Please select at least one recipe to delete!");

        return;
      }
      for (const recipeid of selectedRecipeList) {
        try {
          const requestBody = JSON.stringify(recipeid);
          const response = await api.put(`/groups/${groupID}/cookbooks/${recipeid}`, requestBody);
          await new Promise((resolve) => setTimeout(resolve, 500));
          if (!response) {
            alert("Something went wrong while removing the recipes!");
          }
        } catch (error) {
          console.error(
            `Something went wrong while removing the recipes: \n${handleError(
              error,
            )}`,
          );
          console.error("Details:", error);
          alert(
            "Something went wrong while removing the recipe! See the console for details.",
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
          <div className="modal title">Warnning</div>
          <div className="modal text">
            All the recipes you selected will be removed from this group cookbook
          </div>
          <div className="modal text">
            But the recipes will still be available in the creator`s personal cookbook
          </div>
          <div className="modal text">
            Are you sure?
          </div>
          <div className="modal button-container">
            <Button className="modal button" onClick={handleCancel}>
              Cancel
            </Button>
            <Button className="modal highlight" onClick={removeRecipe}>
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


  const Recipe = ({ id, title, description, time, tag, imageUrl, autherID, onClick }: any) => {
    const isSelected = selectedRecipeList.includes(id);
    const [user, setUser] = useState<any>({});

    useEffect(() => {
      const fetchUserData = async () => {
        try {
          const response = await api.get(`/users/${autherID}`);
          setUser(response.data);
        } catch (error) {
          console.error(
            `Something went wrong while fetching the user data: \n${handleError(error)}`,
          );
          console.error("Details:", error);
          alert("Something went wrong while fetching the user data! See the console for details.");
        }
      };
      fetchUserData();
    }, [autherID]);

    const userImgUrl = useMemo(() => user.profilePicture || "", [user.profilePicture]);

    return (
      <div className="cookbook recipeContainer">
        <button className={`cookbook recipeButton ${isSelected ? "selected" : ""}`} onClick={onClick}>
          <div className="cookbook recipeUserImgContainer">
            <img className="cookbook recipeUserImg" src={userImgUrl} alt="User Image" />
          </div>
          <div className="cookbook recipeImgContainer">
            <img className="cookbook recipeImg" src={imageUrl} alt="Recipe Image" />
          </div>
          <div className="cookbook recipeContent">
            <h2 className="cookbook recipeTitle">{title}</h2>
            <p className="cookbook recipeDescription">Description: {description}</p>
            <p className="cookbook recipeTime">Total Time: {time}</p>
            <p className="cookbook recipeTags">Tags: {tag.join(",")}</p>
          </div>
          <div className="cookbook editButtonContainer">
            <Button className="cookbook editRecipeButton" onClick={(event) => handleClickEdit(event, id,autherID)}>Edit
              Recipe</Button>
          </div>
        </button>
      </div>
    );
  };

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
          autherID={recipe.autherID}
        />
      ))}
    </div>
  );

  let content;
  if (!recipeState) {
    content = <Spinner />;
  } else {
    content = (
      <div>
        <Header_new />
        <Dashboard
          showButtons={{
            home: true,
            cookbook: true,
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
              <Button className="cookbook backButton" onClick={() => navigate(-1)}>
                Back
              </Button>
            </div>
            <div className="cookbook titleContainer">
              <h2 className="cookbook title">{groupInfo.name} - Cookbook</h2>
            </div>
            <div className="cookbook backButtonContainer">
              <Button
                className={`${removeState ? "hightlightButton" : "backButton"}`}
                onClick={handelSelectRecipe}>
                Remove Recipes
              </Button>
              <ConsentModal
                open={isConsentModalOpen}
                onClose={() => setIsConsentModalOpen(false)}>
              </ConsentModal>
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
  }

  return (
    <div>
      {content}
    </div>
  );
};

export default GroupCookbook;
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactDOM from "react-dom";
import { Button } from "components/ui/Button";
import PropTypes from "prop-types";
import "styles/views/Cookbooks.scss";
import "styles/views/Modal.scss";
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
        placeholder="Search for group recipes by name or tag"
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
  const { groupID } = useParams();
  const [groupInfo, setGroupInfo] = useState<any[]>([]);
  const [filterKeyword, setFilterKeyword] = useState<string>("");

  const [recipeState, setRecipeState] = useState(false);        // false = loading, true = loaded
  const [removeState, setRemoveState] = useState(false);        // false = normal, true = remove
  const [refreshState, setRefreshState] = useState(false);      // false = can refresh, true = do not refresh
  const [isConsentModalOpen, setIsConsentModalOpen] = useState(false);

  const [displayRecipeList, setDisplayRecipeList] = useState<any[]>([]);  // List of recipes to display
  const [originalRecipeList, setOriginalRecipeList] = useState<object[]>([]); // List of recipes from backend
  const [selectedRecipeList, setSelectedRecipeList] = useState<object[]>([]); // List of recipes to remove

  const userID = localStorage.getItem("userID");

  // only load once, when open the page
  useEffect(() => {
    const fetchGroupInfo = async () => {
      try {
        const response = await api.get(`/groups/${groupID}`);
        setGroupInfo(response.data);
      } catch (error) {
        alert("Something went wrong while fetching the group");
      }
    };
    const fetchData = async () => {
      setDisplayRecipeList(await fetchRecipes());
      setRecipeState(true);
    };

    fetchGroupInfo();
    fetchData();
  }, [groupID]);


  // polling, refresh the recipes
  // start after the first fetch when recipeState is true
  // if in filter mode or remove mode, do not refresh
  useEffect(() => {
    if (recipeState && !refreshState && !removeState) {
      const interval = setInterval(async () => {
        setDisplayRecipeList(await fetchRecipes());
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [groupID, refreshState, removeState]);

  const fetchRecipes = async () => {
    try {
      const response = await api.get(`/groups/${groupID}/cookbooks`);
      const formattedRecipes = response.data.map((recipe: any) => ({
        id: recipe.id,
        title: recipe.title,
        shortDescription: recipe.shortDescription,
        cookingTime: recipe.cookingTime,
        tags: recipe.tags,
        image: recipe.image,
        authorID: recipe.authorID,
      }));
      const recipeList = await fetchUserImages(formattedRecipes);
      setOriginalRecipeList(recipeList);

      return recipeList;
    } catch (error) {
      console.error(`Something went wrong while fetching the groups: \n${handleError(error)}`);
      console.error("Details:", error);
      alert("Something went wrong while fetching the recipes! See the console for details.");
    }
  };

  const fetchUserImages = async (recipes: any[]) => {
    return await Promise.all(
      recipes.map(async (recipe) => {
        try {
          const response = await api.get(`/users/${recipe.authorID}`);
          const profilePicture = response.data.profilePicture;

          return { ...recipe, authorImg: profilePicture };
        } catch (error) {
          console.error("Error fetching user image:", error);

          return recipe;
        }
      }),
    );
  };

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

  const handleClickEdit = (event, recipeId: string, autherID: string) => {
    event.stopPropagation();
    navigate(`/users/${autherID}/cookbooks/${recipeId}/edit`);
  };

  const handleFilterChange = (newValue) => {
    setFilterKeyword(newValue);
  };

  const filterRecipe = () => {
    if (filterKeyword) {
      setRefreshState(true);
      const lowerCaseFilterKeyword = filterKeyword.toLowerCase();
      const filteredRecipes = originalRecipeList.filter(recipe => {
        const lowerCaseTitle = recipe.title.toLowerCase();
        const lowerCaseTags = recipe.tags.map(tag => tag.toLowerCase());

        return lowerCaseTitle.includes(lowerCaseFilterKeyword) || lowerCaseTags.some(tag => tag.includes(lowerCaseFilterKeyword));
      });
      setDisplayRecipeList(filteredRecipes);
    } else {
      alert("Filter keyword cannot be empty");
    }
    /*if (filterKeyword === "") {
      setRefreshState(false);
      setDisplayRecipeList(originalRecipeList);
    } else {
      setRefreshState(true);
      const lowerCaseFilterKeyword = filterKeyword.toLowerCase();
      const filteredRecipes = originalRecipeList.filter(recipe => {
        const lowerCaseTitle = recipe.title.toLowerCase();
        const lowerCaseTags = recipe.tags.map(tag => tag.toLowerCase());

        return lowerCaseTitle.includes(lowerCaseFilterKeyword) || lowerCaseTags.some(tag => tag.includes(lowerCaseFilterKeyword));
      });
      setDisplayRecipeList(filteredRecipes);
    }
    setFilterKeyword("");*/
  };
  const clearRecipe = () => {
    setFilterKeyword("");
    setRefreshState(false);
    setDisplayRecipeList(originalRecipeList);
  };

  const handelSelectRecipe = () => {
    setRemoveState(!removeState);
    if (removeState === true && selectedRecipeList.length > 0) {
      setIsConsentModalOpen(true);
    }
    if (removeState === false || (removeState === true && selectedRecipeList.length > 0)) {
      setRefreshState(true);
    } else {
      setRefreshState(false);
    }
  };

  const handelMembers = () => {
    navigate(`/groups/${groupID}/members`);
  };

  const doDescription = (description) => {
    if (description) {
      return description.length < 20 ? description : `${description.substring(0, 20)}...`;
    }
  };


  const ConsentModal = ({ open, onClose }) => {
    if (!open) {
      return null;
    } else {
      setRefreshState(true);
    }

    const removeRecipe = async () => {
      if (selectedRecipeList.length === 0) {
        alert("Please select at least one recipe to delete!");

        return;
      }

      try {
        for (const recipeId of selectedRecipeList) {
          const requestBody = JSON.stringify(recipeId);
          api.put(`/groups/${groupID}/cookbooks/${recipeId}`, requestBody);
        }
        // Remove selectedRecipeList from originalRecipeList
        const filteredRecipes = originalRecipeList.filter(
          recipe => !selectedRecipeList.includes(recipe.id),
        );
        setDisplayRecipeList(filteredRecipes);
        setOriginalRecipeList(filteredRecipes);
        setSelectedRecipeList([]);

        onClose();

        // Wait for few seconds before setting refreshState to false, make the page not refresh immediately
        setTimeout(() => {
          setRefreshState(false);
        }, 10000);
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
    };

    const handleCancel = () => {
      setSelectedRecipeList([]);
      setRefreshState(false);
      onClose();
    };

    return ReactDOM.createPortal(
      <>
        <div className="modal backdrop"></div>
        ;
        <div className="modal conatiner">
          <div className="modal title">Warning</div>
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


  const Recipe = ({ id, title, description, time, tag, imageUrl, authorImg, authorID, onClick }: any) => {
    const isSelected = selectedRecipeList.includes(id);
    const isDisabled = String(userID) !== String(authorID);
    console.log(`Recipe ID: ${id}, Author ID: ${authorID}, User ID: ${userID}, isDisabled: ${isDisabled}`);


    return (
      <div className="cookbook recipeContainer">
        <button className={`cookbook recipeButton ${isSelected ? "selected" : ""}`} onClick={onClick}>
          <div className="cookbook recipeUserImgContainer">
            <img className="cookbook recipeUserImg" src={authorImg} alt="Author Image" />
          </div>
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
            <Button
              className="cookbook editRecipeButton"
              onClick={(event) => {
                if (!isDisabled) {
                  handleClickEdit(event, id, authorID);
                }
              }}
              disabled={isDisabled}
            >
              Edit Recipe</Button>
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
          authorImg={recipe.authorImg}
          authorID={recipe.authorID}
        />
      ))}
    </div>
  );

  if (!recipeState) {

    return <Spinner />;
  } else {

    return (
      <div>
        <Header_new />
        <Dashboard
          showButtons={{
            home: true,
            cookbook: true,
            recipe: true,
            group: true,
            groupCalendar: true,
            groupShoppinglist: true,
            leaveGroup: true,
          }}
          activePage="leaveGroup"
        />
        <BaseContainer>
          {/*head field*/}
          <div className="cookbook headerContainer">
            <Button className="cookbook backButton" onClick={() => navigate(-1)}>
              Back
            </Button>
            <div className="cookbook titleContainer">
              <h2 className="cookbook title">{groupInfo.name} - Cookbook</h2>
            </div>
            <div className="cookbook backButtonContainer">
              <Button className="cookbook groupButton" onClick={handelMembers}>
                Members
              </Button>
              <Button
                className={`${removeState ? "hightlightButton" : "groupButton"}`}
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
              <Button className="cookbook filterButton" onClick={filterRecipe} disabled={!filterKeyword}>filter</Button>
              <Button className="cookbook clearButton" onClick={clearRecipe}
                disabled={!filterKeyword && displayRecipeList.length === originalRecipeList.length}>clear</Button>
            </div>
            <FormField
              className="cookbook input"
              value={filterKeyword}
              onChange={handleFilterChange}>
            </FormField>
          </div>
          <RecipeList recipes={displayRecipeList} onClickRecipe={handleClickRecipe} />
        </BaseContainer>
        <Footer>
        </Footer>
      </div>
    );
  }
};

export default GroupCookbook;
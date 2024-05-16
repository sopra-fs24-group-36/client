import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { api, handleError } from "helpers/api";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Recipe.scss";
import Dashboard from "components/ui/Dashboard";
import Footer from "components/ui/footer";
import BaseContainer from "components/ui/BaseContainer_new";
import Header_new from "components/ui/Header_new";
import { Spinner } from "components/ui/Spinner";

const FormField = (props) => {
  return (
    <div className="modal field">
      <div className="modal input-container">
        <input
          className="modal input"
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
        />
      </div>
    </div>
  );
};

FormField.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

const GroupRecipe = () => {
  const navigate = useNavigate();
  const { groupID, recipeID } = useParams(); //User ID of recipe's author and recipeID
  const [recipe, setRecipe] = useState(null); //getting the recipe we are currently viewing
  const userID = localStorage.getItem("userID");
  const [comments, setComments] = useState<object[]>([]);
  const [rating, setRating] = useState(0.0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [authorID, setAuthorID] = useState(null);

  async function fetchData() {
    try {
      const response = await api.get(`/groups/${groupID}/cookbooks/${recipeID}`);
      await new Promise((resolve) => setTimeout(resolve, 500));
      await fetchComment();
      setRecipe(response.data);
      setAuthorID(response.data.authorID);
    } catch (error) {
      console.error(
        `Something went wrong while fetching the recipe: \n${handleError(error)}`,
      );
      console.error("Details:", error);
      alert("Something went wrong while fetching the recipe! See the console for details.");
    }
  }

  async function fetchComment() {
    try {
      const response = await api.get(`/comments/recipes/${recipeID}`);
      await new Promise((resolve) => setTimeout(resolve, 500));
      const commentsList = response.data.map(comment => ({
        id: comment.id,
        text: comment.text,
        username: comment.username,
      }));
      setComments(commentsList);

      const responseRate = await api.get(`/votes/recipes/${recipeID}`);
      await new Promise((resolve) => setTimeout(resolve, 500));
      const rating = responseRate.data.vote;
      setRating(rating);
    } catch (error) {
      console.error(
        `Something went wrong while fetching the comments: \n${handleError(error)}`,
      );
      console.error("Details:", error);
      alert("Something went wrong while fetching the comments! See the console for details.");
    }
  }

  useEffect(() => {
    fetchData()
  }, [recipeID]);


  const editRecipe = () => {
    navigate(`/users/${authorID}/cookbooks/${recipeID}/edit`);
  };


  const doTags = () => {
    const recipeTags = recipe.tags;
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

  const doIngredients = () => {
    const recipeIngredients = recipe.ingredients;
    const recipeAmounts = recipe.amounts;
    if (recipeIngredients.length === 0) {
      return <p>This recipe has no ingredients</p>;
    }
    // Map each ingredient to a JSX <li> element

    return recipeIngredients.map((ingredient, index) => (
      <li key={index}>{recipeAmounts[index]} {ingredient}</li>
    ));
  };

  const doInstructions = () => {
    const recipeInstructions = recipe.instructions;
    if (recipeInstructions.length === 0) {

      return <p>This recipe has no instructions</p>;
    }

    return recipeInstructions.map((instruction, index) => (
      <li key={index}>{instruction}</li>
    ));
  };

  const handelDeleteComment = async (commentID) => {
    try {
      await api.delete(`/comments/${commentID}/recipes/${recipeID}`);
      const newComments = comments.filter(comment => comment.id !== commentID);
      setComments(newComments);
    } catch (error) {
      console.error("An error occurred while deleting the comment:", error);
      alert("Deleting the comment failed.");
    }
  };


  const doComments = () => {
    if (comments.length === 0) {

      return (
        <div className="comment noCommentText">
          <p>This recipe has no comment yet.</p>
          <p>Be the first one!</p>
        </div>
      );
    } else {

      return (
        <div>
          {comments.map((comment: any) => (
            // eslint-disable-next-line react/jsx-key
            <Comment
              comment={comment}
            />
          ))}
        </div>
      );
    }
  };


  const Comment = ({ comment }) => {
    const [isHovered, setIsHovered] = useState(false);
    const currentUserName = localStorage.getItem("userName");
    const commentUserName = comment.username;
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    return (
      <div className="comment container" onMouseEnter={() => setIsHovered(true)} 
        onMouseLeave={() => setIsHovered(false)}
      >
        {isHovered && commentUserName === currentUserName && (
          // {isHovered &&  && (
          <div className="comment button-container">
            <li>{comment.text}</li>
            <Button
              className="comment editButton"
              onClick={() => setIsEditModalOpen(true)}>
              Edit
            </Button>
            <EditCommentModal
              open={isEditModalOpen}
              onClose={() => setIsEditModalOpen(false)}
              comment={comment}
            >
            </EditCommentModal>
            <Button
              className="comment deleteButton"
              onClick={() => handelDeleteComment(comment.id)}>
              Delete
            </Button>
          </div>
        )}
        {!(isHovered && commentUserName === currentUserName) && (
          <div>
            <li>{comment.text}</li>
            <div className="comment author"> - {comment.username}</div>
          </div>
        )}
      </div>
    );

  };

  Comment.propTypes = {
    comment: PropTypes.object.isRequired,
  };

  const StarRating = ({ rating }) => {
    const rate = parseFloat(rating);
    const integerPart = Math.floor(rate);
    let decimalPart = false;
    if (rate - integerPart !== 0) {
      decimalPart = true;
    }

    if (rating < 0.9) {
      return (
        <div className="comment noCommentText">
          <p>This recipe has no rating yet.</p>
          <p>Be the first one!</p>
        </div>
      );
    } else {

      return (
        <div className="star-rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <span key={star}>
              {star <= integerPart ? (
                <span className="star-rating star-filled">&#9733;</span>
              ) : star === integerPart + 1 && decimalPart ? (
                <span className="star-rating star-half-filled">&#9734;</span>
              ) : (
                <span className="star-rating star-empty">&#9733;</span>
              )}
            </span>
          ))}
        </div>
      );
    }
  };

  StarRating.propTypes = {
    rating: PropTypes.number.isRequired,
  };

  const CommentModal = ({ open, onClose }) => {
    const userID = localStorage.getItem("userID");
    const { recipeID } = useParams();
    const [comment, setComment] = useState("");
    const [rating, setRating] = useState(0);

    const handleStarClick = (star) => {
      setRating(star);
    };

    if (!open) return null;
    const leaveComment = async () => {
      if (comment === "") {
        alert("Please enter a comment.");

        return;
      }
      try {
        const requestBody = JSON.stringify({
          text: comment,
          userID: parseInt(userID),
        });
        await api.post(`/comments/recipes/${recipeID}`, requestBody);

        const starRating = JSON.stringify({
          vote: rating,
        });
        await api.post(`/votes/recipes/${recipeID}`, starRating);

      } catch (error) {
        console.error("An error occurred while leaving a comment:", error);
        alert("Leaving a comment failed.");
      }
      await fetchComment();
      onClose();
    };

    return ReactDOM.createPortal(
      <>
        <div className="modal backdrop"></div>
        ;
        <div className="modal conatiner">
          <div className="modal title">Leave a Comment</div>
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => handleStarClick(star)}
                style={{ cursor: "pointer", color: star <= rating ? "gold" : "gray" }}
              >
              &#9733;
              </span>
            ))}
          </div>
          <FormField
            value={comment}
            onChange={setComment} />
          <div className="modal button-container">
            <Button className="modal button" onClick={onClose}>
              Cancel
            </Button>
            <Button className="modal highlight" onClick={leaveComment}>
              Send
            </Button>
          </div>
        </div>
      </>,
      document.getElementById("portal-invite-user"),
    );
  };

  CommentModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
  };


  const EditCommentModal = ({ open, onClose, comment }) => {
    const [commentText, setCommentText] = useState(comment.text);

    if (!open) return null;
    const editComment = async () => {
      if (commentText === "") {
        alert("Please enter a comment.");

        return;
      }
      try {
        setCommentText(commentText);
        const requestBody = JSON.stringify({
          text: commentText,
        });
        await api.put(`/comments/${comment.id}`, requestBody);

      } catch (error) {
        console.error("An error occurred while editing a comment:", error);
        alert("Editing a comment failed.");
      }
      fetchComment();
      onClose();
    };

    return ReactDOM.createPortal(
      <>
        <div className="modal backdrop"></div>
        ;
        <div className="modal conatiner">
          <div className="modal title">Edit your Comment</div>
          <FormField
            value={commentText}
            onChange={setCommentText} />
          <div className="modal button-container">
            <Button className="modal button" onClick={onClose}>
              Cancel
            </Button>
            <Button className="modal highlight" onClick={editComment}>
              Send
            </Button>
          </div>
        </div>
      </>,
      document.getElementById("portal-invite-user"),
    );
  };

  EditCommentModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    comment: PropTypes.object.isRequired,
  };


  let content: any;
  if (!recipe) {
    content = <Spinner />; //had to use the spinner because it takes a while to render the content
  } else if (recipe.link) {
    window.open(recipe.link);
    navigate("/home"); //potentially needs taking out when we connect to cookbooks
  } else {
    const canEdit = parseInt(userID) === parseInt(authorID);
    content = (
      <div>
        <Header_new></Header_new>
        <Dashboard
          showButtons={{
            home: true,
            cookbook: true,
            recipe: true,
            groupCalendar: true,
            groupShoppinglist: true,
            leaveGroup: true,
          }}
          activePage=""
        />
        <BaseContainer>
          <div className="recipe headerContainer">
            <div className="recipe backButtonContainer">
              <Button className="backButton" onClick={() => navigate(-1)}>
                Back
              </Button>
            </div>
            <div className="recipe titleContainer">
              <h2 className="recipe title">{recipe.title}</h2>
            </div>
            <div className="recipe editButtonContainer">
              <Button
                className="recipe edit"
                onClick={() => editRecipe()}
                disabled={!canEdit}>
                Edit Recipe
              </Button>
            </div>
          </div>

          <div className="recipe container">

            <div className="recipe left">
              <div className="recipe imageContainer">
                <img src={recipe.image} alt="icon" className="recipe image"></img>
              </div>
              <div className="recipe rating">
              </div>
              <div className="recipe description">
                <p>{recipe.shortDescription}</p>
              </div>
              <div className="recipe time">
                <p><strong>Total Time:</strong> {recipe.cookingTime}</p>
              </div>
              <div className="recipe tags">
                <p><strong>Tags:</strong> {doTags()}</p>
              </div>
              <div className="recipe cutline"></div>
              <StarRating rating={rating} />
              <div className="recipe commentContainer">
                <p><strong>Comments:</strong>{doComments()}</p>
              </div>
              <div className="recipe button-container">
                <Button
                  className="recipe commentButton"
                  onClick={() => setIsModalOpen(true)}>
                  Leave a Comment
                </Button>
                <CommentModal
                  open={isModalOpen}
                  onClose={() => setIsModalOpen(false)}>
                </CommentModal>
              </div>
            </div>

            <div className="recipe right">
              <div className="recipe ingredients">
                <div className="recipe ingredientsTitle">
                  <h2>Ingredients</h2>
                </div>
                <ul className="recipe list">
                  {doIngredients()}
                </ul>
              </div>
              <div className="recipe steps">
                <div className="recipe stepsTitle">
                  <h2>Step by Step</h2>
                </div>
                <ol className="recipe list">
                  {doInstructions()}
                </ol>
              </div>
            </div>
          </div>
        </BaseContainer>
        <Footer></Footer>
      </div>
    );
  }

  return (
    <div>
      {content}
    </div>
  );
};


export default GroupRecipe;

import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { Form, useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Recipe.scss";
import PropTypes from "prop-types";
import Dashboard from "components/ui/Dashboard";
import Footer from "components/ui/footer";
import BaseContainer from "components/ui/BaseContainer_new";
import Header_new from "components/views/Header_new";
// @ts-ignore
import select_image from "../../assets/select_image.png";


const Recipe = () => {
  const editRecipe = () => {
  };

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
        activePage=""
      />
      <BaseContainer>
        <div className="recipe headerContainer">
          <div className="recipe backButtonContainer">
            <Button className="backButton">
              Back
            </Button>
          </div>
          <div className="recipe titleContainer">
            <h2 className="recipe title">Quick fried rice</h2>
          </div>
          <div className="recipe editButtonContainer">
            <Button
              className="recipe edit"
              onClick={() => editRecipe()}>
              Edit Recipe
            </Button>
          </div>
        </div>
        <div className="recipe container">
          <div className="recipe left">
            <div className="recipe imageContainer">
              <img src={select_image} alt="icon" className="recipes image"></img>
            </div>
            <div className="recipe rating">
            </div>
            <div className="recipe description">
              <p>Not enough time? No problem, because this recipe is fast and delicious.</p>
            </div>
            <div className="recipe time">
              <p>Total Time: 25min</p>
            </div>
            <div className="recipe tags">
              <p>Tags: vegetarian</p>
            </div>
          </div>
          <div className="recipe right">
            <div className="recipe ingredients">
              <div className="recipe ingredientsTitle">
                <h2>Ingredients</h2>
              </div>
              <ul className="recipe list">
                <li>rice</li>
                <li>1 tbsp oil</li>
                <li>2 onions, cut into thin wedges</li>
                <li>2 garlic cloves, pressed</li>
                <li>250g basmati rice (2 minutes cooking time)</li>
                <li>300g wok vegetables</li>
                <li>½ dl soy sauce</li>
                <li>3 eggs, beaten</li>
              </ul>
            </div>
            <div className="recipe steps">
              <div className="recipe stepsTitle">
                <h2>Step by Step</h2>
              </div>
              <ol className="recipe list">
                <li>Heat oil in a pan. Sauté onion and garlic. Add the rice and stir-fry for approx. 10 minutes. Add
                  vegetables and stir-fry for approx. 5 minutes. Pour in soy sauce, mix.
                </li>
                <li>Before serving, mix the eggs into the rice and fry for about 1 minute.</li>
              </ol>
            </div>
          </div>
        </div>
      </BaseContainer>
      <Footer>

      </Footer>
    </div>
  )
};

export default Recipe;

import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { LoginGuard } from "../routeProtectors/LoginGuard";
import Login from "../../views/Login";
import Home from "../../views/Home";
import AddRecipe from "../../views/AddRecipe";
import Register from "../../views/Register";
import UserProfile from "../../views/UserProfile";
import EditProfile from "../../views/EditProfile";
import PersonalCookbook from "../../views/PersonalCookbook";
import Recipe from "../../views/Recipe";
import GroupCookbook from "../../views/GroupCookbook";

/**
 * Main router of your application.
 * In the following class, different routes are rendered. In our case, there is a Login Route with matches the path "/login"
 * and another Router that matches the route "/game".
 * The main difference between these two routes is the following:
 * /login renders another component without any sub-route
 * /game renders a Router that contains other sub-routes that render in turn other react components
 * Documentation about routing in React: https://reactrouter.com/en/main/start/tutorial
 */

//RECIPE LINK NEEDS TO BE CHANGED /users/{userID}/cookbooks/{recipeID}*/ 
const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/home" element={<Home />} />

        <Route path="/recipes" element={<AddRecipe />} />

        <Route path="/recipes/recipe" element={<Recipe />} />

        <Route path="/users" element={<Register />} />

        <Route path="/users/login" element={<Login />} />
        {/*<Route path="/users/login" element={<LoginGuard />}>*/}
        {/*  <Route path="/users/login" element={<Login/>} />*/}
        {/*</Route>*/}

        <Route path="/users/profile" element={<UserProfile />} />
        <Route path="/users/profile/edit" element={<EditProfile />} />
        <Route path="/users/cookbooks" element={<PersonalCookbook />} />

        {/*<Route path="/groups/:groupID/cookbooks" element={<GroupCookbook />} />*/}
        <Route path="/groups/cookbooks" element={<GroupCookbook />} />

        <Route path="/" element={
          <Navigate to="/users/login" replace />
        } />

      </Routes>
    </BrowserRouter>
  );
};

/*
* Don't forget to export your component!
 */
export default AppRouter;

import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { LoginGuard } from "../routeProtectors/LoginGuard";
import Login from "../../views/Login";
import AddRecipe from "../../views/AddRecipe";
import Register from "../../views/Register";
import Home from "../../views/Home";
import UserProfile from "../../views/UserProfile";
import EditProfile from "../../views/EditProfile";
import PersonalCookbook from "../../views/PersonalCookbook";
import UserRecipe from "../../views/UserRecipe";
import GroupRecipe from "../../views/GroupRecipe";
import GroupCookbook from "../../views/GroupCookbook";
import AddGroup from "../../views/AddGroup";
import Shoppinglist from "../../views/Shoppinglist";
import Invitations from "../../views/Invitations";
import RecipeEdit from "../../views/EditRecipe";
import Calendar from "../../views/Calendar";
import GroupCalendar from "../../views/GroupCalendar"
import GroupShoppinglist from "../../views/GroupShoppinglist";
import { EditRecipeGuard } from "../routeProtectors/EditRecipeGuard";
import { GroupRecipeGuard } from "../routeProtectors/GroupRecipeGuard";

/**
 * Main router of your application.
 * In the following class, different routes are rendered. In our case, there is a Login Route with matches the path "/login"
 * and another Router that matches the route "/game".
 * The main difference between these two routes is the following:
 * /login renders another component without any sub-route
 * /game renders a Router that contains other sub-routes that render in turn other react components
 * Documentation about routing in React: https://reactrouter.com/en/main/start/tutorial
 */

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/home" element={<Home />} />

        <Route path="/recipes" element={<AddRecipe />} />

        <Route path = "/groups/:group_ID/cookbooks/:recipeID" element = {<GroupRecipeGuard/>}>
          <Route path="/groups/:group_ID/cookbooks/:recipeID" element={<GroupRecipe />} />
        </Route>

        <Route path="/users/:authorID/cookbooks/:recipeID" element={<UserRecipe />} />

        <Route path="/users/:authorID/cookbooks/:recipeID/edit" element={<EditRecipeGuard/>}>
          <Route path="/users/:authorID/cookbooks/:recipeID/edit" element={<RecipeEdit />} />
        </Route>

        <Route path="/users" element={<Register />} />

        <Route path="/users/login" element={<Login />} />
        {/*<Route path="/users/login" element={<LoginGuard />}>*/}
        {/*  <Route path="/users/login" element={<Login/>} />*/}
        {/*</Route>*/}

        <Route path="/users/:userID" element={<UserProfile />} />
        <Route path="/users/:userID/edit" element={<EditProfile />} />
        <Route path="/users/cookbooks" element={<PersonalCookbook />} />
        <Route path="/calendars" element={<Calendar />} />
        <Route path="/users/:userID/shoppinglists" element={<Shoppinglist />} />
        <Route path="/users/:userID/invitations" element={<Invitations />} />

        <Route path="/groups" element={<AddGroup />} />
        <Route path="/groups/:groupID/cookbooks" element={<GroupCookbook />} />
        <Route path="/groups/:groupID/shoppinglists" element={<GroupShoppinglist />} />
        <Route path="/groups/:groupID/calendars" element={<GroupCalendar/>} />

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

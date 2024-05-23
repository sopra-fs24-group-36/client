import React, { useEffect, useState } from "react";
import "../../styles/ui/Header_new.scss";
import { Button } from "components/ui/Button";
import { useNavigate } from "react-router-dom";
import { api } from "helpers/api";
import { Spinner } from "./Spinner";

/**
 * This is an example of a Functional and stateless component (View) in React. Functional components are not classes and thus don't handle internal state changes.
 * Conceptually, components are like JavaScript functions. They accept arbitrary inputs (called “props”) and return React elements describing what should appear on the screen.
 * They are reusable pieces, and think about each piece in isolation.
 * Functional components have to return always something. However, they don't need a "render()" method.
 * https://react.dev/learn/your-first-component and https://react.dev/learn/passing-props-to-a-component
 * @FunctionalComponent
 */

const Header_new = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const userID = localStorage.getItem("userID");

  const doProfile = () => {
    navigate(`/users/${userID}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/users/${userID}`);
        setUser(response.data);
      } catch (error) {
        alert(
          "Something went wrong while fetching the user!",
        );
      }
    };
    fetchData();
  }, [userID]);

  let content: any;
  if (!user) {
    content = <div className="header_new container">Loading...</div>;
  } else {
    content = (
      <div>
        <Button className="header_new userProfile" onClick={doProfile}>
          <img src={user.profilePicture} alt="Profile Picture" className="header_new profileImage" />
          <h2 className="header_new title">{user.username}</h2>
        </Button>
      </div>
    );
  }

  return (
    <div className="header_new container">
      {content}
    </div>
  );
};

export default Header_new;

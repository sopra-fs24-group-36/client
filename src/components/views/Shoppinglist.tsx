import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Shoppinglist.scss";
import PropTypes from "prop-types";
import Dashboard from "components/ui/Dashboard";
import Footer from "components/ui/footer";
import BaseContainer from "components/ui/BaseContainer_new";
import Header_new from "components/ui/Header_new";
import { Spinner } from "../ui/Spinner";

const FormField = (props) => {
  return (
    <div className="shoppinglist field">
      <input
        className="shoppinglist input"
        placeholder="enter here..."
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      />
      <Button className="shoppinglist add" onClick={props.onClick}>
        +
      </Button>
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onClick: PropTypes.func,
};

const Shoppinglist = () => {
  const navigate = useNavigate();
  const { userID } = useParams();
  const [items, set_items] = useState([]);
  const [new_item, set_new_item] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get(`/users/${userID}/shoppinglists`);
        set_items(response.data.items);
        setLoading(false);
      } catch (error) {
        alert("Something went wrong while fetching the items!");
      }
    }

    fetchData();

  }, [userID]);

  const addItem = async () => {
    if (new_item.trim() !== "") { // Make sure the input is not empty
      try {
        const requestBody = JSON.stringify({
          "item": new_item,
        });
        await api.post(`/users/${userID}/shoppinglists`, requestBody);
        set_items([...items, new_item]);
      } catch (error) {
        alert(
          `An error occurred while adding items:  \n${handleError(error)}`,
        );
      }
      set_new_item("");
    }
  };

  const clearAll = async () => {
    set_items([]);
    try {
      await api.delete(`/users/${userID}/shoppinglists`);
    } catch (error) {
      alert("An error occurred while clear all items");
    }
  };

  const ItemField = (props) => {
    const { userID } = useParams();
    const [isChecked, set_isChecked] = useState(false);

    const removeItem = async () => {
      set_isChecked(!isChecked);
      await new Promise((resolve) => setTimeout(resolve, 500));
      const updatedItems = items.filter(item => item !== props.value);
      set_items(updatedItems);
      try {
        const requestBody = JSON.stringify({
          "item": props.value,
        });
        await api.put(`/users/${userID}/shoppinglists`, requestBody);
      } catch (error) {
        alert("An error occurred while remove items");
      }
    };

    return (
      <div className="shoppinglist itemsField">
        <input className="shoppinglist itemsInput" value={props.value} readOnly />
        <Button
          className={`shoppinglist check ${isChecked ? "checked" : ""}`}
          onClick={removeItem}
        >
          {isChecked ? "×" : ""}
        </Button>
      </div>
    );
  };

  ItemField.propTypes = {
    value: PropTypes.string,
  };


  if (loading) {

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
          activePage="shoppinglist"
        />
        <BaseContainer>
          <div className="shoppinglist headerContainer">
            <div className="shoppinglist backButtonContainer">
              <Button
                className="backButton"
                onClick={() => navigate(-1)}
              >Back</Button>
            </div>
            <h2 className="shoppinglist title">Shopping List</h2>
          </div>

          <div className="shoppinglist container">
            <p className="shoppinglist p">Select Items:</p>
            <div className="shoppinglist itemsContainer">
              {items.map((new_item) => (
                <ItemField
                  key={new_item}
                  value={new_item}
                />
              ))}
            </div>

            <div className="shoppinglist addItemContainer">
              <label className="shoppinglist label">
                Add an item to your shopping list:
              </label>
              <FormField
                value={new_item}
                onChange={(rl: string) => set_new_item(rl)}
                onClick={addItem}
              ></FormField>
            </div>

            <Button
              className={"shoppinglist clearAll"}
              onClick={clearAll}
            >
              Clear All
            </Button>
          </div>
        </BaseContainer>
        <Footer></Footer>
      </div>
    );
  }
};

export default Shoppinglist;

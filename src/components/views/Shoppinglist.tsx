import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { Form, useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Shoppinglist.scss";
import PropTypes from "prop-types";
import Dashboard from "components/ui/Dashboard";
import Footer from "components/ui/footer";
import BaseContainer from "components/ui/BaseContainer_new";
import Header_new from "components/views/Header_new";

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

const ItemField = (props) => {
  const [isChecked, set_isChecked] = useState(false);
  const handleCheck = () => {
    set_isChecked(!isChecked);
  };
  
  return (
    <div className="shoppinglist itemsField">
      <input className="shoppinglist itemsInput" value={props.value} readOnly />
      <Button
        className={`shoppinglist check ${isChecked ? "checked" : ""}`}
        onClick={handleCheck}
      >
        {isChecked ? "×" : ""}
      </Button>
    </div>
  );
};

ItemField.propTypes = {
  value: PropTypes.string,
  onRemove: PropTypes.func,
};

const Shoppinglist = () => {
  const navigate = useNavigate();
  const [items, set_items] = useState([]);
  const [new_item, set_new_item] = useState("");

  const addItem = () => {
    if (new_item.trim() !== "") { // Make sure the input is not empty
      set_items([...items, new_item]);
      set_new_item("");
    }
  };

  const removeItem = (index) => {
    const new_item = [...items];
    new_item.splice(index, 1);
    set_items(new_item);
  };

  const clearAll = () => {
    set_items([]);
  };

  /*TODO：Add item to the database
  const saveChanges = async () => {
    try {
      const requestBody = JSON.stringify({
        group_name: group_name,
        group_members: items,
      });
      const response = await api.post("/groups", requestBody);
    } catch (error) {
      console.error("An error occurred while creating groups:", error);
      alert("Creating a group failed because the details were incomplete.");
    }
  };
  */


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
        activePage="shoppinglist"
      />
      <BaseContainer>
        <div className="shoppinglist headerContainer">
          <div className="shoppinglist backButtonContainer">
            <Button
              className="backButton"
              onClick={() => navigate("/home")}
            >Back</Button>
          </div>
          <h2 className="shoppinglist title">Shopping List</h2>
        </div>

        <div className="shoppinglist container">
          <p className="shoppinglist p">Select Items:</p>
          <div className="shoppinglist itemsContainer">
            {items.map((new_item, index) => (
              <ItemField
                key={index}
                value={new_item}
                onRemove={() => removeItem(index)}
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
};

export default Shoppinglist;

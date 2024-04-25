import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { Form, useNavigate, useParams } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Shoppinglist.scss";
import PropTypes from "prop-types";
import Dashboard from "components/ui/Dashboard";
import Footer from "components/ui/footer";
import BaseContainer from "components/ui/BaseContainer_new";
import Header_new from "components/ui/Header_new";

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
  const { groupID } = useParams();
  const [isChecked, set_isChecked] = useState(false);

  const removeItem = async () => {
    set_isChecked(!isChecked);
    try {
      const requestBody = JSON.stringify({
        "item": props.value,
      });
      const response = await api.put(`/groups/${groupID}/shoppinglists`, requestBody);
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

const GroupShoppinglist = () => {
  const navigate = useNavigate();
  const { groupID } = useParams();
  const [groupInfo, setGroupInfo] = useState<any[]>([]);
  const [items, set_items] = useState([]);
  const [new_item, set_new_item] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get(`/groups/${groupID}/shoppinglists`);
        set_items(response.data.items);
      } catch (error) {
        alert("Something went wrong while fetching the items!");
      }
      try {
        const response = await api.get(`/groups/${groupID}`);
        setGroupInfo(response.data);
      } catch (error) {
        alert("Something went wrong while fetching the group");
      }
    }
    fetchData();
    const intervalId = setInterval(fetchData, 1000); // Polling every 1 seconds

    return () => clearInterval(intervalId);
  }, [groupID]);

  const addItem = async () => {
    if (new_item.trim() !== "") { // Make sure the input is not empty
      set_items([...items, new_item]);
      set_new_item("");
      try {
        const requestBody = JSON.stringify({
          "item": new_item,
        });
        const response = await api.post(`/groups/${groupID}/shoppinglists`, requestBody);
      } catch (error) {
        alert("An error occurred while adding items");
      }
    }
  };

  const clearAll = async () => {
    set_items([]);
    try {
      const response = await api.delete(`/groups/${groupID}/shoppinglists`);
    } catch (error) {
      alert("An error occurred while clear all items");
    }
  };


  return (
    <div>
      <Header_new></Header_new>
      <Dashboard
        showButtons={{
          recipe: true,
          groupCalendar: true,
          groupShoppinglist: true,
          invitations: true,
          inviteUser: true,
          leaveGroup: true,
        }}
        activePage="groupShoppinglist"
      />
      <BaseContainer>
        <div className="shoppinglist headerContainer">
          <div className="shoppinglist backButtonContainer">
            <Button
              className="backButton"
              onClick={() => navigate("/home")}
            >Back</Button>
          </div>
          <h2 className="shoppinglist title">{groupInfo.name} - Shopping List</h2>
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
};

export default GroupShoppinglist;

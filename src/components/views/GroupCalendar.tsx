import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "components/ui/Button";
import PropTypes from "prop-types";
import "styles/views/Calendar.scss"
import Recipe from "models/Recipe"
import Dashboard from "components/ui/Dashboard";
import Footer from "components/ui/footer";
import Header_new from "components/ui/Header_new";
import BaseContainer from "../ui/BaseContainer_new";

// @ts-ignore
import search from "../../assets/search.png";
const FormField=(props)=>{
  return(
    <div className="calendar input">
      <input
        className="calendar input"
        placeholder="Search for your recipes..."
        value={props.value}
        onChange={(e)=>props.onChange(e.target.value)}
      />
    </div>
  )
}
FormField.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};


const GroupCalendar=()=>{
  const navigate = useNavigate();
  const { groupID } = useParams();
  const [filterKeyword, setFilterKeyword]=useState<string>(null)
  const [calendar,setCalendar]=useState(null);
  const[allRecipes,setAllRecipes]=useState<Recipe[]>(null);
  const [searchedRecipes,setSearchedRecipes]=useState<Recipe[]>(null);
  const[group,setGroup]=useState([]);

  const [currentWeek,setCurrentWeek]=useState((new Date()));
  const [shouldFetchCalendar, setShouldFetchCalendar] = useState(true);


  const searchRecipe=()=>{
    if(!searchedRecipes){
      setSearchedRecipes(allRecipes);
    }
    const lowerCaseFilterKeyword = filterKeyword.toLowerCase();
    const filtered=allRecipes.filter(recipe=>
      recipe.title.toLowerCase().includes(lowerCaseFilterKeyword)
    );
    setSearchedRecipes(filtered);
  }
  const handlePrevWeek=()=>{
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() - 7); // Subtracts 7 days
    setCurrentWeek(newDate);
  }
  const handleNextWeek=()=>{
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() + 7); // Adds 7 days
    setCurrentWeek(newDate);
  }

  const getDatesOfWeek=(date)=>{
    const result=[];
    const start=new Date(date);
    /*    getDate() returns the date of start(which day of the month is
        getDay() returns the day of the week of 'start', 0 means sunday, 1 means monday
        the following line sets 'start' to the first day of this week(sunday)*/
    start.setDate(start.getDate()-start.getDay());
    for(let i =0;i<7;i++){
      const current=new Date(start);
      current.setDate(current.getDate()+i);
      result.push(current);
    }

    return result;
  }
  const getDayOfWeek=(date)=>{
    const dayOfWeek = new Date(date).getDay();

    return isNaN(dayOfWeek) ? null : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][dayOfWeek].slice(0, 2);
  }
  const formatDate=(date)=>{
    //Display only the month and date of the date, without showing the year.
    const d=new Date(date);

    return isNaN(d.getTime())? null:d.toLocaleDateString("de-CH",{month: "2-digit", day: "2-digit"});
  }
  const formatDateToYYYYMMDD=(date)=>{
    const d = new Date(date);
    const year = d.getFullYear();
    const month = ("0" + (d.getMonth()+1)).slice(-2); // Months are 0 based. Add leading 0.
    const day = ("0" + d.getDate()).slice(-2); // Add leading 0.

    return `${year}-${month}-${day}`;
  }

  const handleDragStart=(e,recipe)=>{
    e.dataTransfer.setData("text/plain",JSON.stringify(recipe));
  }
  const handleDrop=async (e,date,status)=>{
    const recipeString = e.dataTransfer.getData("text/plain");
    const recipe = JSON.parse(recipeString);
    e.preventDefault();

    const requestBody={
      date:date,
      recipeID:recipe.id,
      status:status,
    }

    await api.post(`/groups/${groupID}/calendars`, requestBody)
      .then(()=>{
        setShouldFetchCalendar(true);
      })
      .catch(err => console.error(err));
  }

  const handleRemove= async (eventId)=>{
    try{
      const requestBody = JSON.stringify(eventId);
      await api.delete(`groups/${groupID}/calendars/${eventId}`,requestBody)
      setShouldFetchCalendar(true);
      const updatedCalendar=calendar.filter(event=>!(event.id===eventId))
      setCalendar(updatedCalendar);
    }catch (error){
      console.error(
        `Something went wrong while removing the recipe: \n${handleError(
          error,
        )}`,
      );
      console.error("Details:", error);
      alert(
        "Something went wrong while removing the recipe! See the console for details.",
      );
    }
  };
  const getEventsOfStatus=(calendar,date,status)=>{

    return calendar.filter(event => formatDateToYYYYMMDD(event.date) === formatDateToYYYYMMDD(date) && event.status === status);
  }


  useEffect(()=>{
    async function fetchData(){
      try{
        const responseRecipe=await api.get(`/groups/${groupID}/cookbooks`);
        setAllRecipes(responseRecipe.data);
        setSearchedRecipes(responseRecipe.data);
        const responseCalendar=await api.get(`/groups/${groupID}/calendars`);
        setCalendar(responseCalendar.data)
        const responseGroup=await api.get(`/groups/${groupID}`);
        setGroup(responseGroup.data)
      }catch(error){
        console.error("Details:", error);
        alert(
          "Something went wrong while fetching the data! See the console for details.");
      }finally {
        setShouldFetchCalendar(false);
      }
    }
    if (shouldFetchCalendar) {
      fetchData();
    }
  },[shouldFetchCalendar]);

  return(
    <div>
      <Header_new></Header_new>
      <Dashboard
        showButtons={{
          home: true, 
          cookbook: true, 
          recipe: true,
          groupCalendar: true,
          groupShoppinglist: true,
          invitations: true,
          leaveGroup: true,
        }}
        activePage="groupCalendar"
      />
      <div className="calendar container" >
        {/*group recipes field*/}
        <BaseContainer className="calendar baseContainerLeft">
          <div className="calendar headContainer1">
            <h2 className="calendar title1">{group.name} - Recipes</h2>
          </div>
          <div className="calendar searchContainer">
            <FormField
              value={filterKeyword}
              onChange={(newValue) => setFilterKeyword(newValue)}>
            </FormField>
            <div className="calendar searchButtonContainer">
              <Button
                className="calendar searchButton"
                style={{
                  backgroundSize: "100% 100%",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  backgroundImage: `url(${search})`,
                }}
                onClick={searchRecipe}></Button>
            </div>
          </div>
          <div className="calendar recipeListContainer">
            {searchedRecipes && searchedRecipes.length > 0 ?(searchedRecipes.map((recipe) => (
              <div
                className="calendar recipeContainer"
                key={recipe.id}
                draggable="true"
                onDragStart={e => handleDragStart(e, recipe)}
              >
                <button className="calendar recipeButton">
                  <div className="calendar recipeImgContainer">
                    <img className="calendar recipeImg" src={recipe.image} alt="Recipe Image" />
                  </div>
                  <h2 className="calendar recipeTitle">{recipe.title}</h2>
                </button>
              </div>
            ))):(
              <div className="calendar noRecipeText">no recipes saved yet</div>
            )}
          </div>
        </BaseContainer>
        {/*calendar field*/}
        <BaseContainer className="calendar baseContainerRight">
          <div className="calendar headContainer2">
            <div className="calendar backButtonContainer">
              <Button className="backButton" onClick={() => navigate(-1)}>
                Back
              </Button>
            </div>
            <div className="calendar titleContainer">
              <h2 className="calendar title2">{group.name} - Calendar</h2>
            </div>
          </div>
          <div className="calendar arrowButtonContainer">
            <Button className="calendar arrowButton" onClick={handlePrevWeek}>
              ⬅
            </Button>
            <Button className="calendar arrowButton" onClick={handleNextWeek}>
              ➡
            </Button>
          </div>
          <div className="calendar calendarContainer">
            <div className="calendar calendarForm">
              {getDatesOfWeek(currentWeek).map(date => (
                <div key={date} className="calendar date">
                  {`${getDayOfWeek(date)}.${formatDate(date)}`}
                </div>
              ))}
              {["BREAKFAST","LUNCH","DINNER"].map((status)=>(
                getDatesOfWeek(currentWeek).map(date=>(
                  <div
                    key={date}
                    onDragOver={(e)=>e.preventDefault()}
                    onDrop={(e)=>handleDrop(e,date,status)}
                    className={`calendar status ${status.toLowerCase()}`}
                  >
                    {
                      calendar?.length > 0 && (
                        getEventsOfStatus(calendar, date, status).map(event => (
                          <div className="calendar eventContainer" key={event.id}>
                            <Button
                              className="calendar recipeButtonInCalendar"
                              onClick={() => navigate(`/users/${groupID}/cookbooks/${event.recipeID}`)}>
                              <h3 className="calendar eventTitle">{event.recipeTitle}</h3>
                            </Button>
                            <Button className="calendar removeButton" onClick={() => handleRemove(event.eventId)}>Remove
                            </Button>
                          </div>
                        ))
                      )
                    }
                  </div>
                ))
              ))}
            </div>
          </div>
        </BaseContainer>
        <Footer></Footer>
      </div>
    </div>
  )
}

export default GroupCalendar;
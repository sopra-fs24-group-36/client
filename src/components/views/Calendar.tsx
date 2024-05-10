import React, { useEffect, useRef, useState } from "react";
import { api, handleError } from "helpers/api";
import { useNavigate, useParams } from "react-router-dom";
import ReactDOM from "react-dom";
import { Button } from "components/ui/Button";
import PropTypes from "prop-types";
import "styles/views/Calendar.scss"
import Recipe from "models/Recipe"
import Dashboard from "components/ui/Dashboard";
import Footer from "components/ui/footer";
import Header_new from "components/ui/Header_new";
import BaseContainer from "../ui/BaseContainer_new";
import { Spinner } from "../ui/Spinner";

// @ts-ignore
import search from "../../assets/search.png";
// @ts-ignore
import leftArrow from "../../assets/leftArrow.png"
// @ts-ignore
import rightArrow from "../../assets/rightArrow.png"


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


const ReplaceModal = ({ show, message, onClose }) => {
  const [isVisible,setIsVisible]=useState(show);
  useEffect(()=>{
    console.log("Modal visibility state changed: ", show);
    if(show){
      setIsVisible(true);
      const timer=setTimeout(()=>{
        setIsVisible(false);
        setTimeout(onClose,500);
      },1000);

      return()=>clearTimeout(timer);
    }
  }, [show, onClose])

  return isVisible?ReactDOM.createPortal(
    <div className="calendar modal-backdrop">
      <div className="calendar modal-content">
        {message}
      </div>
    </div>,
    document.body
  ):null;
}
ReplaceModal.propTypes = {
  show: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

const Calendar = () =>{
  const navigate = useNavigate();
  const userID = localStorage.getItem("userID"); /*getting the ID of the currently logged in user*/
  const [filterKeyword, setFilterKeyword]=useState<string>(null)
  const [calendar,setCalendar]=useState(null);
  const[allRecipes,setAllRecipes]=useState<Recipe[]>(null);
  const [searchedRecipes,setSearchedRecipes]=useState<Recipe[]>(null);

  const [currentWeek,setCurrentWeek]=useState((new Date()));
  const [shouldFetchCalendar, setShouldFetchCalendar] = useState(true);

  const [showReplaceModal, setShowReplaceModal] = useState(false);
  const [loading, setLoading] = useState(true);

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

    const preview=document.getElementById("drag-preview");
    const image = document.getElementById("preview-image") as HTMLImageElement;
    const title=document.getElementById("preview-title");

    image.src=recipe.image;
    title.textContent=recipe.title;

    preview.style.display="block";
    e.dataTransfer.setDragImage(preview,50,50);

    setTimeout(()=>preview.style.display="none",0);


  }

  const hasRecipeInSlot=(date,status)=>{
    const formattedDate=formatDateToYYYYMMDD(date);

    return calendar.some(event=>formatDateToYYYYMMDD(new Date(event.date)) === formattedDate && event.status === status);
  }
  const handleDrop=async (e,date,status)=>{
    const recipeString = e.dataTransfer.getData("text/plain");
    const recipe = JSON.parse(recipeString);
    e.preventDefault();

    if(hasRecipeInSlot(date,status)){
      const existingEvent=getEventsOfStatus(calendar,date,status)[0];
      const requestBody1 = JSON.stringify(existingEvent.eventId);
      await api.delete(`/users/${userID}/calendars/${existingEvent.eventId}`,requestBody1);
      setShowReplaceModal(true);
    }
    const requestBody2={
      date:date,
      recipeID:recipe.id,
      status:status,
    }
    await api.post(`/users/${userID}/calendars`, requestBody2)
      .then(()=>{
        setShouldFetchCalendar(true);
      })
      .catch(err => console.error(err));
  }

  const handleRemove= async (eventId,date,status)=>{
    try{
      const requestBody = JSON.stringify(eventId);
      await api.delete(`/users/${userID}/calendars/${eventId}`,requestBody);
      setShouldFetchCalendar(true);
      const updatedCalendar=calendar.filter(event=>!(event.date === date && event.status === status))
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
      );    }
  };
  const getEventsOfStatus=(calendar,date,status)=>{
    return calendar.filter(event => formatDateToYYYYMMDD(event.date) === formatDateToYYYYMMDD(date) && event.status === status);
  }


  useEffect(()=>{
    async function fetchData(){
      try{
        const responseRecipe=await api.get(`/users/${userID}/cookbooks`);
        setAllRecipes(responseRecipe.data);
        setSearchedRecipes(responseRecipe.data);

        const responseCalendar=await api.get(`/users/${userID}/calendars`);
        setCalendar(responseCalendar.data);
        setLoading(false);
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
  if (loading) {

    return <Spinner />;
  }else{
    return(
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
          activePage="calendar"
        />
        <div className="calendar container">
          {/*your recipes field*/}
          <BaseContainer className="calendar baseContainerLeft">
            <div className="calendar headContainer1">
              <h2 className="calendar title1">Your Recipes</h2>
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
                    backgroundSize: "80% 80%",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    backgroundImage: `url(${search})`,
                  }}
                  onClick={searchRecipe}></Button>
              </div>
            </div>
            <div className="calendar recipeListContainer">
              {searchedRecipes && searchedRecipes.length > 0 ? (searchedRecipes.map((recipe) => (
                <div className="calendar recipeContainer" key={recipe.id}>
                  <button
                    className="calendar recipeButton"
                    draggable="true"
                    onDragStart={e => handleDragStart(e, recipe)}
                  >
                    <div className="calendar recipeImgContainer">
                      <img className="calendar recipeImg" src={recipe.image} alt="Recipe Image" />
                    </div>
                    <h2 className="calendar recipeTitle">{recipe.title}</h2>
                  </button>
                  <div id="drag-preview" className="calendar dragPreview">
                    <img id="preview-image" src="" alt="Recipe Preview" className="calendar dragPreviewImg" />
                    <h3 id="preview-title" className="calendar dragPreviewTitle"></h3>
                  </div>
                </div>
              ))) : (
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
                <h2 className="calendar title2">Your Calendar</h2>
              </div>
            </div>
            <div className="calendar arrowButtonContainer">
              <Button
                className="calendar arrowButton"
                style={{
                  backgroundSize: "80% 80%",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  backgroundImage: `url(${leftArrow})`,
                }}
                onClick={handlePrevWeek}>
              </Button>
              <Button
                className="calendar arrowButton"
                style={{
                  backgroundSize: "80% 80%",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  backgroundImage: `url(${rightArrow})`,
                }}
                onClick={handleNextWeek}>
              </Button>
            </div>
            <div className="calendar calendarContainer">
              <div className="calendar calendarForm">
                {getDatesOfWeek(currentWeek).map(date => (
                  <div key={date} className="calendar date">
                    {`${getDayOfWeek(date)}.${formatDate(date)}`}
                  </div>
                ))}
                {["BREAKFAST", "LUNCH", "DINNER"].map((status) => (
                  getDatesOfWeek(currentWeek).map(date => (
                    <div
                      key={date}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => handleDrop(e, date, status)}
                      className={`calendar status ${status.toLowerCase()}`}
                    >
                      {
                        calendar?.length > 0 && (
                          getEventsOfStatus(calendar, date, status).map(event => (
                            <div className="calendar eventContainer" key={event.id}>
                              <Button
                                className="calendar recipeButtonrInCalendar"
                                onClick={() => navigate(`/users/${userID}/cookbooks/${event.recipeID}`)}>
                                <div className="calendar eventTitle">{event.recipeTitle}</div>
                              </Button>
                              <Button className="calendar removeButton" onClick={() => handleRemove(event.eventId, date, status)}>Remove
                              </Button>
                            </div>
                          ))
                        )
                      }
                    </div>
                  ))
                ))}
              </div>
              {showReplaceModal &&
                <ReplaceModal
                  show={showReplaceModal}
                  message="New recipe set."
                  onClose={() => setShowReplaceModal(false)}
                />
              }
            </div>
          </BaseContainer>
          <Footer></Footer>
        </div>
      </div>
    )
  }
}

export default Calendar;
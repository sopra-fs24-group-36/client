import React, { useEffect, useState } from "react";
import { Form, useNavigate, useParams } from "react-router-dom";
import { api, handleError } from "helpers/api";
import { Button } from "components/ui/Button";
import PropTypes from "prop-types";
import "styles/views/Calendar.scss"
import User from "models/User";
import Recipe from "models/Recipe"
import Dashboard from "components/ui/Dashboard";
import Footer from "components/ui/footer";
import Header_new from "components/views/Header_new";
import BaseContainer from "../ui/BaseContainer_new";

// @ts-ignore
import search from "../../assets/search.png";
// @ts-ignore
import defaultRecipe1 from "../../assets/defaultRecipe1.png";
// @ts-ignore
import defaultRecipe2 from "../../assets/defaultRecipe2.png";
// @ts-ignore
import defaultRecipe3 from "../../assets/defaultRecipe3.png";
// @ts-ignore
import defaultRecipe4 from "../../assets/defaultRecipe4.png";
// @ts-ignore
import defaultRecipe1UserImg from "../../assets/defaultRecipe1UserImg.png"
// @ts-ignore
import defaultRecipe2UserImg from "../../assets/defaultRecipe2UserImg.png"
// @ts-ignore
import defaultRecipe3UserImg from "../../assets/defaultRecipe3UserImg.png"
// @ts-ignore
import defaultRecipe4UserImg from "../../assets/defaultRecipe4UserImg.png"
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
  placeholder: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

const defaultRecipes=[
  {
    title: "Breakfast burritos",
    image:defaultRecipe1,
    creator:defaultRecipe1UserImg,
    id:1,
  },
  {
    title:'Quick fried rice',
    image:defaultRecipe2,
    creator:defaultRecipe2UserImg,
    id:2,
  },
  {
    title:'Spring onion soup',
    image:defaultRecipe3,
    creator:defaultRecipe3UserImg,
    id:3,
  },
  {
    title:'Pork medallions',
    image:defaultRecipe4,
    creator:defaultRecipe4UserImg,
    id:4,
  }
]

const defaultCalendar=[
  {
    id: 1,
    recipeId:1,
    title: "Breakfast burritos",
    date: "2024-4-29",
    image: "defaultRecipe1",
    timeSlot: "Morning",
    creator:defaultRecipe1UserImg,
  },
  {
    id: 2,
    recipeId:2,
    title: "Quick fried rice",
    date: "2024-4-21",
    image: "defaultRecipe2",
    timeSlot: "Morning",
    creator:defaultRecipe1UserImg,
  },
  {
    id: 3,
    recipeId:3,
    title: "Spring onion soup",
    date: "2024-4-22",
    image: "defaultRecipe2",
    timeSlot: "Afternoon",
    creator:defaultRecipe1UserImg,
  },
  {
    id: 4,
    recipeId:4,
    title: "Pork medallions",
    date: "2024-4-23",
    image: "3",
    timeSlot: "Evening",
    creator:defaultRecipe1UserImg,
  },
]
const GroupCalendar=()=>{
  const navigate = useNavigate();
  const {groupId} = useParams();
  const [filterKeyword, setFilterKeyword]=useState<string>(null)
  //TODO:replace defaultCalendar with null when connecting with backend
  const [calendar,setCalendar]=useState(defaultCalendar);
  const[allRecipes,setAllRecipes]=useState<Recipe[]>(defaultRecipes);
  const [searchedRecipes,setSearchedRecipes]=useState<Recipe[]>(defaultRecipes);


  const [currentWeek,setCurrentWeek]=useState((new Date()));
  const [shouldFetchCalendar, setShouldFetchCalendar] = useState(false);

  //for testing
  const [draggedRecipe, setDraggedRecipe] = useState(null);

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
    return isNaN(dayOfWeek) ? null : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dayOfWeek].slice(0, 2);
  }
  const formatDate=(date)=>{
    //Display only the month and date of the date, without showing the year.
    const d=new Date(date);
    return isNaN(d.getTime())? null:d.toLocaleDateString('de-CH',{month: '2-digit', day: '2-digit'});
  }
  const formatDateToYYYYMMDD=(date)=>{
    const d = new Date(date);
    const year = d.getFullYear();
    const month = ('0' + (d.getMonth()+1)).slice(-2); // Months are 0 based. Add leading 0.
    const day = ('0' + d.getDate()).slice(-2); // Add leading 0.
    return `${year}-${month}-${day}`;
  }

  //TODO: handleDragStart+handleDrop
  /*const handleDragStart=(e,recipe)=>{
    e.dataTransfer.setData('text/plain',JSON.stringify(recipe));
  }
  const handleDrop=async (e,date,timeSlot)=>{
    const recipeString = e.dataTransfer.getData('text/plain');
    const recipe = JSON.parse(recipeString);
    e.preventDefault();

    const requestBody={
      recipeId:recipe.recipeId,
      date:date,
      timeSlot:timeSlot,
    }

    await api.post(`/users/${groupId}/calendars/${recipe.id}`, requestBody)
      .then(()=>{
        setShouldFetchCalendar(true);
      })
        /!*setCalendar(preCalendar=>{
          const updatedCalendar=[...preCalendar];
          updatedCalendar.push({id:recipe.id,title:recipe.title,image:recipe.image,creator:recipe.creator,date,timeSlot});
          return updatedCalendar;
        })
      )*!/
      .catch(err => console.error(err));
  }
  */
  const handleDragStart = (e, recipe) => {
    setDraggedRecipe(recipe);
  };
  const handleDrop = (e, date, timeSlot) => {
    e.preventDefault();

    if (draggedRecipe) {
      const newEvent = {
        id: calendar.length + 1,
        recipeId:draggedRecipe.id,
        title: draggedRecipe.title,
        date,
        image: draggedRecipe.image,
        timeSlot,
        creator: draggedRecipe.creator,
      };
      setCalendar(prevCalendar => {
        return [...prevCalendar, newEvent];
      });
      setDraggedRecipe(null);
    }
  };

  const handleRemove= async (eventId)=>{
    try{
      //TODO:add the following line
      /*await api.delete(`groups/${groupId}/calendars/${eventId}`)
      setShouldFetchCalendar(true);*/
      const updatedCalendar=calendar.filter(event=>!(event.id===eventId))
      setCalendar(updatedCalendar);
    }catch (error){}
    console.error("Error removing event:", Error);
  };
  const getEventsOfTimeSlot=(calendar,date,timeSlot)=>{
    return calendar.filter(event => formatDateToYYYYMMDD(event.date) === formatDateToYYYYMMDD(date) && event.timeSlot === timeSlot);
  }


  useEffect(()=>{
    async function fetchData(){
      try{
        //TODO:add the fetchData func when connecting with backend
        /*const responseRecipe=await api.get(`/groups/${groupId}/cookbooks`);
        setAllRecipes(responseRecipe.data);
        setSearchedRecipes(responseRecipe.data);
        const responseCalendar=await api.get(`/groups/${groupId}/calendars`);
        setCalendar(responseCalendar.data)*/
        setAllRecipes(defaultRecipes);
        setSearchedRecipes(defaultRecipes);
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
          recipe: true,
          group: true,
          groupCalendar: true,
          groupShoppinglist: true,
        }}
        activePage="calendar"
      />
      <div className="calendar container" >
        {/*group recipes field*/}
        <BaseContainer className="calendar baseContainerLeft">
          <div className="calendar headContainer1">
{/*
            TODO:to get the group name
            <h2 className="calendar title1"></h2>
*/}
            <h2 className="calendar title1">Carrot Crew - Recipes</h2>
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
            {/*TODO: display the recipes in database
recipes.map...*/}
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
              <div>No recipes found.</div>
            )}
          </div>
        </BaseContainer>
        {/*calendar field*/}
        <BaseContainer className="calendar baseContainerRight">
          <div className="calendar headContainer2">
            <div className="calendar backButtonContainer">
              <Button className="backButton" onClick={() => navigate(`/home`)}>
                Back
              </Button>
            </div>
            <div className="calendar titleContainer">
{/*              TODO: to get the group name
              <h2 className="calendar title2"></h2>*/}
              <h2 className="calendar title2">Carrot Crew-Calendar</h2>
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
              {['Morning','Afternoon','Evening'].map((timeSlot,index)=>(
                getDatesOfWeek(currentWeek).map(date=>(
                  <div
                    key={date}
                    onDragOver={(e)=>e.preventDefault()}
                    onDrop={(e)=>handleDrop(e,date,timeSlot)}
                    className={`calendar timeSlot ${timeSlot.toLowerCase()}`}
                  >
                    {getEventsOfTimeSlot(calendar, date, timeSlot).map(event => (
                      <div className="calendar eventContainer"
                           key={event.id}>
                        <div className="calendar eventTitleContainer">
                          <h3 className="calendar eventTitle">{event.title}</h3>
                        </div>
                        <div className="calendar creatorImgContainer">
                          <img className="calendar creatorImg" src={event.creator} alt="Creator Image" />
                        </div>
                        <Button
                          className="calendar removeButton2"
                          onClick={() => handleRemove(event.id)}>Remove</Button>
                        {/*TODO:ADD THE FOLLOWING
                          onClick={() => handleRemove(event.id,date,timeSlot)}>Remove</Button>*/}
                      </div>
                    ))}
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
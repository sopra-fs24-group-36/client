# 🥦 Virtual Cookbook 🥦
Save recipes, find inspiration and plan for future meals. Your cooking dilemmas solved with the virtual cookbook. 
The backend implementation can be found [here](https://github.com/sopra-fs24-group-36/server). 

## 🥦 Table of contents 
1. [Introduction](#introduction) 
2. [Technologies](#technologies)
3. [High-level components](#high-level-components)
4. [Launch and Deployment](#launch-and-deployment)
5. [Illustrations](#illustrations)
6. [Roadmap](#roadmap)
7. [Authors](#authors)
8. [Acknowledgements](#acknowledgements)
9. [License](#license)

## 🥦 Introduction
We are confronted with one of life's most difficult decisions every day, what to eat? Living alone we quickly run out of inspiration. Living with friends or family leads to discussions and disagreements on what to eat. Often we receive a recipe recommendation, but that gets lost or forgotten. Often we turn to the internet for inspiration, but how do we navigate the endless information? 

With the virtual cookbook these problems are solved. Save your personal recipes to a personal cookbook. Create groups with whoever you live with and add recipes to the group cookbook. Use the calendar for meal planning and the shopping list to keep track of items you need. And if you ever run out of inspiration, the built in search-function helps you find new recipes which can directly be saved. 

## 🥦 Technologies 
The following technologies were used for front-end development: 
- [TypeScript](https://www.typescriptlang.org/): programming language used 
- [CSS](https://sass-lang.com/): for styling
- [React](https://react.dev/) 
- [Edamam recipe search API](https://developer.edamam.com/edamam-recipe-api) to search for recipes. 
- [SonarCloud](https://www.sonarsource.com/products/sonarcloud/): code review 

## 🥦 High-level components 

### Home page
Upon successful login or registration the user is redirected to the home page. Here the user can see the recipes they have created and the groups they are a part of. The dashboard facilitates the navigation to the most important pages of the application. 

### Add recipe 
Recipes can be added on the [add recipe page](https://github.com/sopra-fs24-group-36/client/blob/main/src/components/views/AddRecipe.tsx) and are saved to the server with a REST POST request. A recipe can either be added through a link to an external webpage or by manually entering the instructions and ingredients. There is also the option to add a maximum of three tags to a recipe. If the user is part of a group, the group can be selected to add the recipe to the corresponding group cookbook. Recipes will automatically be saved to the personal cookbook. Upon saving a recipe it is displayed, comments and ratings can be left for recipes and there is  the option to [edit the recipe's](https://github.com/sopra-fs24-group-36/client/blob/main/src/components/views/EditRecipe.tsx) details. 

### Cookbooks 
Each user has a [personal cookbook](https://github.com/sopra-fs24-group-36/client/blob/main/src/components/views/PersonalCookbook.tsx) and each group has a [group cookbook](https://github.com/sopra-fs24-group-36/client/blob/main/src/components/views/GroupCookbook.tsx). Every recipe a user creates, will automatically be saved to their personal cookbook. Recipes can optionally be added to group cookbooks. The recipes in a cookbook are retrieved from the server using a REST GET request and are displayed with an image, title, description and cooking time. Group cookbook recipes also show the author of the recipe by displaying their profile picture. Upon clicking on a recipe a REST GET request is performed and the user is redirected to that recipe's page where the full details are displayed. 

### Recipe Search 
The [footer](https://github.com/sopra-fs24-group-36/client/blob/main/src/components/ui/footer.tsx) is displayed on every page and consists of a search bar to look up external recipes using the [Edamam recipe search API](https://developer.edamam.com/edamam-recipe-api). Upon entering a search term 24 results are fetched from the API and displayed at the bottom of the page. The user can view the recipes through the external link or can save them. When saving an Edamam recipe, the user is redirected to the add recipe page where they can add any additional details desired. 

### Calendar 
A calendar is present for the [user](https://github.com/sopra-fs24-group-36/client/blob/main/src/components/views/Calendar.tsx) and for each [group](https://github.com/sopra-fs24-group-36/client/blob/main/src/components/views/GroupCalendar.tsx). All recipes saved to the corresponding cookbook can be searched and inserted into the calendar for either breakfast, lunch or dinner. In group cookbooks the calendar represents a real-time interaction feature using polling to show recipes added to the calendar by other group members in real time. 

### Shopping List
User's have their own [shopping list](https://github.com/sopra-fs24-group-36/client/blob/main/src/components/views/Shoppinglist.tsx) and each group has a [group shopping list](https://github.com/sopra-fs24-group-36/client/blob/main/src/components/views/GroupShoppinglist.tsx). Here items that need purchasing can be added. If an item has been bought, it can be crossed off. Items that have been purchased can then also be removed from the shopping list. Polling is also used here for the group shopping list so each group member can access the shopping list's status in real time. 

## 🥦 Launch and Deployment 

### Prerequisites 
[Node.js](https://nodejs.org/en) is needed for your local development environment. It can be downloaded [here](https://nodejs.org/en/download).
To install all other dependencies, including React, this command should be run before you start the application for the first time: 

```npm install```

### Running the project locally 
The application can be started locally using: 

```npm run dev```

To view the application in the browser [http://localhost:3000](http://localhost:3000) can be opened. We recommend using a Chrome-based browser to use this application. 

### Testing 
Tests can be run with the command: 

```npm run test```

> For macOS user running into a 'fsevents' error: https://github.com/jest-community/vscode-jest/issues/423

### Build 
To build the app, use the command: 

```npm run build```

### Deployment 
The application will automatically be deployed to the Google App Engine when code is pushed to the main branch. 

### External Dependencies 
The client and the [server](https://github.com/sopra-fs24-group-36/server) applications both have to be running for the application to function. Note that the external Edamam Recipe Search API and the database will not be accessible when developing locally due to protection of secrets. 

### Contributions 
Contributions are very welcome but please contact the authors before contributing to this project. Make sure that the added features run successfully and function as intended on your local machine and test thouroughly before creating a pull request to the main repository. 

### Releases 
???

## 🥦 Illustrations 

## 🥦 Roadmap 
- *AI extension*: add an AI feature which allows recipe images to optionally be created by AI

## 🥦 Authors
- [Marko Cerkez](https://github.com/markocerkez) - server
- [Jasmine Rose Chapman](https://github.com/jazzyywazzyy) - client
- [Sarina Alessandra Gmünder](https://github.com/markocerkez) - server
- [Yujie Han](https://github.com/JadeHan1127) - client
- [Xiaying Ji](https://github.com/shalynjjj) - client

## 🥦 Acknowledgements 
Many thanks to our teaching assistant [Marion Andermatt](https://github.com/marion-an) for her help, support and guidance during this project. 

## 🥦 License




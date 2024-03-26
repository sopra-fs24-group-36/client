import React from "react";
import Header from "./components/views/Header";
import AppRouter from "./components/routing/routers/AppRouter";
import Header_new from "./components/views/Header_new"  

/**
 * Happy coding!
 * React Template by Lucas Pelloni
 * Overhauled by Kyrill Hux
 * Updated by Marco Leder
 */
const App = () => {
  return (
    <div>
      <Header height="100" />
      <Header_new />
      <AppRouter />
    </div>
  );
};

export default App;

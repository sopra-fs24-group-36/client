import React from "react";
import AppRouter from "./components/routing/routers/AppRouter";

/**
 * Happy coding!
 * React Template by Lucas Pelloni
 * Overhauled by Kyrill Hux
 * Updated by Marco Leder
 */
const App = () => {
  return (
    <div>
      <AppRouter />
      <div id="portal-invite-user"></div>
    </div>
  );
};

export default App;

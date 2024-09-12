import React from "react";
import { useRoutes } from "react-router-dom";
import router from "./router";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <>
      {useRoutes(router)}
      <Toaster position="top right" />
    </>
  );
};

export default App;

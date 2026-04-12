import React from "react";
import SignUp from "./components/SignUp";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./components/Login";
import MainLayout from "./components/MainLayout";
import Profile from "./components/Profile";
import Home from "./components/Home";

const App = () => {
  const browserRouter = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        {
          path: "home",
          element: <Home />,
        },
        {
          path: "profile",
          element: <Profile />,
        },
      ],
    },
    {
      path: "signup",
      element: <SignUp />,
    },
    {
      path: "login",
      element: <Login />,
    },
  ]);
  return (
    <div>
      <RouterProvider router={browserRouter} />
    </div>
  );
};

export default App;

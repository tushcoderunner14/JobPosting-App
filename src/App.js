import React from "react";
import Dashboard from "./pages/Dashboard";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Candidates from "./pages/Candidates";
import Assessment from "./pages/Assessment";
import JobApplication from "./pages/JobApplication";
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Dashboard />
    },
    {
      path: "/candidates/:jobId",
      element: < Candidates />
    },
    {
      path: "/assessment/:jobId",
      element: < Assessment />
    },
    {
      path: "/jobapp",
      element: < JobApplication />
    },
  ])
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./screens/Register.js";
import Login from "./screens/Login.js";
import PublicMoviesList from "./screens/PublicMoviesList.js"
import UserProvider from "./context/UserProvider.js"

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <Routes>
          <Route path="/" element={<PublicMoviesList/>}></Route>
          <Route path="/signup" element={<Register/>}></Route>
          <Route path="/login" element={<Login/>}></Route>
        </Routes>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

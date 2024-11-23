import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./screens/Register.js";
import Login from "./screens/Login.js";
import PublicMoviesList from "./screens/PublicMoviesList.js"
import FavoriteMoviesList from "./screens/FavoriteMoviesList.js"
import GroupsPage from "./screens/GroupsPage.js"
import Profile from "./screens/Profile.js"
import FinnkinoShowtimes from "./screens/FinnkinoShowtimes.js"
import UserProvider from "./context/UserProvider.js"
import ProtectedRoute from "./components/ProtectedRoute.js"

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <Routes>
          <Route path="/" element={<PublicMoviesList/>}></Route>
          <Route path="/signup" element={<Register/>}></Route>
          <Route path="/login" element={<Login/>}></Route>
          <Route path="/finnkinoshowtimes" element={<FinnkinoShowtimes/>}></Route>
          <Route element={<ProtectedRoute/>}>
            <Route path="/favoritemovieslist" element={<FavoriteMoviesList/>}></Route>
            <Route path="/groupspage" element={<GroupsPage/>}></Route>
            <Route path="/profile" element={<Profile/>}></Route>
          </Route>
        </Routes>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

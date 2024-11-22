import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { UserContext } from "../context/UserContext";

export default function ProtectedRoute() {
    const { user } = useContext(UserContext)
    return user && user.token ? <Outlet/> : <Navigate to="/login"/>
}

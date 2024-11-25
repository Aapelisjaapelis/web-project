import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../context/useUser";

export default function ProtectedRoute() {
    const { user } = useUser()
    return user.token ? <Outlet/> : <Navigate to="/login"/>     // Redirect to login page if the user does not have a token
}

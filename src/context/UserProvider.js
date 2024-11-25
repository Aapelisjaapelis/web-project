import { useState } from "react";
import { UserContext } from "./UserContext";
import axios from "axios";

const url = process.env.REACT_APP_API_URL

export default function UserProvider({children}) {
    const userFromSessionStorage = sessionStorage.getItem("user")
    const [user, setUser] = useState(userFromSessionStorage ? JSON.parse(userFromSessionStorage) : ({id: "", username: "", email: "", password: "", token: ""}))

    const signUp = async () => {
        try {
          await axios.post(url + "/user/register", user)    // The "user" includes username, email and password
          setUser({username: "", email: "", password: ""})  // Clear username, email and password after a successful registration
        } catch(error) {
            throw error
        }
    }

    const signIn = async () => {
        try {
            const response = await axios.post(url + "/user/login", user)    // The "user" includes email and password
            setUser(response.data)                                          // The "response.data" includes id, username, email and token
            sessionStorage.setItem("user", JSON.stringify(response.data))   // Data (id, username, email and token) is stored into session storage
        } catch(error) {
            setUser({email: "", password: ""})                              // Clear email and password after a failed login
            throw error
        }
    }

    const signOut = () => {
        sessionStorage.removeItem("user")                                           // Remove user from session storage
        setUser({id: "", username: "", email: "", password: "", token: ""})         // Clear everything
    }

    return (
        <UserContext.Provider value={{user, setUser, signUp, signIn, signOut}}>
            {children}
        </UserContext.Provider>
    )
}

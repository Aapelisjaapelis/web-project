import { useState } from "react";
import { UserContext } from "./UserContext";
import axios from "axios";

const url = process.env.REACT_APP_API_URL

export default function UserProvider({children}) {
    const userFromSessionStorage = sessionStorage.getItem("user")
    const [user, setUser] = useState(userFromSessionStorage ? JSON.parse(userFromSessionStorage) : ({id: "", username: "", email: "", password: "", token: "", oldPassword: ""}))

    const signUp = async () => {
        try {
          await axios.post(url + "/user/register", user)
          setUser({username: "", email: "", password: ""})
        } catch(error) {
            throw error
        }
    }

    const signIn = async () => {
        try {
            const response = await axios.post(url + "/user/login", user)
            setUser(response.data)
            sessionStorage.setItem("user", JSON.stringify(response.data))
        } catch(error) {
            setUser({email: "", password: ""})
            throw error
        }
    }

    const signOut = () => {
        sessionStorage.removeItem("user")
        setUser({id: "", username: "", email: "", password: "", token: ""})
    }

    const changePassword = async () => {
        try {
            const response = await axios.post(url + "/user/changePassword", user)
            setUser(response.data)
            sessionStorage.setItem("user", JSON.stringify(response.data))
        } catch(error) {
            setUser({password: "", oldPassword: ""})
            throw error
        }
    }

    return (
        <UserContext.Provider value={{user, setUser, signUp, signIn, signOut, changePassword}}>
            {children}
        </UserContext.Provider>
    )
}

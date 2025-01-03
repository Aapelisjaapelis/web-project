import { useState } from "react"
import { UserContext } from "./UserContext"
import axios from "axios"

const url = process.env.REACT_APP_API_URL

export default function UserProvider({children}) {
    const userFromSessionStorage = sessionStorage.getItem("user")
    const [user, setUser] = useState(userFromSessionStorage ? JSON.parse(userFromSessionStorage) : ({id: "", username: "", email: "", password: "", access_token: "", oldPassword: ""}))

    const signUp = async () => {
        try {
          await axios.post(url + "/user/register", user)        // The "user" includes username, email and password
          setUser({username: "", email: "", password: ""})      // Clear username, email and password after a successful registration
        } catch(error) {
            throw error
        }
    }

    const signIn = async () => {
        try {
            const response = await axios.post(url + "/user/login", user)                                                                       // The "user" includes email and password
            const token = readAuthorizationHeader(response)
            const userData = { id: response.data.id, username: response.data.username, email: response.data.email, access_token: token}
            setUser(userData)
            sessionStorage.setItem("user", JSON.stringify(userData))                                                                          // Data (id, username, email and token) is stored into session storage
        } catch(error) {
            setUser({email: "", password: ""})                                                                                                  // Clear email and password after a failed login
            throw error
        }
    }

    const updateToken = (response) => {
        const token = readAuthorizationHeader(response)
        const newUser = {...user, access_token: token}
        setUser(newUser)
        sessionStorage.setItem("user", JSON.stringify(newUser))
    }

    const readAuthorizationHeader = (response) => {
        if (response.headers.get("authorization") &&
            response.headers.get("authorization").split(" ")[0] === "Bearer") {
            return response.headers.get("authorization").split(" ")[1]
        }
    }

    const signOut = () => {
        sessionStorage.clear()                                                          // Clear everything
        setUser({id: "", username: "", email: "", password: "", access_token: ""})
    }

    const changePassword = async () => {
        try {
            const headers = {headers: {Authorization: "Bearer " + user.access_token}}
            const response = await axios.post(url + "/user/changePassword", user, headers)
            updateToken(response)
        } catch(error) {
            setUser({...user, password: "", oldPassword: ""})
            throw error
        }
    }

    const changeEmail = async () => {
        try {
            const headers = {headers: {Authorization: "Bearer " + user.access_token}}
            const response = await axios.post(url + "/user/changeEmail", user, headers)
            const userData = {...user, email: response.data.email}
            setUser(userData)
            updateToken(response)
        } catch(error) {
            throw error
        }
    }

    const deleteAccount = async () => {

        const headers = {headers: {Authorization: "Bearer " + user.access_token}}
        const response = await axios.delete(url + "/user/profile/" + user.id, headers)
        alert(response.data.message)
        sessionStorage.clear()
        setUser({id: "", username: "", email: "", password: "", access_token: ""})
    }

    return (
        <UserContext.Provider value={{user, setUser, signUp, signIn, signOut, changePassword, changeEmail, deleteAccount, updateToken}}>
            {children}
        </UserContext.Provider>
    )
}
import { useState } from "react";
import { UserContext } from "./UserContext";
import axios from "axios";

const url = process.env.REACT_APP_API_URL

export default function UserProvider({children}) {
    const [user, setUser] = useState({username: "", email: "", password: ""})

    const signUp = async () => {
        const headers = {headers: {"Content-Type": "application/json"}}

        try {
          await axios.post(url + "/user/register", user, headers)
          setUser({username: "", email: "", password: ""})
        } catch(error) {
            throw error
        }
    }

    return (
        <UserContext.Provider value={{user, setUser, signUp,}}>
            {children}
        </UserContext.Provider>
    )
}

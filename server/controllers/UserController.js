import { hash } from "bcrypt"
import validator from "validator"
import { createUser, selectUserByEmail, selectUserByUsername } from "../models/user.js"

const userRegistration = async(req,res,next) => {
    try {
        const usernameFromDb = await selectUserByUsername(req.body.username)
        const emailFromDb = await selectUserByEmail(req.body.email)

        if (!req.body.username || req.body.username.length === 0) {
            const error = new Error("Invalid username")
            error.statusCode = 400
            return next(error)
        }

        else if (usernameFromDb.rowCount != 0) {
            const error = new Error("Username already in use")
            error.statusCode = 400
            return next(error)
        }

        else if (emailFromDb.rowCount != 0) {
            const error = new Error("Email already in use")
            error.statusCode = 400
            return next(error)
        }

        else if (!req.body.email || req.body.email.length === 0 || !validator.isEmail(req.body.email)) {
            const error = new Error("Invalid email")
            error.statusCode = 400
            return next(error)
        }

        else if (!req.body.password || req.body.password.length === 0) {
            const error = new Error("Invalid password")
            error.statusCode = 400
            return next(error)
        }
        
        const hashedPassword = await hash(req.body.password, 10)
        await createUser(req.body.username, req.body.email, hashedPassword)
        return res.status(201).json({message: "User created"})
    }   catch (error) {
        return next(error)
    }
}

export { userRegistration }

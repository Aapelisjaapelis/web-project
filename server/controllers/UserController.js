import { hash, compare } from "bcrypt"
import validator from "validator"
import { createUser, selectUserByEmail, selectUserByUsername } from "../models/user.js"
import jwt from "jsonwebtoken"
import passwordValidator from "password-validator"

const userRegistration = async(req, res, next) => {
    try {
        const usernameFromDb = await selectUserByUsername(req.body.username)
        const emailFromDb = await selectUserByEmail(req.body.email)
        const schema = new passwordValidator();
        schema.is().min(8).has().uppercase().has().digits()

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

        else if (!req.body.password || !schema.validate(req.body.password)) {
            const error = new Error("Invalid password")
            error.statusCode = 400
            return next(error)
        }

        else {
            const hashedPassword = await hash(req.body.password, 10)
            const userFromDb = await createUser(req.body.username, req.body.email, hashedPassword)
            const user = userFromDb.rows[0]
            return res.status(201).json({id: user.account_id, username: user.username, email: user.email})
        }  
    }   catch (error) {
        return next(error)
    }
}

const userLogin = async(req, res, next) => {
    try {
        const emailFromDb = await selectUserByEmail(req.body.email)
        const user = emailFromDb.rows[0]

        if (emailFromDb.rowCount === 0) {
            const error = new Error("Invalid credentials")
            error.statusCode = 401
            return next(error)
        }

        else if (!await compare(req.body.password, user.password)) {
            const error = new Error("Invalid credentials")
            error.statusCode = 401
            return next(error)
        }

        else {
            const token = jwt.sign(req.body.email, process.env.JWT_SECRET_KEY)
            return res.status(200).json({id: user.account_id, username: user.username, email: user.email, token: token})
        }
    }   catch (error) {
        return next(error)
    }
}

export { userRegistration, userLogin }
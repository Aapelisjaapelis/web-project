import { hash, compare } from "bcrypt"
import validator from "validator"
import { createUser, selectUserByEmail, selectUserByUsername, changePassword, changeEmail, deleteAccount } from "../models/user.js"
import jwt from "jsonwebtoken"
import passwordValidator from "password-validator"

const userRegistration = async(req, res, next) => {
    try {
        const usernameFromDb = await selectUserByUsername(req.body.username)    // A username (if exists) from the database is stored into this variable
        const emailFromDb = await selectUserByEmail(req.body.email)             // An email address (if exists) from the database is stored into this variable
        const schema = new passwordValidator();
        schema.is().min(8).has().uppercase().has().digits()                     // Set requirements for a password

        if (!req.body.username || req.body.username.length === 0) {             // Check if the username is empty
            const error = new Error("Invalid username")
            error.statusCode = 400
            return next(error)
        }

        else if (usernameFromDb.rowCount != 0) {                                // Check if the username is already in the database
            const error = new Error("Username already in use")
            error.statusCode = 400
            return next(error)
        }

        else if (emailFromDb.rowCount != 0) {                                   // Check if the email address is already in the database
            const error = new Error("Email already in use")
            error.statusCode = 400
            return next(error)
        }

        else if (!req.body.email || req.body.email.length === 0 || !validator.isEmail(req.body.email)) {    // Check if the email address is valid
            const error = new Error("Invalid email")
            error.statusCode = 400
            return next(error)
        }

        else if (!req.body.password || !schema.validate(req.body.password)) {   // Check if the password is valid
            const error = new Error("Invalid password")
            error.statusCode = 400
            return next(error)
        }

        else {
            const hashedPassword = await hash(req.body.password, 10)                                            // Password is hashed
            const userFromDb = await createUser(req.body.username, req.body.email, hashedPassword)              // The user is inserted into the database
            const user = userFromDb.rows[0]
            return res.status(201).json({id: user.account_id, username: user.username, email: user.email})      // The response includes id, username and email
        }  
    }   catch (error) {
        return next(error)
    }
}

const userLogin = async(req, res, next) => {
    try {
        const emailFromDb = await selectUserByEmail(req.body.email)     // An email address from the database is stored into this variable
        const user = emailFromDb.rows[0]                                // Data from the user is stored into this variable

        if (emailFromDb.rowCount === 0) {                               // Check if an account with the given email exists
            const error = new Error("Invalid email")
            error.statusCode = 401
            return next(error)
        }

        else if (!await compare(req.body.password, user.password)) {    // Check if the password matches
            const error = new Error("Invalid password")
            error.statusCode = 401
            return next(error)
        }

        else {
            return res
            .authorizationHeader(req.body.email)
            .status(200)
            .json({
                id: user.account_id, 
                username: user.username, 
                email: user.email})
        }
    }   catch (error) {
        return next(error)
    }
}

const userChangePassword = async(req, res, next) => {
    const emailFromDb = await selectUserByEmail(req.body.email)
    const userDB = emailFromDb.rows[0]
    const schema = new passwordValidator();
    schema.is().min(8).has().uppercase().has().digits()

    try {
        if (!await compare(req.body.oldPassword, userDB.password)) {
            const error = new Error("Wrong old password")
            error.statusCode = 401
            return next(error)
        }

        else if (!req.body.password || !schema.validate(req.body.password)) {
            const error = new Error("Invalid new password")
            error.statusCode = 400
            return next(error)
        }

        else {
            const hashedPassword = await hash(req.body.password, 10)
            const userFromDb = await changePassword(hashedPassword, userDB.username)
            const user = userFromDb.rows[0]

            return res
            .authorizationHeader(req.body.email)
            .status(200)
            .json({
                id: user.account_id, 
                username: user.username, 
                email: user.email})
        }
    }   catch (error) {
        return next(error)
    }
}

const userChangeEmail = async(req, res, next) => {
    const emailFromDb = await selectUserByEmail(req.body.email)

    try {

        if (emailFromDb.rowCount != 0) {                                   // Check if the email address is already in the database
            const error = new Error("Email already in use")
            error.statusCode = 400
            return next(error)
        }

        else if (!req.body.email || req.body.email.length === 0 || !validator.isEmail(req.body.email)) {    // Check if the email address is valid
            const error = new Error("Invalid email")
            error.statusCode = 400
            return next(error)
        }

        else {    
            const userFromDb = await changeEmail(req.body.email, req.body.username)
            const user = userFromDb.rows[0]

            return res
            .authorizationHeader(req.body.email)
            .status(200)
            .json({
                email: user.email})
        }


    }   catch (error) {
        return next(error)
    }
}

const userDeleteAccount = async(req, res, next) => {
    try {


    }   catch (error) {
        return next(error)
    }
}


export { userRegistration, userLogin, userChangePassword, userChangeEmail, userDeleteAccount }


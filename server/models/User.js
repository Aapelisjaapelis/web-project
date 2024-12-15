import { pool } from "../helpers/database.js"

const createUser = async (username, email, hashedPassword) => {
    return await pool.query("insert into account (username, email, password, is_public) values ($1, $2, $3, $4) returning *", [username, email, hashedPassword, "false"])
}

const changePassword = async (hashedPassword, username) => {
    return await pool.query("update account set password = $1 where username = $2 returning *", [hashedPassword, username])
}

const checkIsAdmin = async (id) => {
    return await pool.query("select is_admin from account_moviegroup where account_id = $1", [id])
}

const deleteAccount = async (id) => {
    return await pool.query("call deleteAccount($1)", [id])
}

const changeEmail = async (email, username) => {
    return await pool.query("update account set email = $1 where username = $2 returning *", [email, username])
}

const selectUserByEmail = async (email) => {
    return await pool.query("select * from account where email = $1", [email])
}

const selectUserByUsername = async (username) => {
    return await pool.query("select * from account where username = $1", [username])
}

const selectUserById = async (id) => {
    return await pool.query("select * from account where account_id = $1", [id])
}

const isPublic = async (id) => {
    return await pool.query("Select is_public from account where account_id = $1", [id])
}

const setPublic = async (id) => {
    return await pool.query("Update account set is_public = $1 where account_id = $2", ["true", id])
}

const setPrivate = async (id) => {
    return await pool.query("Update account set is_public = $1 where account_id = $2", ["false", id])
}

export { createUser, selectUserByEmail, selectUserByUsername, changePassword, changeEmail, deleteAccount, isPublic, setPublic, setPrivate, checkIsAdmin, selectUserById }

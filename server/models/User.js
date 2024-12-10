import { pool } from "../helpers/database.js"

const createUser = async (username, email, hashedPassword) => {
    return await pool.query("insert into account (username, email, password, is_public) values ($1, $2, $3, $4) returning *", [username, email, hashedPassword, "false"])
}

const changePassword = async (hashedPassword, username) => {
    return await pool.query("update account set password = $1 where username = $2 returning *", [hashedPassword, username])
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

export { createUser, selectUserByEmail, selectUserByUsername, changePassword, changeEmail, deleteAccount }

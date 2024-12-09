import { pool } from "../helpers/database.js";

const createUser = async (username, email, hashedPassword) => {
    return await pool.query("insert into account (username, email, password, is_public) values ($1, $2, $3, $4) returning *", [username, email, hashedPassword, "false"])
}

const changePassword = async (hashedPassword, username) => {
    return await pool.query("update account set password = $1 where username = $2", [hashedPassword, username])
}

const selectUserByEmail = async (email) => {
    return await pool.query("select * from account where email = $1", [email])
}

const selectUserByUsername = async (username) => {
    return await pool.query("select * from account where username = $1", [username])
}

export { createUser, selectUserByEmail, selectUserByUsername, changePassword }


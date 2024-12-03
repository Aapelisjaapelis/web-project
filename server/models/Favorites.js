import { pool } from "../helpers/database.js"

const selectMyFavoriteMovies = async (id) => {
    return await pool.query("Select movie_id from favorites where account_id = $1", [id])
}

export { selectMyFavoriteMovies }

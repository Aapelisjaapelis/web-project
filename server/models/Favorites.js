import { pool } from "../helpers/database.js"

const selectMyFavoriteMovies = async (id) => {
    return await pool.query("Select movie_id, movie_name from favorites where account_id = $1", [id])
}

const deleteMyFavoriteMovie = async (id, movieId) => {
    return await pool.query("Delete from favorites where account_id = $1 and movie_id = $2", [id, movieId])
}

export { selectMyFavoriteMovies, deleteMyFavoriteMovie }

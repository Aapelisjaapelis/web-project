import { pool } from "../helpers/database.js"

const selectMyFavoriteMovies = async (id) => {
    return await pool.query("Select movie_id, movie_name, poster_path from favorites where account_id = $1", [id])
}

const deleteMyFavoriteMovie = async (id, movieId) => {
    return await pool.query("Delete from favorites where account_id = $1 and movie_id = $2", [id, movieId])
}

const postFavoriteMovie = async (id, movie_id, movie_name, poster_path) => {
    return await pool.query("Insert into favorites (account_id, movie_id, movie_name, poster_path) values ($1, $2, $3, $4) returning *", [id, movie_id, movie_name, poster_path])
}

const selectOneMovieFromFavorites = async (id, movie_id) => {
    return await pool.query("Select * from favorites where account_id = $1 and movie_id = $2", [id, movie_id])
}

export { selectMyFavoriteMovies, deleteMyFavoriteMovie, postFavoriteMovie, selectOneMovieFromFavorites}

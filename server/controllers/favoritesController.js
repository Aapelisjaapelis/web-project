import { selectMyFavoriteMovies, deleteMyFavoriteMovie, postFavoriteMovie, selectOneMovieFromFavorites} from '../models/Favorites.js'
import { emptyOrRows } from '../helpers/utils.js'

const getMyFavoriteMovies = async(req, res, next) => {
    try {
        const result = await selectMyFavoriteMovies(req.params.id)
        return res.status(200).json(emptyOrRows(result))
    } catch (error) {
        return next(error)
    }
}

const removeMyFavoriteMovie = async(req, res, next) => {
    try {
        await deleteMyFavoriteMovie(req.params.id, req.params.movie_id)
        return res.status(200).json({message: "Successfully removed from favorites"})
    } catch (error) {
        return next(error)
    }
}

const addFavoriteMovie = async(req, res, next) => {
    try {
        await postFavoriteMovie(req.body.id, req.body.movie_id, req.body.movie_name, req.body.poster_path)
        return res.status(200).json({message: "Added to favorites"})
    } catch (error) {
        return next(error)
    }
}

const isMovieInFavorites = async(req, res, next) => {
    try {
        const result = await selectOneMovieFromFavorites(req.params.id, req.params.movieId)
        if (result.rowCount === 0) {
            return res.status(200).json({favorite: "no"})
        }

        else {
            return res.status(200).json({favorite: "yes"})
        }
    } catch (error) {
        return next(error)
    }
}

export { getMyFavoriteMovies, removeMyFavoriteMovie, addFavoriteMovie, isMovieInFavorites}

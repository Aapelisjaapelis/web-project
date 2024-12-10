import { selectMyFavoriteMovies, deleteMyFavoriteMovie} from '../models/Favorites.js'
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

export { getMyFavoriteMovies, removeMyFavoriteMovie}

import { selectMyFavoriteMovies } from '../models/Favorites.js'
import { emptyOrRows } from '../helpers/utils.js'

const getMyFavoriteMovies = async(req, res, next) => {
    try {
        const result = await selectMyFavoriteMovies(req.params.id)
        return res.status(200).json(emptyOrRows(result))
    } catch (error) {
        return next(error)
    }
}

export { getMyFavoriteMovies }

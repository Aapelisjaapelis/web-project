import { selectMyFavoriteMovies } from '../models/Favorites.js'

const getMyFavoriteMovies = async(req, res, next) => {
    try {
        const result = await selectMyFavoriteMovies(req.params.id)
        console.log(result.rows)

    } catch(error) {
        return next(error)
    }
}

export { getMyFavoriteMovies }

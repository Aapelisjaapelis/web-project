import { insertReview, getAllReviews, editReviews } from '../models/Movie.js'
import { emptyOrRows } from '../helpers/utils.js'

const getReviews = async (req, res, next) => {
  try {
    if(!req.params.movieId || req.params.movieId.length === 0 || isNaN(req.params.movieId)) {
      const error = new Error('Movie id is missing.')
      error.statusCode = 400
      return next(error)
    }
    const id = req.params.movieId
    const result = await getAllReviews(id)

    return res.status(200).json(emptyOrRows(result))
  } catch (error) {
    return next(error)
  }
}

const postReviews = async (req, res, next) => {
  try {
    if(typeof(req.body.ratingNumber) !== 'number' ||!req.body.movieId || !req.body.userId) {
      const error = new Error('Missing information in review form.')
      error.statusCode = 400
      return next(error)
    }
    const result = await insertReview(req.body.movieId, req.body.userId, req.body.ratingNumber, req.body.ratingText)
    return res.status(200).json({id: result.rows[0].id})
  } catch (error) {
    return next(error)
  }
}

const editMovieReviews = async (req, res, next) => {
  try {
    if(typeof(req.body.ratingNumber) !== 'number' || !req.body.id) {
      const error = new Error('Missing information in review form.')
      error.statusCode = 400
      return next(error)
    }
    const result = await editReviews(req.body.id, req.body.ratingNumber, req.body.ratingText)
    return res.status(200).json({id: result.rows[0].id})
  } catch (error) {
    return next(error)
  }
}

export { postReviews, getReviews, editMovieReviews }
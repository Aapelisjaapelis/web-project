import { Router } from "express"
import { editMovieReviews, getReviews, postReviews } from "../controllers/MovieController.js"

const router = Router()

router.get('/allReviews/:movieId', getReviews)

router.post('/createReview', postReviews)

router.put('/updateReview', editMovieReviews)

export default router
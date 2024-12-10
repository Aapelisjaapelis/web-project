import { Router } from "express"
import { editMovieReviews, getReviews, postReviews } from "../controllers/MovieController.js"
import { auth } from "../helpers/auth.js"

const router = Router()

router.get('/allReviews/:movieId', getReviews)

router.post('/createReview', auth, postReviews)

router.put('/updateReview', auth, editMovieReviews)

export default router
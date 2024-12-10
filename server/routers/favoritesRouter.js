import { Router } from "express"
import { getMyFavoriteMovies, removeMyFavoriteMovie, addFavoriteMovie, isMovieInFavorites } from "../controllers/favoritesController.js"
import { auth } from '../helpers/auth.js'

const router = Router()

router.get("/myFavorites/:id", getMyFavoriteMovies)
router.delete("/removeFavorite/:id/:movie_id", removeMyFavoriteMovie)
router.post("/addFavorite", auth, addFavoriteMovie)
router.get("/isMovieFavorite/:id/:movieId", isMovieInFavorites)

export default router
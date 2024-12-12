import { Router } from "express"
import { getMyFavoriteMovies, removeMyFavoriteMovie, addFavoriteMovie, isMovieInFavorites } from "../controllers/favoritesController.js"
import { auth } from '../helpers/auth.js'

const router = Router()

router.get("/myFavorites/:id", auth, getMyFavoriteMovies)
router.get("/isMovieFavorite/:id/:movieId", auth, isMovieInFavorites)
router.delete("/removeFavorite/:id/:movie_id", auth, removeMyFavoriteMovie)
router.post("/addFavorite", auth, addFavoriteMovie)

export default router
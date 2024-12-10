import { Router } from "express"
import { getMyFavoriteMovies, removeMyFavoriteMovie } from "../controllers/favoritesController.js"

const router = Router()

router.get("/myFavorites/:id", getMyFavoriteMovies)
router.delete("/removeFavorite/:id/:movie_id", removeMyFavoriteMovie)

export default router
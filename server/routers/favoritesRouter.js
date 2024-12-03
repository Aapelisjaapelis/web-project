import { Router } from "express"
import { getMyFavoriteMovies } from "../controllers/favoritesController.js"

const router = Router()

router.get("/myFavorites/:id", getMyFavoriteMovies)

export default router
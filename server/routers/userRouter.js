import { Router } from "express"
import { userRegistration } from "../controllers/UserController.js"

const router = Router()

router.post("/register", userRegistration)

export default router

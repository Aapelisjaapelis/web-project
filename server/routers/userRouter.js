import { Router } from "express"
import { userRegistration, userLogin, userChangePassword } from "../controllers/UserController.js"

const router = Router()

router.post("/register", userRegistration)
router.post("/login", userLogin)
router.post("/changePassword", userChangePassword)

export default router

import { Router } from "express"
import { userRegistration, userLogin, userChangePassword, userChangeEmail } from "../controllers/UserController.js"

const router = Router()

router.post("/register", userRegistration)
router.post("/login", userLogin)
router.post("/changePassword", userChangePassword)
router.post("/changeEmail", userChangeEmail)

export default router

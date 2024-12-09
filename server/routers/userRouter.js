import { Router } from "express"
import { userRegistration, userLogin, userChangePassword, userChangeEmail, userDeleteAccount } from "../controllers/UserController.js"
import { auth } from "../helpers/auth.js"

const router = Router()

router.post("/register", userRegistration)
router.post("/login", userLogin)
router.post("/changePassword", auth, userChangePassword)
router.post("/changeEmail", auth, userChangeEmail)
router.delete("/profile/:id", userDeleteAccount)

export default router

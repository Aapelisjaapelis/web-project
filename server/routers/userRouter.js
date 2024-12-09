import { Router } from "express"
import { userRegistration, userLogin, userChangePassword, userChangeEmail, userDeleteAccount } from "../controllers/UserController.js"

const router = Router()

router.post("/register", userRegistration)
router.post("/login", userLogin)
router.post("/changePassword", userChangePassword)
router.post("/changeEmail", userChangeEmail)
router.delete("/profile/:id", userDeleteAccount)

export default router

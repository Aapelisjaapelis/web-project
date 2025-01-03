import { Router } from "express"
import { userRegistration, userLogin, userChangePassword, userChangeEmail, userDeleteAccount, userVisibility, changeToPublic, changeToPrivate, userGetIsAdmin} from "../controllers/UserController.js"
import { auth } from "../helpers/auth.js"

const router = Router()

router.post("/register", userRegistration)
router.post("/login", userLogin)
router.post("/changePassword", auth, userChangePassword)
router.post("/changeEmail", auth, userChangeEmail)
router.delete("/profile/:id", auth, userDeleteAccount)
router.get("/visibility/:id", auth, userVisibility)
router.get("/getVisibility/:id", userVisibility)
router.put("/makePublic", auth, changeToPublic)
router.put("/makePrivate", auth, changeToPrivate)
router.get("/isAdmin/:id", auth, userGetIsAdmin)


export default router

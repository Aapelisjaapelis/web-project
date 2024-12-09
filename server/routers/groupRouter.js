import { Router } from "express"
import { auth } from '../helpers/auth.js'
import { getGroups, getMyGroups, getMembers, removeMember, postNewGroup } from '../controllers/groupController.js'

const router = Router()

router.get('/getGroups', auth, getGroups)
router.get('/MyGroups/:id', auth, getMyGroups)
router.get('/Members/:id', auth, getMembers)
router.delete('/deleteMembers',auth, removeMember)
router.post('/createGroup', auth, postNewGroup)



export default router
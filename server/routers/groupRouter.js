import { Router } from "express"
import { auth } from '../helpers/auth.js'
import { getGroups, getMyGroups, getMembers, removeMember, postNewGroup } from '../controllers/groupController.js'

const router = Router()

router.get('/getGroups', getGroups)
router.get('/MyGroups/:id', getMyGroups)
router.get('/Members/:id', getMembers)
router.delete('/deleteMembers',removeMember)
router.post('/createGroup',postNewGroup)



export default router
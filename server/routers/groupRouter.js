import { Router } from "express"
import { auth } from '../helpers/auth.js'
import { getGroups, getMyGroups, getMembers, removeMember, postNewGroup, postjoinrequest,getMoviesForGroup } from '../controllers/groupController.js'

const router = Router()

router.get('/getGroups', auth, getGroups)
router.get('/MyGroups/:id',auth, getMyGroups)
router.get('/Members/:id', auth,getMembers)
router.delete('/deleteMembers',auth,removeMember)
router.post('/createGroup',auth,postNewGroup)
router.post('/joinGroup',auth,postjoinrequest)
router.get('/GetGroupMovies/:id',auth, getMoviesForGroup)



export default router
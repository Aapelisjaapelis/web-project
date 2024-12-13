import { Router } from "express"
import { auth } from '../helpers/auth.js'
import { getGroups, getMyGroups, getMembers, removeMember, postNewGroup, postjoinrequest,getMoviesForGroup, getAdminInfo,removeShowtime, getJoin, postNewMember, removeJoinRequest, getAllUsers, postNewAdmin } from '../controllers/groupController.js'

const router = Router()

router.get('/getGroups', auth, getGroups)
router.get('/MyGroups/:id',auth, getMyGroups)
router.get('/Members/:id', auth,getMembers)
router.get('/getJoinReq/:id', auth, getJoin)
router.get('/GetGroupMovies/:id',auth, getMoviesForGroup)
router.get('/checkAdmin', auth, getAdminInfo)
router.get('/getAllUsers',auth,getAllUsers)
router.post('/createGroup',auth,postNewGroup)
router.post('/joinGroup',auth,postjoinrequest)
router.post('/postNewMember', auth, postNewMember)
router.post('/changeAdmin', auth, postNewAdmin )
router.delete('/deleteJoinRequest', auth, removeJoinRequest)
router.delete('/deleteMembers',auth,removeMember)
router.delete('/deleteShowtime', auth, removeShowtime)



export default router
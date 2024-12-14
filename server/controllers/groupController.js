import { emptyOrRows } from '../helpers/utils.js'
import { selectGroupByID, selectGroupByMe, selectAllMembers, deleteMember, createNewGroup, addNewMember, joinGroup, checkIfMember, getJoinRequests, selectGroupMovies, selectGroupAdminInfo, deleteshowtime, selectJoinRequests, deleteRequest, selectAllUsers, changeAdmin, addNewGroupShowtime } from '../models/Groupmodel.js'


const getGroups = async (req,res,next) => {
    try {
        const result = await selectGroupByID()
        return res.status(200).json(emptyOrRows(result))
    } catch (error){
        return next (error)
    }
}

const getAllUsers = async (req,res,next) => {
    try{
        const result = await selectAllUsers()
        return res.status(200).json(emptyOrRows(result))
    } catch (error) {
        return next (error)
    }
}
const getMyGroups = async (req,res,next) => {
    try {
        const result = await selectGroupByMe(req.params.id)

        // return on nimi ja path
        
        
        return res.status(200).json(emptyOrRows(result))
    } catch (error){
        return next (error)
    }
}

const getMembers = async (req,res,next) => {
    try {
        const result = await selectAllMembers(req.params.id)
        
        return res.status(200).json(emptyOrRows(result))
    } catch (error){
        return next (error)
    }
}

const getMoviesForGroup = async (req,res,next) => {
    try {
        const result = await selectGroupMovies(req.params.id)
        
        return res.status(200).json(emptyOrRows(result))
    } catch (error){
        return next (error)
    }
}


const getAdminInfo = async (req,res,next) => {
    try {
        const userId = req.query.id1;
        const groupId = req.query.id2;
  
 
        const result = await selectGroupAdminInfo(userId, groupId)

        
        return res.status(200).json(emptyOrRows(result))
    } catch (error){
        return next (error)
    }
}

const getJoin = async (req,res,next) => {
    try {
        const result = await selectJoinRequests(req.params.id)
        
        return res.status(200).json(emptyOrRows(result))
    } catch (error){
        return next (error)
    }
}



const postjoinrequest = async (req,res,next) => {
    try {
        const userId = req.body.id1;
        const groupId = req.body.id2;        

        const isMember = await checkIfMember(userId, groupId);
        if(isMember.rowCount > 0){
            return res.status(400).json({error: 'You are already a member of this group.'})
        }

        const accountsIds = await getJoinRequests(groupId);
        const hasrequest = accountsIds.rows.map(row => row.account_id);



        if(hasrequest.includes(userId)){
            return res.status(400).json({error: 'You already have a join request. Wait for admin to respond!'})
        }

        const result = await joinGroup(userId, groupId )

        return res.status(200).json(emptyOrRows(result))
    } catch (error){
        return next (error)
    }
}


const postNewGroup = async (req,res,next) => {
    try {

        const newGroup = req.body.id1;
        const newDesc = req.body.id2;
        const userId = req.body.id3;
        const admin = true;

        const result1 = await createNewGroup(newGroup, newDesc )
        const groupId = result1.rows[0].id
        const result2 = await addNewMember(userId, groupId, admin )


        return res.status(200).json(emptyOrRows({id: groupId}))
    } catch (error){
        return next (error)
    }
}

const postNewMember = async (req,res,next) => {
    try{
    const groupId = req.body.id1;
    const newMember = req.body.id2;

    const result = await addNewMember(newMember, groupId, false)
    const result1 = await deleteRequest(groupId, newMember)
    const result2 = await selectAllMembers(groupId)

    return res.status(200).json(emptyOrRows(result2))

    } catch (error){
        return next (error)
    }
}

const postNewAdmin = async (req,res, next) => {
    try{
        const userId = req.body.id1;
        const groupId = req.body.id2;
        const newAdmin = req.body.id3;

        const result = await selectAllMembers(groupId)
        

        const isNewAdminAlreadyInGroup = result.rows.some(member => member.account_id === newAdmin);

        if (isNewAdminAlreadyInGroup) {
            const result1 = await changeAdmin(groupId, newAdmin, true)
        }
        else{
            const result2 = await addNewMember(newAdmin, groupId, true )
        }
        const result3 = await changeAdmin(groupId, userId, false)

        return res.status(200).json(emptyOrRows(result3))

    } catch (error){
        return next (error)
    }
}

const removeJoinRequest = async (req,res,next) => {
    try {
        const groupId = req.query.id1;
        const member = req.query.id2;

        const result = await deleteRequest(groupId, member)

        return res.status(200).json({ id: member })

    } catch (error) {
        return next(error)
    }
}



const removeMember = async (req,res,next) => {
    try {
        const groupId = req.query.id1;
        const member = req.query.id2;

        if (member<0 || !member) {
            const error = newError('Invalid id for member')
            error.statusCode = 400
            return next(error)
        }
        const result = await deleteMember(groupId, member)

        return res.status(200).json({ id: member })

    } catch (error) {
        return next(error)
    }
}
const postShowTime = async (req,res,next) => {
    try {
        const groupId = req.body.groupId;
        let movieId = req.body.movieId;
        const finnkinoId = req.body.finnkinoId;
        const finnkinoMovieId = req.body.finnkinoMovieId;
        const finnkinoMovieName = req.body.finnkinoMovieName;

        if (!finnkinoId || finnkinoId.length === 0) {
            const error = newError('Showtime id not provided')
            error.statusCode = 400
            return next(error)
        }

        if (!finnkinoMovieId || finnkinoMovieId.length === 0) {
            const error = newError('Showtime movie id not provided')
            error.statusCode = 400
            return next(error)
        }

        if (!finnkinoMovieName || finnkinoMovieName.length === 0) {
            const error = newError('Showtime movie name not provided')
            error.statusCode = 400
            return next(error)
        }

        if (!groupId || groupId.length === 0) {
            const error = newError('Group id not provided')
            error.statusCode = 400
            return next(error)
        }

        if (!movieId || movieId.length === 0) {
            movieId = 0
        }

        const result = await addNewGroupShowtime(groupId, movieId, finnkinoId, finnkinoMovieId, finnkinoMovieName)
        return res.status(200).json(emptyOrRows({result}))
    } catch (error) {
        return next(error)
    }
}

const removeShowtime = async (req,res,next) => {
    try{
        const groupId = req.query.id1;
        const showtimeId = req.query.id2;

        console.log("Group"+groupId);
        console.log("showid"+showtimeId);

        const result = await deleteshowtime(groupId, showtimeId)

        console.log(result);


        return res.status(200).json({id: showtimeId})
    } catch (error) {
    return next(error)
}
}


export { getGroups, getMyGroups, getMembers, removeMember,postNewGroup, postjoinrequest, getMoviesForGroup, getAdminInfo, removeShowtime, getJoin, postNewMember, removeJoinRequest, getAllUsers, postNewAdmin, postShowTime  }


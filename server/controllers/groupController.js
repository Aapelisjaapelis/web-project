import { emptyOrRows } from '../helpers/utils.js'
import { selectGroupByID, selectGroupByMe, selectAllMembers, deleteMember, createNewGroup, addNewMember, joinGroup, checkIfMember, getJoinRequests, addNewGroupShowtime } from '../models/Groupmodel.js'

const getGroups = async (req,res,next) => {
    try {
        const result = await selectGroupByID()
        return res.status(200).json(emptyOrRows(result))
    } catch (error){
        return next (error)
    }
}

const getMyGroups = async (req,res,next) => {
    try {
        const result = await selectGroupByMe(req.params.id)
        
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
        const movieId = req.body.movieId;
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

        const result = await addNewGroupShowtime(groupId, movieId, finnkinoId, finnkinoMovieId, finnkinoMovieName)
        return res.status(200).json(emptyOrRows({result}))
    } catch (error) {
        return next(error)
    }
}


export { getGroups,getMyGroups,getMembers, removeMember,postNewGroup, postjoinrequest, postShowTime }
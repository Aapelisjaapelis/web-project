import { emptyOrRows } from '../helpers/utils.js'
import { selectGroupByID, selectGroupByMe, selectAllMembers, deleteMember, createNewGroup, addNewMember } from '../models/Groupmodel.js'

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



export { getGroups,getMyGroups,getMembers, removeMember,postNewGroup }
import { pool } from '../helpers/database.js'

const selectGroupByID = async () => {
    return await pool.query('select * from moviegroup')
}

const selectAllUsers = async () => {
    return await pool.query('SELECT * from account')
}
const selectGroupByMe = async (id) => {
    return await pool.query('SELECT * FROM moviegroup INNER JOIN account_moviegroup ON moviegroup.id=account_moviegroup.moviegroup_id where account_id = $1', [id])
}

const selectAllMembers = async (id) => {
    return await pool.query('SELECT a.* FROM account_moviegroup amg JOIN account a ON amg.account_id = a.account_id WHERE amg.moviegroup_id = $1;', [id])
}

const selectGroupAdminInfo = async (userId, groupId) => {

    return await pool.query('SELECT is_admin FROM account_moviegroup WHERE account_id = $1 AND moviegroup_id = $2',[userId,groupId])
}

const selectGroupMovies = async (groupId) => {
    return await pool.query ( 'SELECT id, movie_name, finnkino_movie_id, finnkino_time_id FROM group_movies WHERE moviegroup_id = $1 ', [groupId])
}

const selectJoinRequests = async(groupId) => {
    return await pool.query('SELECT a.* FROM account a JOIN group_invites gi ON a.account_id = gi.account_id WHERE gi.moviegroup_id = $1',[groupId])
}

const checkIfMember = async (userId, groupId) => {
    return await pool.query('SELECT 1 FROM account_moviegroup WHERE account_id = $1 AND moviegroup_id = $2',[userId, groupId])
}

const deleteMember = async (id1, id2) => {
    return await pool.query('DELETE FROM account_moviegroup WHERE moviegroup_id = $1 AND account_id = $2;', [id1, id2])

}
const deleteshowtime = async (groupId, showtimeId) => {
    return await pool.query('DELETE FROM group_movies WHERE moviegroup_id = $1 AND id = $2;', [groupId, showtimeId])
}
const deleteRequest = async (groupId, userId) => {
    return await pool.query('DELETE FROM group_invites WHERE moviegroup_id = $1 AND account_id = $2', [groupId, userId])
}

const createNewGroup = async (newGroup, newDesc) => {
    return await pool.query('INSERT INTO moviegroup (group_name, group_desc) VALUES ($1,$2) returning *', [newGroup, newDesc])
}

const addNewMember = async (userId, groupId, admin ) => {
    return await pool.query('INSERT INTO account_moviegroup(account_id, moviegroup_id, is_admin) values($1,$2,$3)',[userId,groupId,admin])
}

const joinGroup = async(userId, groupId) => {
    return await pool.query('INSERT INTO group_invites (admin_accepted, user_accepted,account_id, moviegroup_id) VALUES (False, True, $1, $2)',[userId, groupId])
}
const getJoinRequests = async(groupId) => {
    return await pool.query('SELECT account_id FROM group_invites WHERE moviegroup_id = $1',[groupId])
}

const changeAdmin = async(groupId, userId, adminstatus) => {
    return await pool.query('UPDATE account_moviegroup SET is_admin = $1 WHERE moviegroup_id = $2 AND account_id = $3 ',[adminstatus, groupId,userId])
}

export { selectGroupByID, selectGroupByMe, selectAllMembers, deleteMember, createNewGroup, addNewMember, joinGroup, checkIfMember, selectJoinRequests,selectGroupMovies, selectGroupAdminInfo, deleteshowtime, deleteRequest, getJoinRequests, selectAllUsers, changeAdmin }

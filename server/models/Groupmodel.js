import { pool } from '../helpers/database.js'

const selectGroupByID = async () => {
    return await pool.query('select * from moviegroup')
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
    return await pool.query ( 'SELECT movie_name, finnkino_movie_id, finnkino_time_id FROM group_movies WHERE moviegroup_id = $1 ', [groupId])
}

const deleteMember = async (id1, id2) => {
    return await pool.query('DELETE FROM account_moviegroup WHERE moviegroup_id = $1 AND account_id = $2;', [id1, id2])

}

const createNewGroup = async (newGroup, newDesc) => {
    return await pool.query('INSERT INTO moviegroup (group_name, group_desc) VALUES ($1,$2) returning *', [newGroup, newDesc])
}

const addNewMember = async (userId, groupId, admin ) => {
    return await pool.query('INSERT INTO account_moviegroup(account_id, moviegroup_id, is_admin) values($1,$2,$3)',[userId,groupId,admin])
}

const checkIfMember = async (userId, groupId) => {
    return await pool.query('SELECT 1 FROM account_moviegroup WHERE account_id = $1 AND moviegroup_id = $2',[userId, groupId])
}

const joinGroup = async(userId, groupId) => {
    return await pool.query('INSERT INTO group_invites (admin_accepted, user_accepted,account_id, moviegroup_id) VALUES (False, True, $1, $2)',[userId, groupId])
}

const getJoinRequests = async(groupId) => {
    return await pool.query('SELECT account_id FROM group_invites WHERE moviegroup_id = $1',[groupId])
}

const addNewGroupShowtime = async(groupId, movieId, finnkinoId, finnkinoMovieId, finnkinoMovieName) => {
    return await pool.query('INSERT INTO group_movies (moviegroup_id, movie_id, finnkino_time_id, finnkino_movie_id, movie_name) VALUES ($1, $2, $3, $4, $5) returning *',[groupId, movieId, finnkinoId, finnkinoMovieId, finnkinoMovieName])
}
export { selectGroupByID, selectGroupByMe, selectAllMembers, deleteMember, createNewGroup, addNewMember, joinGroup, checkIfMember, getJoinRequests,selectGroupMovies, selectGroupAdminInfo, addNewGroupShowtime }


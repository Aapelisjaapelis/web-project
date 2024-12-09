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

const deleteMember = async (id1, id2) => {
    return await pool.query('DELETE FROM account_moviegroup WHERE moviegroup_id = $1 AND account_id = $2;', [id1, id2])

}

const createNewGroup = async (newGroup, newDesc) => {
    return await pool.query('INSERT INTO moviegroup (group_name, group_desc) VALUES ($1,$2) returning *', [newGroup, newDesc])
}

const addNewMember = async (userId, groupId, admin ) => {
    return await pool.query('INSERT INTO account_moviegroup(account_id, moviegroup_id, is_admin) values($1,$2,$3)',[userId,groupId,admin])
}

export { selectGroupByID, selectGroupByMe, selectAllMembers, deleteMember, createNewGroup, addNewMember }

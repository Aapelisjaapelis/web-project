import { pool } from "../helpers/database.js";

const insertReview = async (movieId, userId, ratingNumber, ratingText) => {
  return await pool.query('insert into review (account_id, movie_id, rating, review_text) values ($1, $2, $3, $4) returning *',[userId, movieId, ratingNumber, ratingText])
}

const getAllReviews = async (id) => {
  return await pool.query('select review.*, account.username from review left join account on review.account_id=account.account_id where review.movie_id=$1', [id])
}

const editReviews = async (id, ratingNumber, ratingText) => {
  return await pool.query('update review set rating = $1, review_text = $2 where id = $3 returning *', [ratingNumber, ratingText, id])
}

export { insertReview, getAllReviews, editReviews }
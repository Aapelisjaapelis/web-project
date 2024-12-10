import './SpecificMoviePage.css';
import Navbar from "../components/Navbar.js"
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../context/useUser.js';

const url = process.env.REACT_APP_API_URL


function SpecificMoviePage() {
    const location = useLocation();
    const [movieId, setMovieId] = useState(location.state.id)
    const [movieInfo, setMovieInfo] = useState([])
    const [ratings, setRatings] = useState(['unchecked', 'unchecked', 'unchecked', 'unchecked', 'unchecked'])
    const [ratingText, setRatingText] = useState('')
    const [givenRating, setGivenRating] = useState({})
    const [ownRatingGiven, setOwnRatingGiven] = useState(false)
    const [othersReviews, setOthersReviews] = useState([])
    const [allReviews, setAllReviews] = useState([])
    const { user } = useUser()

    useEffect(() => {
        const url = 'https://api.themoviedb.org/3/movie/' + movieId + '?language=en-US';
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmNDI4MDczZWUwMTU1OTE5MmNjZDdhMjg4ODYyNmJjYiIsIm5iZiI6MTczMTM5ODIxMC4yOTI3ODc2LCJzdWIiOiI2NzA5N2M2ZmUxZGI5ZWM0ODYyZThmMGMiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.nYj8DKtCcuy-kzpZGobAf5e8bY9YS0NQRG7rFRd_qss'
            }    
         };

        fetch(url, options)
        .then(response => response.json())
        .then(json => {
        setMovieInfo(json)
        })
        .catch(error => {
        console.log(error)
        })
        othersRatings()
    }, [])

    const othersRatings = () => {
        axios.get(url + '/movie/allReviews/' + movieId)
            .then(response => {
                for(let i = 0; i < response.data.length; i++) {
                    if(response.data[i].account_id === user.id) {
                        setGivenRating(response.data[i])
                        const withoutOwnReviews = response.data.filter((review) => review.account_id !== user.id)
                        setOwnRatingGiven(true)
                        setOthersReviews(withoutOwnReviews)
                        setAllReviews(response.data)
                        ratingValue(response.data[i].rating)
                        break;
                    } else {
                        setAllReviews(response.data)
                        setOthersReviews(response.data)
                        setOwnRatingGiven(false)
                    }
                }
            }).catch(error => {
                alert(error.response.data.error ? error.response.data.error : error)
            })
    }

    const DisplayOthersRatings = () => {
        return (
            <div id="otherRatings">
                { othersReviews.map(rating => (
                    <div className="otherReviewBox" key={rating.id}>
                        <FontAwesomeIcon icon={faCircleUser} size="xl" className="unchecked"/>
                        <p className="username">{rating.username}</p>
                        <p className="timestamp">{rating.timestamp}</p>
                        {(() => {
                            const stars = [];
                                for (let i = 0; i < 5; i++) {
                                    if(rating.rating > i) {
                                        stars.push(<FontAwesomeIcon icon={faStar} size="lg" className="checked"/>)
                                    } else {
                                        stars.push(<FontAwesomeIcon icon={faStar} size="lg" className="unchecked"/>)
                                    }
                                }
                            return stars;
                        })()}
                        <p>{rating.review_text}</p>
                    </div>
                ))}

                {(() => {
                    if(othersReviews.length === 0) {
                        return (<p>There are currently no reviews.</p>)
                    }
                })()}
            </div>
        )
    }

    const StarRatings = () => {
        let finalRating = 0;
        for (let i = 0; i < allReviews.length; i++) {
            finalRating += allReviews[i].rating
        }
        if(allReviews.length === 0) {
            finalRating = 0
        } else {
            finalRating = Math.round(finalRating / (allReviews.length))
        }
        return (
            <div id="starRating">
                {(() => {
                    const stars = [];
                        for (let i = 0; i < 5; i++) {
                            if(finalRating > i) {
                                stars.push(<FontAwesomeIcon icon={faStar} size="2xl" className="checked"/>)
                            } else {
                                stars.push(<FontAwesomeIcon icon={faStar} size="2xl" className="unchecked"/>)
                            }
                        }
                    return stars;
                })()}
            </div>
        )
    }

    const ratingValue = (number) => {
        let ratinglist = ['unchecked', 'unchecked', 'unchecked', 'unchecked', 'unchecked']
        for (let i = 0; i < number; i++) {
            ratinglist[i] = 'checked'
        }
        setRatings(ratinglist)
    }

    const handleRatingSubmit = async (e) => {
        e.preventDefault()
        try {
            let ratingValue = 0;
            for (let i = 0; i < 5; i++) {
                if(ratings[i] === 'checked') {
                    ratingValue += 1;
                }
            }
            //alert(ratingValue + ' ' + ratingText)
            axios.post(url + '/movie/createReview',{
                movieId: movieId,
                ratingText: ratingText,
                ratingNumber: ratingValue,
                userId: user.id
            })
            .then(response => {
                setOthersReviews([...othersReviews, {id:response.data.id, account_id:user.id, movie_id:movieId, rating:ratingValue, review_text:ratingText}])
                document.getElementById('ownRating').innerHTML = `<p>Review successfully sent</p>`
            })
        } catch (error){
            
        }
    }

    const handleEditSubmit = async (e) => {
        e.preventDefault()
        try {
            let ratingValue = 0;
            for (let i = 0; i < 5; i++) {
                if(ratings[i] === 'checked') {
                    ratingValue += 1;
                }
            }
            //alert(ratingValue + ' ' + ratingText)
            axios.put(url + '/movie/updateReview',{
                id: givenRating.id,
                ratingText: ratingText,
                ratingNumber: ratingValue
            })
            .then(response => {
                alert('Review successfully edited.')
            })
        } catch (error){
            
        }
    }

    return (
        <>
            <Navbar />
            <div id="container">
                    <h1>{movieInfo.title}</h1>
                    <div className="flex-container">
                        <div className="left-side">
                            <img src={'https://image.tmdb.org/t/p/w500' + movieInfo.poster_path} alt='Movie poster'></img>
                            <h3>Release Date</h3>
                            <p>{movieInfo.release_date}</p>
                            <h3>Genres</h3>
                            {(() => {
                                const genres = [];
                                    if(movieInfo.genres) {
                                        for (let i = 0; i < movieInfo.genres.length; i++) {
                                            genres.push(<p key={movieInfo.genres[i].id}>{movieInfo.genres[i].name}</p>)
                                        }
                                    }
                                return genres;
                            })()}
                        </div>
                        <div className="middle">
                            <h2>Overview</h2>
                            <p>{movieInfo.overview}</p>
                        </div>
                        <div className="right-side">
                            <h2>Ratings</h2>
                            <StarRatings/>
                            <div id="ratings">
                                {(() => {
                                    if(ownRatingGiven) {
                                        return (
                                            <div id="ownRating">
                                                <h3>Your rating:</h3>
                                                <form onSubmit={handleEditSubmit}>
                                                    <div id="clickableStars">
                                                        <FontAwesomeIcon icon={faStar} size="xl" className={ratings[0]} id="star1" onClick={e => ratingValue(1)}/>
                                                        <FontAwesomeIcon icon={faStar} size="xl" className={ratings[1]}  id="star2" onClick={e => ratingValue(2)}/>
                                                        <FontAwesomeIcon icon={faStar} size="xl" className={ratings[2]}  id="star3" onClick={e => ratingValue(3)}/>
                                                        <FontAwesomeIcon icon={faStar} size="xl" className={ratings[3]}  id="star4" onClick={e => ratingValue(4)}/>
                                                        <FontAwesomeIcon icon={faStar} size="xl" className={ratings[4]}  id="star5" onClick={e => ratingValue(5)}/>
                                                    </div>
                                                    <div id="userBox">
                                                        <FontAwesomeIcon icon={faCircleUser} size="xl" className="unchecked"/>
                                                        <textarea id="userRatingText" defaultValue={givenRating.review_text} placeholder="Review text" rows="3" cols="50" onChange={e => setRatingText(e.target.value)}> 
                                
                                                        </textarea>
                                                    </div>
                                                    <button className="ratingButton">Send edited rating</button>
                                                </form>
                                            </div>
                                        )
                                    } else if(user.id) {
                                        return (
                                            <div id="ownRating">
                                                <form onSubmit={handleRatingSubmit}>
                                                    <div id="clickableStars">
                                                        <FontAwesomeIcon icon={faStar} size="xl" className={ratings[0]} id="star1" onClick={e => ratingValue(1)}/>
                                                        <FontAwesomeIcon icon={faStar} size="xl" className={ratings[1]}  id="star2" onClick={e => ratingValue(2)}/>
                                                        <FontAwesomeIcon icon={faStar} size="xl" className={ratings[2]}  id="star3" onClick={e => ratingValue(3)}/>
                                                        <FontAwesomeIcon icon={faStar} size="xl" className={ratings[3]}  id="star4" onClick={e => ratingValue(4)}/>
                                                        <FontAwesomeIcon icon={faStar} size="xl" className={ratings[4]}  id="star5" onClick={e => ratingValue(5)}/>
                                                    </div>
                                                    <div id="userBox">
                                                        <FontAwesomeIcon icon={faCircleUser} size="xl" className="unchecked"/>
                                                        <textarea id="userRatingText" placeholder="Review text" rows="3" cols="50" onChange={e => setRatingText(e.target.value)}> 
                                
                                                        </textarea>
                                                    </div>
                                                    <button className="ratingButton">Send rating</button>
                                                </form>
                                            </div>
                                        )
                                    } else {
                                        return (
                                            <div id="ownRating">
                                                <p>Log in to give a rating for the movie.</p>
                                            </div>
                                        )
                                    }
                                })()}
                                <DisplayOthersRatings />
                            </div>
                        </div>
                    </div>
            </div>
        </>
    );
}

export default SpecificMoviePage
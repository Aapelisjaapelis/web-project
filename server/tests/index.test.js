import request from "supertest"
import app from "../index.js"
import { pool } from "../helpers/database.js"
import { hash } from "bcrypt"

describe("Registration", () => {
    beforeAll(async () => {
        await pool.query("Delete from review")
        await pool.query("Alter sequence review_id_seq restart")
        await pool.query("Delete from account_moviegroup")
        await pool.query("Delete from moviegroup")
        await pool.query("Alter sequence moviegroup_id_seq restart")
        await pool.query("Delete from account")
        await pool.query("Alter sequence account_account_id_seq restart")
    })

    afterAll(async () => {
        await pool.query("Delete from account")
        await pool.query("Alter sequence account_account_id_seq restart")

    })

    it("Should register a user", async () => {
        const response = await request(app)
            .post("/user/register")
            .send({username: "TestUser", email: "test.email@test.com", password: "Password1"})

        expect(response.statusCode).toBe(201)
        expect(response.body.id).toBe(1)
        expect(response.body.username).toBe("TestUser")
        expect(response.body.email).toBe("test.email@test.com")
    })

    it("Should not allow empty usernames", async () => {
        const response = await request(app)
            .post("/user/register")
            .send({username: "", email: "tester.email@test.com", password: "Password2"})

        expect(response.statusCode).toBe(400)
        expect(response.body.message).toBe("Invalid username")
    })

    it("Should not allow duplicate usernames", async () => {
        const response = await request(app)
            .post("/user/register")
            .send({username: "TestUser", email: "testing.email@test.com", password: "Password4"})

        expect(response.statusCode).toBe(400)
        expect(response.body.message).toBe("Username already in use")
    })

    it("Should not allow duplicate emails", async () => {
        const response = await request(app)
            .post("/user/register")
            .send({username: "Goofy", email: "test.email@test.com", password: "Password5"})

        expect(response.statusCode).toBe(400)
        expect(response.body.message).toBe("Email already in use")
    })

    it("Should not allow empty emails", async () => {
        const response = await request(app)
            .post("/user/register")
            .send({username: "Garfield", email: "", password: "Password6"})

        expect(response.statusCode).toBe(400)
        expect(response.body.message).toBe("Invalid email")
    })

    it("Should not allow empty passwords", async () => {
        const response = await request(app)
            .post("/user/register")
            .send({username: "John", email: "john.doe@email.com", password: ""})

        expect(response.statusCode).toBe(400)
        expect(response.body.message).toBe("Invalid password")
    })

    it("Should not allow passwords with less than 8 characters", async () => {
        const response = await request(app)
            .post("/user/register")
            .send({username: "Jane", email: "jane.doe@email.com", password: "Secret9"})

        expect(response.statusCode).toBe(400)
        expect(response.body.message).toBe("Invalid password")
    })

    it("Should not allow passwords without any numbers", async () => {
        const response = await request(app)
            .post("/user/register")
            .send({username: "Random", email: "random.email@random.com", password: "Password"})

        expect(response.statusCode).toBe(400)
        expect(response.body.message).toBe("Invalid password")
    })

    it("Should not allow passwords without any capital letters", async () => {
        const response = await request(app)
            .post("/user/register")
            .send({username: "Monkey", email: "monkey.monkey@animal.com", password: "password7"})

        expect(response.statusCode).toBe(400)
        expect(response.body.message).toBe("Invalid password")
    })
})


describe("Login", () => {

    beforeAll(async () => {

        const username = "TestUser";
        const email = "testi@testi.com";
        const password = "Testitesti1";
        const hashedPassword = await hash(password, 10); 
        await pool.query(
            "INSERT INTO account (username, email, password, is_public) VALUES ($1, $2, $3, $4)",
            [username, email, hashedPassword, "false"]
        );
    });

    afterAll(async () => {
        await pool.query("Delete from account")
        await pool.query("Alter sequence account_account_id_seq restart")
    })

    it("Should not allow a login with a wrong password", async () => {
        const response = await request(app)
            .post("/user/login")
            .send({email: 'testi@testi.com', password: "Testitesti2"})

        expect(response.statusCode).toBe(401)
        expect(response.body.message).toBe("Invalid password")
    })   

    it("Should not allow a login with a wrong email", async () => {
        const response = await request(app)
            .post("/user/login")
            .send({email: "randomemail@email.com", password: "Testitesti1"})

        expect(response.statusCode).toBe(401)
        expect(response.body.message).toBe("Invalid email")
    })   

    it("Should succesfully login with correct credentials", async () => {
        const loginResponse = await request(app)
            .post("/user/login")
            .send({email: "testi@testi.com", password: "Testitesti1"})

        const token = loginResponse.headers.authorization;

        const response = await request(app)
            .get('/group/getGroups')
            .set('Authorization', `${token}`);

        expect(loginResponse.statusCode).toBe(200)
        expect(response.statusCode).toBe(200)
    })   
})

describe("Reviews", () => {
    beforeAll(async () => {
        await pool.query("Delete from review")
        await pool.query("Alter sequence review_id_seq restart")
        await pool.query("Delete from account")
        await pool.query("Alter sequence account_account_id_seq restart")

        const username = "TestUser";
        const email = "testi@testi.com";
        const password = "Testitesti1";
        const hashedPassword = await hash(password, 10); 
        await pool.query(
            "INSERT INTO account (username, email, password, is_public) VALUES ($1, $2, $3, $4)",
            [username, email, hashedPassword, "false"]
        );

        await pool.query(
            "insert into review (account_id, movie_id, rating, review_text) values ($1, $2, $3, $4) returning *",
            [1,1,5, 'TestReview']
        );

    })

    afterAll(async () => {
        await pool.query("Delete from review")
        await pool.query("Alter sequence review_id_seq restart")
        await pool.query("Delete from account")
        await pool.query("Alter sequence account_account_id_seq restart")
    })

    it("Should post a review", async () => {
        const loginResponse = await request(app)
        .post("/user/login")
        .send({email: "testi@testi.com", password: "Testitesti1"})

        const token = loginResponse.headers.authorization;

        const response = await request(app)
            .post("/movie/createReview")
            .send({movieId: 1, userId: 1, ratingNumber: 4, ratingText: "TestReview2"})
            .set('Authorization', `${token}`);

        expect(loginResponse.statusCode).toBe(200)
        expect(response.statusCode).toBe(200)
        expect(response.body.id).toBe(2)
    })

    it("Should get all movies reviews", async () => {
        const loginResponse = await request(app)
            .post("/user/login")
            .send({email: "testi@testi.com", password: "Testitesti1"})

        const token = loginResponse.headers.authorization;

        const response = await request(app)
            .get("/movie/allReviews/1" )
            .set('Authorization', `${token}`);

        expect(loginResponse.statusCode).toBe(200)
        expect(response.statusCode).toBe(200)
    })

    it("Should edit a movie review", async () => {
        const loginResponse = await request(app)
            .post("/user/login")
            .send({email: "testi@testi.com", password: "Testitesti1"})

        const token = loginResponse.headers.authorization;

        const response = await request(app)
            .put("/movie/updateReview" )
            .send({id: 1, ratingNumber: 1, ratingText: "TestR435345"})
            .set('Authorization', `${token}`);

        expect(loginResponse.statusCode).toBe(200)
        expect(response.statusCode).toBe(200)
        expect(response.body.id).toBe(1)
    })
})

describe("Favorites", () => {
    beforeAll(async () => {
        await pool.query("Delete from favorites")
        await pool.query("Alter sequence favorites_id_seq restart")
        await pool.query("Delete from account")
        await pool.query("Alter sequence account_account_id_seq restart")

        const username = "TestUser";
        const email = "testi@testi.com";
        const password = "Testitesti1";
        const hashedPassword = await hash(password, 10); 
        await pool.query(
            "INSERT INTO account (username, email, password, is_public) VALUES ($1, $2, $3, $4)",
            [username, email, hashedPassword, "false"]
        )

        await pool.query(
            "INSERT INTO favorites(account_id, movie_id, movie_name, poster_path) VALUES ($1, $2, $3, $4)",
                [1, 6511, 'The Consequence', '/5b2rC6cgglPMab6LbQauTfBJmv2.jpg']
            )
    })

    afterAll(async () => {
        await pool.query("Delete from favorites")
        await pool.query("Alter sequence favorites_id_seq restart")
        await pool.query("Delete from account")
        await pool.query("Alter sequence account_account_id_seq restart")
    })

    it("Should add a movie to favorites", async () => {
        const loginResponse = await request(app)
            .post("/user/login")
            .send({email: "testi@testi.com", password: "Testitesti1"})

        const token = loginResponse.headers.authorization;

        const response = await request(app)
            .post("/favorites/addFavorite")
            .send({id: 1, movie_id: 65436, movie_name: "Class Dismissed: How TV Frames the Working Class", poster_path: "/owklDSPj9KLl6MryrFun0pSUFW5.jpg"})
            .set('Authorization', `${token}`)

        expect(loginResponse.statusCode).toBe(200)
        expect(response.statusCode).toBe(200)
        expect(response.body.message).toBe("Added to favorites")
    })

    it("Should get all movies account has in favorites", async () => {
        const loginResponse = await request(app)
        .post("/user/login")
        .send({email: "testi@testi.com", password: "Testitesti1"})

        const token = loginResponse.headers.authorization;

        const response = await request(app)
            .get("/favorites/myFavorites/1")
            .set('Authorization', `${token}`);

        expect(response.statusCode).toBe(200)
    })

    it("Should check if movie is a favorite of this account (is favorite)", async () => {
        const loginResponse = await request(app)
        .post("/user/login")
        .send({email: "testi@testi.com", password: "Testitesti1"})

        const token = loginResponse.headers.authorization;

        const response = await request(app)
            .get("/favorites/isMovieFavorite/1/65436")
            .set('Authorization', `${token}`);

        expect(response.statusCode).toBe(200)
        expect(response.body.favorite).toBe("yes")
    })

    it("Should check if movie is a favorite of this account (is not favorite)", async () => {
        const loginResponse = await request(app)
        .post("/user/login")
        .send({email: "testi@testi.com", password: "Testitesti1"})

        const token = loginResponse.headers.authorization;

        const response = await request(app)
            .get("/favorites/isMovieFavorite/1/653436")
            .set('Authorization', `${token}`);

        expect(response.statusCode).toBe(200)
        expect(response.body.favorite).toBe("no")
    })

    it("Should remove a movie from favorites", async () => {
        const loginResponse = await request(app)
        .post("/user/login")
        .send({email: "testi@testi.com", password: "Testitesti1"})

        const token = loginResponse.headers.authorization;

        const response = await request(app)
            .delete("/favorites/removeFavorite/1/65436")
            .set('Authorization', `${token}`);

        expect(response.statusCode).toBe(200)
        expect(response.body.message).toBe("Successfully removed from favorites")
    })
})

describe("Delete user", () => {
    beforeAll(async () => {
        await pool.query("Delete from account")
        await pool.query("Alter sequence account_account_id_seq restart")

        const username = "TestUser";
        const email = "testi@testi.com";
        const password = "Testitesti1";
        const hashedPassword = await hash(password, 10); 
        await pool.query(
            "INSERT INTO account (username, email, password, is_public) VALUES ($1, $2, $3, $4)",
            [username, email, hashedPassword, "false"]
        );

        await pool.query(
            "insert into review (account_id, movie_id, rating, review_text) values ($1, $2, $3, $4) returning *",
            [1,1,5, 'TestReview']
        );
    })

    afterAll(async () => {
        await pool.query("Delete from review")
        await pool.query("Alter sequence review_id_seq restart")
        await pool.query("Delete from account")
        await pool.query("Alter sequence account_account_id_seq restart")
        await pool.end()
    })

    it("Should not delete a user which id does not exist", async () => {
        const loginResponse = await request(app)
        .post("/user/login")
        .send({email: "testi@testi.com", password: "Testitesti1"})

        const token = loginResponse.headers.authorization;

        const response = await request(app)
            .delete("/user/profile/3")
            .set('Authorization', `${token}`);

        expect(loginResponse.statusCode).toBe(200)
        expect(response.statusCode).toBe(400)
        expect(response.body.message).toBe("Account not found")
    })

    it("Should delete the user", async () => {
        const loginResponse = await request(app)
        .post("/user/login")
        .send({email: "testi@testi.com", password: "Testitesti1"})

        const token = loginResponse.headers.authorization;

        const response = await request(app)
            .delete("/user/profile/1")
            .set('Authorization', `${token}`);

        expect(loginResponse.statusCode).toBe(200)
        expect(response.statusCode).toBe(200)
        expect(response.body.message).toBe("Account deleted")
    })
})
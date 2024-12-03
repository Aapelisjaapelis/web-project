import request from "supertest"
import app from "../index.js"
import { pool } from "../helpers/database.js"

describe("Registration", () => {
    beforeAll(async () => {
        await pool.query("Delete from account")
        await pool.query("Alter sequence account_account_id_seq restart")
    })

    afterAll(async () => {
        await pool.end()
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

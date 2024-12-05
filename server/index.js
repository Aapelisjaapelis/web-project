import express from "express"
import cors from "cors"
import userRouter from "./routers/userRouter.js"
import groupRouter from "./routers/groupRouter.js"
import profileRouter from "./routers/profileRouter.js"

const port = process.env.PORT
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use("/user", userRouter)
app.use("/group", groupRouter)
app.use("/profile", profileRouter)

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    res.status(statusCode).json({
        message: err.message
    })
})


app.listen(port)


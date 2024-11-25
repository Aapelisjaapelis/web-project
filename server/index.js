import express from "express"
import cors from "cors"
import userRouter from "./routers/userRouter.js"

const port = process.env.PORT
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use("/user", userRouter)

app.use((err, req, res, next) => {              // A global error handler 
    const statusCode = err.statusCode || 500
    res.status(statusCode).json({
        message: err.message
    })
})

app.listen(port)

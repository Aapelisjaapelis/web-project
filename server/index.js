import express from "express"
import cors from "cors"
import userRouter from "./routers/userRouter.js"
import jwt from "jsonwebtoken"

const port = process.env.PORT
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use((req,res,next) => {
    res.authorizationHeader = (email) => {
      const access_token = jwt.sign({email: email}, process.env.JWT_SECRET_KEY, {expiresIn: '15m'})
      return res.header('Access-Control-Expose-Headers','Authorization')
                .header('Authorization','Bearer ' + access_token)
    }
    next()
})

app.use("/user", userRouter)

app.use((err, req, res, next) => {              // A global error handler 
    const statusCode = err.statusCode || 500
    res.status(statusCode).json({
        message: err.message
    })
})

app.listen(port)

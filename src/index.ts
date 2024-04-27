import express from "express";
import envConfig from "./config/dotenv";
import postRouter from "./routers/posts.route";
import userRouter from "./routers/users.route";
import cookieP from "cookie-parser"
import dotenv from "./config/dotenv";

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieP(dotenv.SECRET_COOKIE))

app.get("/", (req, res)=>{
    res.send("hola")
})
app.use(userRouter)
app.use(postRouter)

const port = envConfig.PORT
app.listen(port, () => console.log(`Escuchando al puerto ${port}`))

export default app
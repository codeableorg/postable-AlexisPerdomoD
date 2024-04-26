import express from "express";
import envConfig from "./config/dotenv";
import postRouter from "./routers/posts.route";
import userRouter from "./routers/users.route";

const app = express()
app.use(express.json())

app.use(postRouter)
app.use(userRouter)

const port = envConfig.PORT
app.listen(port, () => console.log(`Escuchando al puerto ${port}`))

export default app

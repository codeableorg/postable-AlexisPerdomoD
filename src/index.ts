import express from "express";
import envConfig from "./config/dotenv.config";
import postRouter from "./routers/posts.route";
import userRouter from "./routers/users.route";
import cookieP from "cookie-parser"
import logger, {loggerMidleware} from "./config/logger.config";

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieP(envConfig.SECRET_COOKIE))

app.use(loggerMidleware)
app.use(userRouter)
app.use(postRouter)

const port = envConfig.PORT
app.listen(port, () => logger.info(`Escuchando al puerto ${port}`))

export default app

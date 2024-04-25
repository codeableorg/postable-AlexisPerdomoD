import {config} from "dotenv";

config({
    path:__dirname + ".env"
})

export default {
    db: process.env.DB,
    port:process.env.PORT
}
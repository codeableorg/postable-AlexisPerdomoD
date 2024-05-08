import {Request, Response} from "express"
import winston, {transports, format} from "winston"
import envConfig from "./dotenv.config"
const custom ={
    levels:{
        fatal:0,
        error:1, 
        warning:2,
        info:3,
        debug:4,
        http:5
    },
    colors:{
        fatal:"red",
        error:"orange",
        waring:"yellow",
        info:"green",
        debug:"white",
        http:"blue"
    }
}
const logger = winston.createLogger({
    levels: custom.levels,
    transports:[
        new transports.Console({
            level:envConfig.MODE === "PRO" ? "info" : "http",
            format: format.combine(
                format.colorize({colors:custom.colors}),
                format.simple()
            )
        })
    ]
})
envConfig.MODE === "PRO" 
    && logger.transports.push(new transports.File({
        level:"warning",
        filename:"./info/errors.log",
        format: format.simple()
    }))

export const loggerMidleware = (req:Request, _res:Response, next:Function)=>{
    logger.http(`${req.method} request in http://${req.headers.host} - ${new Date().toLocaleTimeString()}`)
    next()
}

export default logger
    

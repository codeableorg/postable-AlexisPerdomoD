import { Pool } from "pg";
import dotenv from "./dotenv.config";
import logger from "./logger.config";
const {PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID} = dotenv
const pool = new Pool({
    host: PGHOST,
    database: PGDATABASE,
    user: PGUSER,
    password: PGPASSWORD,
    port: 5432,
    ssl:true,
  });
// the pool will emit an error on behalf of any idle clients
// it contains if a backend error or network partition happens
pool.on('error', (err, _client) => {
    logger.log("fatal", 'Unexpected error on idle client' + err)
    process.exit(-1)
  })

const connectPG = async() =>{
    try {
        const client = await pool.connect()
        logger.info("cliente conectado adecuadamente a la base de datos")
        return client
    } catch (error) {
        logger.log("fatal" , error)  
        process.exit(-1)
    }
}
export default connectPG

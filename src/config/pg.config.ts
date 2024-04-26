import { Pool } from "pg";
import dotenv from "./dotenv";
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
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
  })

const connectPG = async() =>{
    try {
        const client = await pool.connect()
        console.log("cliente conectado adecuadamente a la base de datos")
        return client
    } catch (error) {
        console.log(error)  
        process.exit(-1)
    }
}
export default connectPG
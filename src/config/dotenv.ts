import {config} from "dotenv";

config({
    path:".env"
})
let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID, PORT } = process.env;
export default {PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID, PORT }
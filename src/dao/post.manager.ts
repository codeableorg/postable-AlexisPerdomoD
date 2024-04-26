import { PoolClient, QueryConfig, QueryResult } from "pg";
import { Query } from "../models/general.model";
import { FormatedPost } from "../models/schemas.model";

export default class PostManager{
    #getDB:()=> Promise<PoolClient>
    constructor(getDB:()=> Promise<PoolClient>){
        this.#getDB = getDB
        }
    async getPosts(querys:Query){
        try {
            const client = await this.#getDB()
            const {orderBy, order, limit, page, username} = querys
            const offset = page === 1 ? 0 : (page - 1) * limit
            const SQLQuery:QueryConfig = {
                text:`
                    SELECT p.id, p.title, p.content, u.username AS username,
                    COUNT(l.post_id) AS likesCount
                    FROM Posts AS p
                    INNER JOIN Users AS u ON p.user_id = u.id
                    LEFT JOIN Likes AS l ON p.id = l.post_id
                    GROUP BY p.id, p.title, p.content, u.username
                    ORDER BY $1 $2 LIMIT $3 OFFSET $4
                    `,
                values : [orderBy, order, limit, offset]
            }
            let response:QueryResult<FormatedPost>;
            if(username){
                //post the user have wroten
                SQLQuery.text += " AND u.username = $5;"
                SQLQuery.values?.push(username)
                 response =  await client.query(SQLQuery)
            }
            SQLQuery.text += ";"
            response =  await client.query(SQLQuery)
            return {
                ok:true,
                data:response.rows,
                pagination:{
                    page,
                    pageSize: limit,
                    totalItems:response.rowCount,
                    totalPages:Math.ceil((response.rowCount || 0)/limit),
                    nextPage: null,
                    previousPage: null, 
                }
            }
        } catch (error) {
            console.error(error)
            return {
                error:true,
                message:"internal error server",
                status:500
            }
        }
    }
    async createPost(){}
}

// para buscar post a los cuales un usuario en especifico ha dado like 
//WHERE l.user_id = id_usuario_especifico
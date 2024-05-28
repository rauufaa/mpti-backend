import mysql from "mysql2/promise"
import dotenv from "dotenv"
import { ResponseError } from "../error/response-error.js";

dotenv.config({
    path:'./.env'
})


const databasePoolConfig ={
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  connectTimeout: 60000
}

// const query = async (query, params) => {
//     const connection = await mysql.createConnection(databaseConfig);
//     const [results, fields] = await connection.execute(query, params);

//     return results;
// }

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: "root",
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
    idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
});

const databaseQuery = async (query, params) => {
    // For pool initialization, see above
    try {
        const conn = await pool.getConnection();
         // Do something with the connection
         console.log(query)
        const [results, fields] = await conn.execute(query, params);

        // Don't forget to release the connection when finished!
        conn.release();
        return [results, fields];
    } catch (error) {
        throw new ResponseError(500, error);  
        // console.log("Smothing wrong") 
    }
    
}

const databaseQueryFirst = async(query, params) => {
    // For pool initialization, see above
    try {
        const conn = await pool.getConnection();
         // Do something with the connection
        const [results, fields] = await conn

        // Don't forget to release the connection when finished!
        conn.release();
        return [results, fields];
    } catch (error) {
        throw new ResponseError(500, "Server Error");  
        // console.log("Smothing wrong") 
    }
    
}


export {
    databaseQuery
}
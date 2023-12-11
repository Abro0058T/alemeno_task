const mysql=require('mysql')
const dotenv=require('dotenv')
dotenv.config()
const connection=mysql.createConnection({
    host:process.env.SQL_HOST,
    user:process.env.SQL_USER,
    password:process.env.SQL_PASSWORD,
    database:process.env.DATABASE
});

module.exports=connection;
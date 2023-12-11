const express=require("express")
const app=express()
const port=process.env.PORT || 4000;
const customerRoute=require("./Routes/customerRoute")
const bodyParser=require("body-parser")

process.on("uncaughtException", (err) => {
    console.log(`Error:${err.message}`);
    console.log(`Shutting down the server due too uncaught error`);
    process.exit(1);
  });
app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

const connection =require("./utilis/sqlConnection")
connection.connect((err)=>{
    if(err) throw err;
    console.log("Sql connected");
})
app.use('/api/',customerRoute)


app.listen(port,()=>{
    console.log(`Server listenining to port ${port}`)
})
process.on("unhandledRejection", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to unhandled pormise rejection`);
  
    server.close(() => {
      process.exit(1);
    });
  });


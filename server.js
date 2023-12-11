const express=require("express")
const app=express()
const port=process.env.PORT || 4000;
const customerRoute=require("./Routes/customerRoute")
const bodyParser=require("body-parser")
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

import express from "express";
import mysql from "mysql";

var connection=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"ecommerce_db",
    port: 3306
})

 connection.connect((err)=>{
    if(err){
        console.log("DB failure",err)
    }
    console.log("DB connection successful")
 })

var app=express();
app.use(express.json())
app.post("/signup",(req,res)=>{
   const{username,password,role}=req.body;
validate({username,password,role},res)

const dbQuery="insert into users(username,password,role) values(?,?,?)";
const dbValues=[username,password,role]
connection.query(dbQuery,dbValues,(err,dbResult)=>{
      if(err){
        res.status(500).json({error:true,message:"something went wrong"})
        return
      }
      res.status(201).json({error:false,message:"User Signup Success!"})
})
   
})

 function validate(dataobj,res){
   
    const errorResults=Object.keys(dataobj).map(key=>{
        if(!dataobj[key]){
            return{
                field:key,
                message:`${key} cannot be empty`,
                error:true
            }
        }
        else{
            return{
                error:false
            }
        }
    }).filter(obj=>{
        return obj.error
    })
    if(errorResults.length){
        res.status(400).json({error:true,data:errorResults})
        throw("Bad Request Exception")
    }
    
 }

 app.listen(3000)
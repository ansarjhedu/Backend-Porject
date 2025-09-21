import dotenv from 'dotenv'
import connectDB from './db/dbconnection.js'
import { app } from './app.js'
dotenv.config({
    path:'./env'
})

connectDB()
.then(()=>{
    app.listen(process.env.PORT||3000,()=>{
        console.log(`App is listening at port http://localhost:${process.env.PORT}`)
    })
    app.on('error',(error)=>{
        console.log("error:" ,error)
        throw error;
    })
})
.catch((err)=>{
    console.log("DB conncetion failed", err)
})
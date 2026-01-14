const mongoose = require("mongoose")

const Connection = async()=>{
    try {
        const connect = await mongoose.connect("mongodb+srv://nayansigupta29_db_user:WfYLWMkidO24IOwB@cluster0.inopu3a.mongodb.net/")
        if(connect){
            console.log("database connected")
        }else{
            console.log("not connected to database")
        }
    } catch (error) {
        console.log("database error" , error)
    }
}

module.exports= Connection;
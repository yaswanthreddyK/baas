import mongoose from "mongoose";


export default async function dbConnect(){
    try {
        const connection = mongoose.connect(process.env.MONGODB_URI)
        if(connection){
            console.log('DB Connected')
        }else{
            console.log('DB connection failed! at dbConnect()')
            process.exit(1)
        }
    } catch (error) {
        console.log('DB connection error: ', error)
        process.exit(1)
    }
}
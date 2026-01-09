import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config()


export async function connectDb() {
    try {
        //connect to database

        const mongoUrL = process.env.MONGO_URL;
        if (!mongoUrL) {
            throw new Error("MONGO_URL is not defined in the environment variables");
        }
        const connection = await mongoose.connect(mongoUrL);
        mongoose.set('strictPopulate', false);
         if(connection) {
            console.log('Database connected succesfully.');
         }


    } catch (error) {
        console.log("Error connecting Database serverside.")
    }
}
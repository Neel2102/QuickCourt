import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const URI = process.env.MONGODB_URL;

export const connection = () => {
    mongoose.connect(URI, {
        dbName: `MERN_AUTHENTICATION`
    }).then(() => {
        console.log(`Mongo DB IS CONNECTED`)
    }).catch(err => {
        console.log(`some error occured while connecting : ${err}`);
    });
};

export default connection;

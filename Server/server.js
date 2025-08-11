import express from "express";
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import cors from "cors";
import {connection} from "./database/dbconnection.js";
// import {errorMiddleware} from "./middlewares/error.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import dashboardRouter from './routes/dashboardRoutes.js';
import venueRouter from './routes/venueRoutes.js';

export const app = express();

dotenv.config({path: './.env', quiet: true});

const port = process.env.PORT || 4000;

app.use(cors({
    origin: process.env.FRONT_URL || "http://localhost:5173",
    methods:["GET", "POST", "PUT", "DELETE"],
    credentials: true,
})
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connection();

// app.use(errorMiddleware)

app.get('/', (req,res)=> res.send("API is working"))
app.get('/test', (req,res)=> res.json({message: "Server is running"}))
app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)
app.use('/api/venues', venueRouter);
app.use('/api/dashboard', dashboardRouter);

app.listen(port, ()=>
   console.log(`Sever listening on port ${port}
`));
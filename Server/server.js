import express from "express";
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import cors from "cors";
import {connection} from "./database/dbconnection.js";
// import {errorMiddleware} from "./middlewares/error.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import venueRouter from './routes/venueRoutes.js';
import courtRouter from './routes/courtRoutes.js';
import bookingRouter from './routes/bookingRoutes.js';
import adminRouter from './routes/adminRoutes.js';

import dashboardRouter from './routes/dashboardRoutes.js';

export const app = express();

dotenv.config({path: './.env', quiet: true});

const port = process.env.PORT || 4000;

app.use(cors({
    origin: [
        process.env.FRONT_URL || "http://localhost:5173",
        "http://localhost:5174"
    ],
    methods:["GET", "POST", "PUT", "DELETE"],
    credentials: true,
})
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connection();

// app.use(errorMiddleware)

app.get('/', (req,res)=> res.send("API is working"));
app.get('/test', (req,res)=> res.json({message: "Server is running"}));
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/courts', courtRouter); 
app.use('/api/bookings', bookingRouter); 
app.use('/api/admin', adminRouter);
app.use('/api/venues', venueRouter);
app.use('/api/dashboard', dashboardRouter);

// Global error handler - ensure we always return JSON
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message
  });
});

// 404 handler for API routes
app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

app.listen(port, ()=>
   console.log(`Sever listening on port ${port}
`));
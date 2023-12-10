import express from 'express'
import { databseConfiguration } from './Database/Database.js';
import { userRoutes } from './Routes/UserRoutes.js';
import cookieParser from 'cookie-parser';
import { config } from 'dotenv';

import cors from 'cors'

config({
    path: './Dotenv/config.env'
})

const app = express();

export const database = databseConfiguration.connect((err) => {

    if (err) {
        console.log("Error")
    } else {
        console.log("Connected")
    }
});
//Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "PUT", "POST", "DELETE"],
    credentials: true,
}))

//Routes middlewares
app.use('/user', userRoutes);

app.listen(5000, () => {
    console.log("Server is ready");
})
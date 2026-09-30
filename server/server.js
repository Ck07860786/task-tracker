import dotenv from 'dotenv';
import express from "express";
import connectDB from './config/db.js';

dotenv.config();

const app = express();

connectDB();


const PORT = process.env.PORT || 5000;

app.use(express.json())

app.get('/', (req, res) => {
    res.send('server running smoothly!');
})



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

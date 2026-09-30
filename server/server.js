import dotenv from 'dotenv';
import express from "express";
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.routes.js';

dotenv.config();

const app = express();

connectDB();

const PORT = process.env.PORT || 5000;

// middlewares
app.use(cors());
app.use(express.json());

// routes
app.get('/', (req, res) => {
    res.send('server running smoothly!');
});

app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


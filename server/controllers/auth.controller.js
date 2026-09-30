import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { comparePassword, generateToken, hashPassword } from '../helper/authHelper.js';



// register user
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        //alredy exist
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'User with this email already exists.',
            });
        }

        // hash password
        const encryptPassword = await hashPassword(password);


        const user = await User.create({
            name,
            email,
            password: encryptPassword,
        });

        // Generate token
        const token = generateToken(user._id);


        res.status(201).json({
            success: true,
            message: 'User registered successfully.',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                },
                token,
            },
        });
    } catch (error) {
        console.error('Register Error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again later.',
        });
    }
};


// login user
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;


        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password.',
            });
        }

        // Compare password
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password.',
            });
        }

        const token = generateToken(user._id);


        res.status(200).json({
            success: true,
            message: 'Login successful.',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                },
                token,
            },
        });
    } catch (error) {
        console.error('Login Error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again later.',
        });
    }
};

// show user
export const getMe = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            data: {
                user: {
                    id: req.user._id,
                    name: req.user.name,
                    email: req.user.email,
                },
            },
        });
    } catch (error) {
        console.error('GetMe Error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again later.',
        });
    }
};

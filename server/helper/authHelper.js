import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });
}

export const hashPassword = async (password) => {

    const saltRound = 10;
    const encrypt = await bcrypt.hash(password, saltRound)
    return encrypt
}

export const comparePassword = async (password, encrypt) => {
    return bcrypt.compare(password, encrypt)
}
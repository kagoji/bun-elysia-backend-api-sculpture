// jwt.ts
import jwt from 'jsonwebtoken';
import config from '../utility/config';


const SECRET_KEY = config.jwt_secret; // Change this to a secure key

export const generateToken = (payload: object): string => {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' }); // Set the token expiration as needed
};

export const verifyToken = (token: string): object | any => {
    try {
        // `jwt.verify` will throw an error if the token is invalid or expired.
        const decoded = jwt.verify(token, SECRET_KEY);

        return decoded; // Return the decoded token data (e.g., user info, exp)
    } catch (err:unknown) {
        // Handle different types of errors
        const error = err as Error;
        if (error.name === 'TokenExpiredError') {
            throw new Error('Token has expired');
        } else if (error.name === 'JsonWebTokenError') {
            throw new Error('Invalid token');
        } else {
            throw new Error('Token verification failed');
        }
    }
};
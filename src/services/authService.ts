import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();


const JWT_SECRET = process.env.JWT_SECRET as string;


export class AuthService {
    
    public static generateToken(payLoad_User: object): string {
       return jwt.sign(payLoad_User, JWT_SECRET, {expiresIn: "2h" });
    }

    public static verifyToken(token: string): any {
        try {
            return jwt.verify(token, JWT_SECRET);
        }
        catch(error) {
            return null;
        }
    }
}
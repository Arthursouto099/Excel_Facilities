import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/authService";
import { RequestLogged } from "../helpers/requestLogged";
import { RawQueryArgs } from "@prisma/client/runtime/library";



export const isLogged = async(req: RequestLogged, res: Response, next: NextFunction) => {

    const authHeader = req.headers.authorization

    if(!authHeader) {
        res.status(400).json({message: "Token não fornecido"})
        return
    }
    
    const token = authHeader?.split(" ")[1]

    const decoded = AuthService.verifyToken(token as string)

    if (!decoded) {
        res.status(401).json({ error: "Token inválido ou expirado." });
        return
    }

    req.user = decoded;

    next()
}
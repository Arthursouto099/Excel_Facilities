import { Request, Response } from "express";
import { UserModel } from "../models/UserModel";


export class UserController {


    static async getUsers(req: Request, res: Response) {
        try {
            const users = await UserModel.getUsers();
            if(users.length < 1) {return res.status(200).json({message: "Não Existe usuarios cadastrados"})};
            res.json
        }

        catch(e: unknown) {
            console.log("Erro Interno: ", e);
        }
    }
}
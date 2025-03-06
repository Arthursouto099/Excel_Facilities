import { Request, Response } from 'express'
import { AuthService } from '../services/authService'
import { UserModel } from '../models/UserModel';
import bcrypt from "bcrypt"
import crypto from "crypto"

class AuthController {


    public static async login(req: Request, res: Response): Promise<void> {

        try {
            const { email, password } = req.body;

            if (!email || !password) {
                res.status(400).json({ message: "Dados Invalidos" });
                return
            }

            const user = await UserModel.getUserByEmail(email);

            if (user === null) {
                res.status(400).json("Usuario não encontrado");
                return
            }

            const compare = await bcrypt.compare(password, user.password);

            if (!compare) {
                res.status(400).json({ message: "Senha incorreta" })
                return
            }

            const token = AuthService.generateToken({
                email: user.email,
                id_user: user.id_user
            });

            res.status(200).json({ token});
        }
        catch (error) {
            console.log(error)
            res.status(500).json({ message: "Erro interno" })
        }
    }


    public static async register(req: Request, res: Response): Promise<void> {
        try {
            const { name, email, password, age, contact, state, cpf } = req.body;

            if (!name || !email || !password || !age || !contact || !state || !cpf) {
                res.status(400).json({ message: "Todos os dados são obrigatorios" })
                return
            }

            const user = new UserModel(crypto.randomUUID(), name, email, age, password, contact, state, cpf);

            const insert = await user.insertUser();

            if (!insert) throw new Error();

            const token = AuthService.generateToken({
                email: user.email,
                id_user: user.id_user
            });

            res.status(200).json({ token })
            return



        }

        catch (error) {
            res.status(500).json({ message: "Erro interno" })
        }
    }
}

export default AuthController;
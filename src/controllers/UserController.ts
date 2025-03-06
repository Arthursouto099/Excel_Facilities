import { Request, Response } from "express";
import { UserModel } from "../models/UserModel";
import { users } from "@prisma/client";
import ExcelJS from "exceljs"
import fs, { cp } from "fs";

export class UserController {


    static async getUsers(req: Request, res: Response) {
        try {
            const users = await UserModel.getUsers();
            if (users.length < 1) {
                res.status(200).json({ message: "Não Existe usuarios cadastrados" })
                return
            };
            res.status(200).json({ data: users });
        }

        catch (e: unknown) {
            console.log("Erro Interno: ", e);
            res.status(500).json({ message: "Erro interno" })
        }
    }

    static async getSpreadsheet(req: Request, res: Response) {
        const workbook = new ExcelJS.Workbook();
        // planilha do excel
        const worksheet = workbook.addWorksheet("Usuarios");

        try {

            worksheet.columns = [
                { header: "EMAIL", key: "email", width: 30 },
                { header: "NAME", key: "name", width: 30 },
                { header: "AGE", key: "age", width: 10 },
                { header: "CONTACT", key: "contact", width: 30 },
                { header: "STATE", key: "state", width: 10 },
                { header: "CPF", key: "cpf", width: 30 }

            ]

            const users: Array<users> | Array<[]> = await UserModel.getUsers();

            worksheet.getRow(1).font = { bold: true, size: 14 }
            worksheet.getRow(1).fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "D3D3D3" }
            }

            worksheet.getRow(1).alignment = { horizontal: "center", vertical: "middle" }

            users.forEach((row, index) => {
                const rowIndex = index + 2
                const newRow = worksheet.addRow(row)

                newRow.eachCell((cell) => {
                    cell.border = {
                        top: { style: "medium" },
                        left: { style: "medium" },
                        bottom: { style: "medium" },
                        right: { style: "medium" },
                    }
                    cell.font = { bold: true, size: 10 }
                    cell.alignment = { vertical: "middle", horizontal: "center" }


                })

                switch (row.state) {
                    case "RS":
                        newRow.fill = {
                            type: "pattern",
                            pattern: 'solid',
                            fgColor: { argb: "99e599" }
                        }
                        break
                    case "SC":
                        newRow.fill = {
                            type: 'pattern',
                            pattern: "solid",
                            fgColor: { argb: "68c968" }

                        }
                        break
                }

            })


            res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            res.setHeader("Content-Disposition", "attachment; filename=Users.xlsx");

            await workbook.xlsx.write(res)
            res.end()
        }

        catch(e: unknown) {
            console.log('error', e)
            res.status(500).json({message: "Erro Interno."})

        }
    }

    static async deleteUserByEmail(req: Request, res: Response) {
        try {
            if (!req.params.email) {
                res.status(400).json({ message: "Email é obrigatório" })
                return
            }

            const user: users | null = await UserModel.getUserByEmail(req.params.email);
            if (user !== null) {
                await new UserModel(user.id_user, user.name, user.email, user.age, user.password, user.contact, user.state, user.cpf).deleteUser()
                res.status(200).json({ message: "Usuario com email de " + user.email + " foi deletado com sucesso" })
                return
            }

            res.status(400).json({ message: "Usuario não encontrado" })

        }
        catch (e: unknown) {
            console.log("Erro Interno", e)
            res.status(500).json({ message: "Erro interno" })
        }
    }

    static async updateUser(req: Request, res: Response) {
        try {



            const emailParams: string = req.params.email;
            const passwordParams: string = req.params.password;

            if (!emailParams || !passwordParams) {
                res.status(400).json("Email obrigatorio e senha são obrigatorios;");
                return;
            }

            const user: users | null = await UserModel.getUserByEmail(emailParams);


            if (user === null) {
                res.json(400).json("Este usuario não está cadastrado");
                return;
            }

            const { name, email, password, age, contact, state, cpf } = req.body;

            if (name === undefined && email === undefined && password === undefined && age === undefined && contact === undefined && state === undefined && cpf === undefined) {
                res.status(400).json({ message: "Pelo menos um campo deve ser preenchido" });
                return;
            }

            const updatedUser: Partial<users> = {}

            if (name !== undefined) updatedUser.name = name;
            if (email !== undefined) updatedUser.email = email;
            if (password !== undefined) updatedUser.password = password;
            if (age !== undefined) updatedUser.age = age;
            if (contact !== undefined) updatedUser.contact = contact;
            if (state !== undefined) updatedUser.state = state;
            if (cpf !== undefined) updatedUser.cpf = cpf;



            const updatedAt = new UserModel(user.id_user, user.name, user.email, user.age, user.password, user.contact, user.state, user.cpf);
            updatedAt.updateUser(updatedUser);

            res.status(200).json({ message: `Usuario com email de ${updatedAt.email} foi editado com sucesso` });

        }

        catch (error) {
            console.log(error)
            res.status(500).json({ message: "Erro Interno" });
        }
    }
}
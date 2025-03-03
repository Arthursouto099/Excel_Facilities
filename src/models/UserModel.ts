import prisma from "../client";
import { PrismaClientKnownRequestError} from "@prisma/client/runtime/library";
import { users } from "@prisma/client";
import bcrypt from 'bcrypt'

export class UserModel {
    public id_user: string;
    public name: string;
    public email: string
    public age: number;
    private password: string;

    constructor(id_user: string, name: string, email: string, age: number, password: string) {
        this.id_user = id_user;
        this.name = name;
        this.email = email;
        this.age = age;
        this.password = password;
    }

    public async insertUser(): Promise<boolean> {

        try {

            const hashPassword: string = await bcrypt.hash(this.password, 11);
        
            await prisma.users.create({
                data:
                    { id_user: this.id_user, name: this.name, email: this.email, age: this.age, password: hashPassword }
            });

            return true;
        }
        catch (e: unknown) {
            if (e instanceof PrismaClientKnownRequestError) {
                console.log(e.message);
            }

            else {
                console.log(e);
            }

            return false;


        }

    }

    public static async getUsers(): Promise<users[]> {
        try {
            const userList = await prisma.users.findMany();
            return userList;
        }
        catch (e: unknown) {
            if (e instanceof PrismaClientKnownRequestError) {
                console.log(e.message);
            }

            else {
                console.log(e);
            }

            return [];
        }

    }

    public async updateUser(data: Partial<users>): Promise<boolean> {

        
        if(data.password) data.password = await bcrypt.hash(data.password, 11); 


        try {
            
            await prisma.users.update({ where: { id_user: this.id_user }, data })
            return true;
        }
        catch (e: unknown) {
            if (e instanceof PrismaClientKnownRequestError) {
                console.log(e.message);
            }
            else {
                console.log(e);
            }

            return false;
        }

    }

    public async deleteUser(): Promise<boolean> {
        try {
            await prisma.users.delete({ where: { id_user: this.id_user } });
            return true;
        }

        catch (e: unknown) {
            if (e instanceof PrismaClientKnownRequestError) {
                console.log(e.message);
            }
            else {
                console.log(e)
            }

            return false;
        }

    }


    public static async getUserById(id_user: string): Promise<users | null> {
        try {
            const user = await prisma.users.findUnique({where: {id_user}})

            if(user === null) {throw new Error("Usuario não encontrado")}

            return user

        
        }
        catch(e: unknown) {
            if(e instanceof PrismaClientKnownRequestError) console.log(e.message)
            else console.log(e)
            return null
        }
    }

    public static async getUserByEmail(email: string): Promise<users | null> {
        try {
            const user = await prisma.users.findUnique({where: {email}})

            if(user === null) {throw new Error("Usuario não encontrado")}

            return user

        
        }
        catch(e: unknown) {
            if(e instanceof PrismaClientKnownRequestError) console.log(e.message)
            else console.log(e)
            return null
        }
    }
}
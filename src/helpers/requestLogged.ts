import { Request } from "express"

export interface RequestLogged extends Request {
    user?: {id: string, email: string}
}
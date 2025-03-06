import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { isLogged } from "../middlewares/islogged";


const userRouter = Router();


userRouter.put("/update/:email/:password", UserController.updateUser)
userRouter.delete("/delete/:email", UserController.deleteUserByEmail)
userRouter.get("/all", isLogged, UserController.getUsers)
userRouter.get('/Spreadsheet', isLogged, UserController.getSpreadsheet)

export default userRouter;
import AuthController from "../controllers/authController";
import { Router } from "express";
import userRouter from "./userRouter";
import { isLogged } from "../middlewares/islogged";


const router = Router();

router.use("/user", userRouter)

router.post('/register', AuthController.register)
router.post("/login", AuthController.login);


export default router;
import AuthController from "../controllers/authController";
import { Router } from "express";
import { isLogged } from "../middlewares/islogged";


const router = Router();

router.post('/register', AuthController.register)
router.post("/login", AuthController.login);
router.get("users", isLogged, async (req, res) => {
    res.json("hello")
})


export default router;
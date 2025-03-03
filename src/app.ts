import express from 'express';
import prisma from './client';
import router from './routes/router';
import { isLogged } from './middlewares/islogged';




const app = express();
app.use(express.json())
app.use(router)
const port: number = 4000;





app.listen(port, () => {
    console.log("Running in port http://localhost:" + port );
})


app.get("/user", isLogged, async (req, res)  =>  {
    const users = await prisma.users.findMany();
    res.json(users) 
})

const idRandom = crypto.randomUUID();
console.log(String(idRandom))
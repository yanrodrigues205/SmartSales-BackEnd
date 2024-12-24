import { Router } from "express";
import UserController from "src/Controllers/UserController";

const userRoutes = Router();
const userController = new UserController();


userRoutes.post("/create", (req, res) => {
    userController.createUser(req, res);
});

export default userRoutes;
import { Router } from "express";
import ExampleRoutes from "./Routes/ExampleRoutes";
import userRoutes from "./Routes/UsersRoutes";

export default class AppRouter {
    private router: Router;

    constructor() {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // Adicione as rotas de cada recurso aqui
        this.router.use('/example', ExampleRoutes);
        this.router.use('/users', userRoutes);
    }

    public getRouter(): Router {
        return this.router;
    }
}

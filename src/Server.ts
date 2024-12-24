import express from "express";
import cors from 'cors';
import AppRouter from "./Router";
require("dotenv").config();

export default class Server {
    private port: string;
    private message: string;
    private app: any;

    constructor() {
        this.port = String(9090);
        this.message = String(process.env.SERVER_MESSAGE);
        this.app = express();
    }


    async __init__() {
        const corsOptions = {
            origin: '*',
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
            allowedHeaders: 'Origin,X-Requested-With,Content-Type,Accept,Authorization'
        };
        this.app.use(cors(corsOptions))
        this.app.use(express.json());
        const appRouter = new AppRouter();
        this.app.use(appRouter.getRouter());
        await this.app.listen(this.port, () => {
            console.log(`
                ============================================================
                🚀  Servidor da API iniciado com sucesso!
                ============================================================
                🌐  URL de acesso:        http://localhost:${this.port}
                📅  Data e hora de início: ${new Date().toLocaleString()}
                🌟  Ambiente:             ${process.env.NODE_ENV || "desenvolvimento"}
                📡  Porta em uso:         ${this.port}
                🔒  Política CORS:        ${"Habilitada (Origem: *)"}
                ⚙️   Versão do Node.js:    ${process.version}
                ============================================================
                💡  Dicas:
                - Mantenha o arquivo .env seguro! 🛡️
                - Use "Ctrl+C" para parar o servidor. ⛔
                ============================================================
                `);
        });
    }
}
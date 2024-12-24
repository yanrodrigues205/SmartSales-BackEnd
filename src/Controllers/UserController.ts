import UserDto from "src/Dtos/UserDto";
import UserModel from "src/Models/UserModel";

export default class UserController extends UserModel
{
    constructor()
    {
        super();
    }

    public async createUser(req: any, res: any, internalUse: boolean = false, internalData: Array<UserDto> = [])
    {
        let data : UserDto;

        if(!internalUse)
            data = req.body;
        else
            data = internalData[0];

        if(!data.name || !data.email || !data.password || !data.phone)
        {
            return res.status(400).json({
                message: "Não foi possível concluir a criação do usuário pela falta dos campos(name, email, password).",
                status: 400
            })
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if(!emailRegex.test(data.email))
        {
            return res.status(422).json({
                message: "Esse não é um valor válido para um endereço de email.",
                status: 422
            });
        }

        if(data.password.length < 8)
        {
            return res.status(422).json({
                message: "A senha deve possuir no mínimo oito caractéres, escreva novamente.",
                status: 422
            });
        }
        
        const emailExists = await super.emailExists(data.email);

        if(emailExists)
        {
            return res.status(409).json({
                message: "Não foi possível criar o usuário pois este email já existe no sistema.",
                status: 409
            });
        }

        const phoneExists = await super.phoneExists(data.phone);

        if(phoneExists) 
        {
            return res.status(409).json({
                message: "Não foi possível criar o usuário pois este telefone já existe no sistema.",
                status: 409
            });
        }

        const register = await super.insert(data);

        if(!register)
        {
            return res.status(500).json({
                message: "Ocorreu um erro inesperado ao tentar inserir o usuário, estamos trabalhando na correção.",
                status: 500
            });
        }


        return res.status(201).json({
            message: "O usuário foi cadastrado com sucesso, seu acesso já ao sistema ja está disponível.",
            status: 201
        });
    }


    public async checkCredentials(req: any, res: any, internalUse: boolean = false, internalData: Array<object> = [])
    {
        let data;

        if(!internalUse)
            data = req.body;
        else
            data = internalData[0];

        if(!data.email || !data.password)
        {
            return res.status(400).json({
                message: "Para verificar suas credenciais é necessário informar todos os campos(email, password).",
                status: 400
            });
        }
    }
}
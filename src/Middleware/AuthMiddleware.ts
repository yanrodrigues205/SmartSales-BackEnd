import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import database from "src/Database/PrismaSingleton";

interface AuthRequest extends Request
{
    userId?: string;
}
export default class AuthMiddeware
{
    constructor()
    {

    }
    /**
     * @param verifyCollectUser //if it is necessary to check whether the user has a collection profile
     * @returns JSON object | void
     */

    public static Authentication(verifyCollectUser: boolean)
    {
        return async(req: AuthRequest, res: Response, next: NextFunction) => {
            const authHeader = req.headers.authorization;
            if(!authHeader || !authHeader.startsWith('Bearer '))
            {
                return res.status(400).json({
                    "message": "Para acessar esta ambiente você necessita estar logado no sistema!",
                    "status": 400
                });
            }

            const token = authHeader.substring(7);


            let SECURITY_KEY :string = String(process.env.SECURITY_KEY);

            if(SECURITY_KEY.length == 0 || !SECURITY_KEY)
            {
                console.error("Chave de segurança da API inexistente!");
            }

            let decode : any;
            try
            {
                decode = await verify(token, SECURITY_KEY, {
                    complete: true
                });
            }
            catch(err)
            {
                 return res.status(401).json({
                    "message": "Sua sessão é inválida, tente logar novamente!",
                    "status": 401
                });
            }

            if(!decode.payload.id_twofactors || !decode)
            {
                return res.status(402).json({
                    "message": "Sua sessão é inválida, tente logar novamente!",
                    "status": 402
                });
            }


            const getTwoFactors = await database.twoFactors.findUnique({
                where: {
                    id: decode.payload.id_twofactors
                }
            });
            
            if(!getTwoFactors)
            {
                return res.status(403).json({
                    "message": "Não foi possível identificar o processo de autheticação feito por este token, tente novamente.",
                    "status": 403
                });
            }


            const getSession = await database.sessions.findMany({
                where:{
                    twofactors_id: decode.payload.id_twofactors,
                    token: token
                }
            });

            if(!getSession)
            {
                return res.status(403).json({
                    "message": "Não foi possível identificar a sessão iniciada por este token, tente novamente.",
                    "status": 403
                });
            }

            let getUser;
            if(getTwoFactors?.user_id && getTwoFactors?.user_id?.length > 0)
            {
                getUser = await database.users.findUnique({
                    where:{
                        id: getTwoFactors.user_id
                    }
                });
            }

            if(!getUser)
            {
                return res.status(403).json({
                    "message": "Não foi possível identificar o usuário responsável pela authenticação.",
                    "status": 403
                });
            }                

            req.userId = getUser.id;
            return next();
        };
    }


    public static async verifyRoute(token: string): Promise<false | object>
    {
        let SECURITY_KEY :string = String(process.env.SECURITY_KEY);

        if(SECURITY_KEY.length == 0 || !SECURITY_KEY)
        {
            console.error("Chave de segurança da API inexistente!");
        }

        let decode : any;
        try
        {
            decode = await verify(token, SECURITY_KEY, {
                complete: true
            });

            return decode;
        }
        catch(err)
        {
            console.error(err);
            return false;
        }

        if(!decode.payload.id || !decode)
        {
            return false;
        }
    }
}
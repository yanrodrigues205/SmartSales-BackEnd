import database from "src/Database/PrismaSingleton";
import {hash, compare } from "bcryptjs";
import UserDto from "src/Dtos/UserDto";

export default class UserModel
{
    protected constructor()
    {

    }

    protected async emailExists(email: string) : Promise<boolean>
    {
        try
        {
            const verify = await database.users.findUnique({
                where: { email: email }
            });

            if(verify)
                return true;
            else
                return false;

        }
        catch(err)
        {
            console.log(err);
            return false;
        }
    }

    protected async phoneExists(phone: string) : Promise<boolean>
    {
        try
        {
            const verify = await database.users.findUnique({
                where: { phone: phone }
            });

            if(verify)
                return true;
            else
                return false;

        }
        catch(err)
        {
            console.log(err);
            return false;
        }
    }


    protected async insert(user: UserDto): Promise< | Object>
    {
        try
        {
            let cryptPass = await hash(user.password, 10);
            const create_user = await database.users.create({
                data:{
                    name: user.name,
                    email: user.email,
                    password: cryptPass,
                    phone: user.phone
                },
                select:{
                    id: true,
                    name: true,
                    email: true,
                    password: true,
                    created_at: true,
                    updated_at: true
                }
            });

            if(create_user)
                return create_user;
            else
                return false;
        }
        catch(err)
        {
            console.error(err);
            return false;
        }
    }

    public async getDataById(user_id: string) : Promise<false | object>
    {
        try
        {
            const getData = await database.users.findMany({
                where:{
                    id: user_id
                },
                select:
                {
                    id: true,
                    name: true,
                    email: true,
                    created_at: true,
                    updated_at: true,
                }
            });

            if(getData.length > 0)
            {
                return getData;
            }
            else
            {
                return false;
            }
        }
        catch(err)
        {
            console.error(err);
            return false;
        }
    }
}
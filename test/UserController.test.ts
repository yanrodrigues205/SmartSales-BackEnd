import UserController from "src/Controllers/UserController";

describe("UserController -> Method: createUser",
    () => {
        let controller: UserController;
        let mockReq: any;
        let mockRes: any;

        beforeEach(() => {
            controller = new UserController();
            mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
        });

        

        test("Verificando a falha por falta de campos e seu retorno de status 400(Bad Request)", async () => {
            mockReq = { body: { name: "João Teste da Silva", email: "joao@gmail.com"} };
            await controller.createUser(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(400);

            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: expect.stringContaining("Não foi possível concluir a criação do usuário")
                })
            )
        });

        test("Verificação de valor válido em endereço de email e seu retorno 422(Unprocessable Entity)", async() => {
            mockReq = { body: { name: "João Teste da Silva", email: "joaogmail.com", password: "12345678aiju", phone: "(18) 99625-9201"} };
            await controller.createUser(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(422);
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: expect.stringContaining("não é um valor válido para um endereço de email")
                })
            )
        })


        test("Verificação de senha com menos de oito caracteres e seu retorno 422(Unprocessable Entity)", async() => {
            mockReq = { body: { name: "João Teste da Silva", email: "joao@gmail.com", password: "1234567", phone: "(18) 99625-9201"} };
            await controller.createUser(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(422);
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: expect.stringContaining("no mínimo oito caractéres")
                })
            )
        })

        test("Verificando se irá detectar se já existe o email dentro do sistema e seu retorno 409(Conflict)", async() => {

            mockReq = { 
                body: { 
                    name: "João Teste da Silva", 
                    email: "teste@gmail.com", 
                    password: "12345678ajj", 
                    phone: "(18) 99625-9201" 
                } 
            };
            await controller.createUser(mockReq, mockRes);
            
            mockReq = { 
                body: { 
                    name: "João Teste da Silva", 
                    email: "teste@gmail.com", 
                    password: "12345678ajj", 
                    phone: "(18) 99625-9201" 
                } 
            };
            await controller.createUser(mockReq, mockRes);
        
            // Verificando se o status 409 foi retornado para o conflito de email
            expect(mockRes.status).toHaveBeenCalledWith(409);
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: expect.stringContaining("email já existe no sistema."),
                })
            );
        })

        test("Verificando se irá detectar se já existe o telefone dentro do sistema e seu retorno 409(Conflict)", async() => {
            mockReq = { 
                body: { 
                    name: "João Teste da Silva", 
                    email: "joao2@gmail.com", 
                    password: "12345678ajj", 
                    phone: "(18) 99625-9201" 
                } 
            };
            await controller.createUser(mockReq, mockRes);
        
            // Verificando se o status 409 foi retornado para o conflito de email
            expect(mockRes.status).toHaveBeenCalledWith(409);
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: expect.stringContaining("telefone já existe no sistema."),
                })
            );
        })
    }
)
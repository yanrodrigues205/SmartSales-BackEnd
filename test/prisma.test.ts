import { PrismaClient } from '@prisma/client';
import prisma from "src/database/client";  // Ajuste o caminho se necessário

const prismaClient = new PrismaClient();

describe('Test Prisma client', () => {
  it('should connect to the database and perform operations', async () => {
    // Aqui você pode testar o deleteMany ou qualquer outra operação do Prisma
    const models = Reflect.ownKeys(prisma).filter((key: any) => key[0] !== '_');

    for (const model of models) {
      if (typeof model === 'string' && model in prisma) {
        const modelDelegate = prisma[model as keyof PrismaClient];
        if ('deleteMany' in modelDelegate) {
          const result = await modelDelegate.deleteMany({});
          expect(result).toBeDefined();
        }
      }
    }
  });
});

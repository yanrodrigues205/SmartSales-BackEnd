import { PrismaClient } from '@prisma/client';
import prisma from "src/database/client.ts";

beforeEach(async () => {
  // Apaga os dados antes de cada teste
  const models = Reflect.ownKeys(prisma).filter((key: any) => key[0] !== '_');

  // Garantir que `model` seja um nome de modelo válido do Prisma
  for (const model of models) {
    // Verifique se o modelo tem o método deleteMany
    if (typeof model === 'string' && model in prisma) {
      const modelDelegate = prisma[model as keyof PrismaClient];
      if ('deleteMany' in modelDelegate) {
        await modelDelegate.deleteMany({});
      }
    }
  }
});

afterAll(async () => {
  await prisma.$disconnect();
});

import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

// Escolhe a URL correta com base no ambiente
if (process.env.NODE_ENV === 'test') {
  process.env.DATABASE_URL = process.env.DATABASE_TEST_URL; // Seta a URL de teste
}
let databaseUrl = process.env.DATABASE_URL;

console.log("DATABASE_URL", databaseUrl)
// Inicializa o Prisma Client com a URL apropriada
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
});

export default prisma;

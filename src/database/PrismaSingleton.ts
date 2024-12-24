import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

if (process.env.NODE_ENV === 'test') 
{
  process.env.DATABASE_URL = process.env.DATABASE_TEST_URL; 
}

const databaseUrl = process.env.DATABASE_URL;


class PrismaSingleton {
  private static instance: PrismaClient;

  private constructor() {}

  public static getInstance(): PrismaClient {
    if (!PrismaSingleton.instance) {
      PrismaSingleton.instance = new PrismaClient({
        datasources: {
          db: {
            url: databaseUrl,
          },
        },
      });
    }
    return PrismaSingleton.instance;
  }
}

const database = PrismaSingleton.getInstance();
export default database;
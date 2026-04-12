import 'dotenv/config';
import { drizzle } from "drizzle-orm/mysql2";

if (!process.env.DATABASE_URL) {
  throw new Error("DB_URL is missing")
}

const db = drizzle(process.env.DATABASE_URL)

export default db;

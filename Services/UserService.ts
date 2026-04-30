import bcrypt from "bcryptjs";
import { usersTable } from "../src/db/schema";
import db from "../src/db";
import { sql } from "drizzle-orm";
import { MySqlRawQueryResult } from "drizzle-orm/mysql-proxy";

interface userRegistration {
    first_name: string,
    last_name: string,
    email: string,
    phone: string
    password: string,
    role: 'customer' | 'admin',
    terms_accepted: boolean
}

interface usersTableType {
    user_id: number,
    first_name: string,
    last_name: string,
    email: string,
    phone: string
    password: string,
    role: 'customer' | 'admin',
    created_at: Date | null,
    terms_accepted: number
}

export const createNewUser = async (data: userRegistration): Promise<MySqlRawQueryResult> => {
  try {
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(data.password, salt)

    const newUser = await db.insert(usersTable).values({
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            phone: data.phone,
            password: hash,
            role: data.role,
            terms_accepted: data.terms_accepted ? 1 : 0
        })

    return newUser;
  } catch (error) {
      throw error;
  }
}

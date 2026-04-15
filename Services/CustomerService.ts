import bcrypt from "bcryptjs";
import { usersTable } from "../src/db/schema";
import db from "../src/db";
import { customerDetails } from "../routes/customer";
import { sql } from "drizzle-orm";

export const findCustomerByEmail = async (email: string) => {
    try {
        const findEmail = await db.select().from(usersTable).where(sql`${usersTable.email} = ${email}`)
        return findEmail
    } catch (error) {
        if(error instanceof Error){
            
        console.log(error.message)
        }
    throw new Error("Failed to query. There's an issue to the server")
    }
}

export const matchCustomerPassword = async (password: string, password_hash: string) => {
    try {
        const password_match = await bcrypt.compare(password, password_hash)

    if(password_match){
        return true;
    }
    return false
    } catch (error) {
        throw new Error("Error: Cannot hash the password")
    }
}

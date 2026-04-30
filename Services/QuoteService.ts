import { usersTable, serviceRequestsTable } from "../src/db/schema";
import db from "../src/db";
import { uploadFile } from "./uploadFileService";
import { eq } from "drizzle-orm";

export type Urgency =
  | "emergency"
  | "urgent"
  | "standard"
  | "flexible"

export type PropertyType =
  | "residential"
  | "commercial"
  | "industrial";

export interface quoteTypes {
  service_details: string;
  parsedServices: string;
  files: Express.Multer.File[]
  streetAddress: string;
  barangay: string;
  city: string;
  postal: string;
  chosenPropertyType: PropertyType;
  preferredDate: Date;
  preferredTime: string;
  urgency: Urgency;
  firstName: string;
  lastName: string;
  email: string;
  phone: string; 
  referral?: string;
}

export const createNewQuote: any = async (quote: quoteTypes) => {
    try {
const data = {
  service_details: quote.service_details,
  services: JSON.stringify(quote.parsedServices),
  address: quote.streetAddress,
  barangay: quote.barangay,
  city: quote.city,
  postal_code: parseInt(quote.postal),
  property_type: quote.chosenPropertyType,
  preferred_date: quote.preferredDate,
  preferred_time: quote.preferredTime,
  urgency: quote.urgency,
  first_name: quote.firstName,
  last_name: quote.lastName,
  email: quote.email,
  phone: quote.phone,
  referral: quote.referral ?? null
};

const createdQuote = await db.insert(serviceRequestsTable).values(data);

let uploadedFile: any = []
for (const file of quote.files) {
  uploadedFile.push(await uploadFile(file, quote.email))
}

return {uploadedFile, createdQuote}
    } catch (error) {
        
    }
}

export const findQuote = async (email: any) => {
  try {
    const findQuoteByEmail = await db.select().from(serviceRequestsTable).where(eq(serviceRequestsTable.email, email))
    return findQuoteByEmail;
  } catch (error) {
    return error
  }
}

export const updateQuote: any = async (email: string, user_id: number) => {
  try {
    const updatedQuote = await db.update(serviceRequestsTable).set({ user_id }).where(eq(serviceRequestsTable.email, email))
    return updatedQuote
  } catch (error) {
    return error
  }
}
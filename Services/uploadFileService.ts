import express from "express";
import multer from "multer";
import { r2 } from "../r2";
import crypto from 'crypto'
import { PutObjectCommand } from "@aws-sdk/client-s3";


export const uploadFile = async (file: Express.Multer.File, email: string) => {
  try {

    if (!file) throw new Error('No file uploaded')
    if (!file || !file.buffer) {
  throw new Error("File buffer is missing");
}
    const key = `quotes/${email}/${crypto.randomUUID()}-${file.originalname}`;

   await r2.send(new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: key,
    Body: Buffer.from(file.buffer),
    ContentType: file.mimetype
   }))

    return {
      success: true,
      key,
    };
  } catch (error) {
    console.error("R2 upload failed:", error);
    return {
      success: false,
      key: null,
    };
  }
};
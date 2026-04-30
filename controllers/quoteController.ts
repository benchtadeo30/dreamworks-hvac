import { NextFunction, Request, Response } from "express";
import validator, { isPostalCode } from 'validator'
import { createNewQuote, findQuote, quoteTypes, updateQuote } from "../Services/QuoteService";
import { uploadFile } from "../Services/uploadFileService";
import { findCustomerByEmail } from "../Services/CustomerService";

interface serviceTypes {
    service_details: string,
    services: string,
}

interface propertyQuoteTypes {
    streetAddress: string,
    barangay: string,
    city: string,
    postal: string,
    chosenPropertyType: string
}

interface scheduleQuoteTypes {
    preferredDate: string,
    preferredTime: string,
    urgency: string,
}

interface contactQuoteTypes {
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    referral: string
}

declare module 'express-session' {
    interface SessionData {
        old: Record<string, any>;
        user: Record<string, any> | null;
    }
}

export const createServiceQuote = async (req: Request<{}, {}, serviceTypes>, res: Response, next: NextFunction) => {
  const files = req.files as Express.Multer.File[]
  const { services, service_details } = req.body;
  const parsedServices: string = JSON.parse(services)
  const errors: Array<object> = []
  let filesToUse = files

if (!req.session.old) {
  req.session.old = {};
}

console.log('----------------------------------------------------------')
console.log(req.session.old.files)
console.log('----------------------------------------------------------')

  if(!filesToUse.length && req.session.old?.files){
    filesToUse = req.session.old.files;
  }
  

  if(!parsedServices.length){
    errors.push({emptyServicesErr: 'Please choose atleast one services.' })
  }

  if(!service_details.trim()){
    errors.push({emptyServicesDetailsErr: 'This field is required.' })
  }

  if(!validator.isLength(service_details.trim(), { min: 50,})){
    errors.push({errServiceDetailsMin: 'This field requires atleast 50 characters.' })
  }

  if(!filesToUse.length){
    errors.push({emptyFileErr: 'Please upload a file' })
  } 

  if(filesToUse.length > 5){
    errors.push({errFileLimit: 'The images cannot be exceeded of 5 uploads. Please try again!'})
  }

   const hasInvalidFile = filesToUse.some(file => 
    file && !file.mimetype.endsWith('jpeg') && !file.mimetype.endsWith('png')
  );
  const maxSize = 5 * 1024 * 1024

  const hasInvalidSize = filesToUse.some(file => 
    file && file.size > maxSize
  )

  if (hasInvalidFile) {
    errors.push({fileErrFormat: 'Invalid image format (must be png/jpg). Please try again!'})
  }

   if(req.session.old?.files && req.session.old.files.length){
    delete req.session.old.files
  }

  req.session.old['service_details'] = service_details
  req.session.old['parsedServices'] = parsedServices
  req.session.old['files'] = filesToUse.map(f => ({
    filename: f.filename,
    originalname: f.originalname,
    mimetype: f.mimetype,
    path: f.path,
    size: f.size,
    buffer: f.buffer
  }));

  if(hasInvalidSize){
    delete req.session.old.files
    errors.push({fileErrFormat: 'The image cannot be exceeded of 5MB. Please try again!'})
  }

  if(errors.length){
    if(req.session.old){
      const filterFiles = req.session.old.files && req.session.old.files.filter((f: { mimetype: string }) => f.mimetype.includes('jpeg') || f.mimetype.includes("png"))
      req.session.old.files = filterFiles
      return res.status(400).render('quote', { errors, user: req.session.user ?? null, old: req.session.old });
    }
    return res.status(400).render('quote', { errors, user: req.session.user ?? null, old: {service_details, parsedServices, files } });
  }

  return res.status(200).render('quote', {errors: [], user: req.session.user ?? null, old: req.session.old})

}

export const createPropertyQuote = async (req: Request<{}, {}, propertyQuoteTypes>, res: Response, next: NextFunction) => {
  const { streetAddress, barangay, city, postal, chosenPropertyType } = req.body
  const parsedPostal = parseInt(postal);
  const errors: Array<object> = []

 if (!req.session.old) {
  req.session.old = {};
}

console.log(req.session.old)

 if(!streetAddress.length && !barangay.length 
    && !city.length && !postal.length && 
    !chosenPropertyType.length){
      errors.push({errPropertyAllFieldsEmpty: 'All fields are required!'})
      return res.status(400).render('quote', { errors, user: req.session.user ?? null, old: req.session.old });
    }

  const responseBarangay = await fetch("https://psgc.gitlab.io/api/barangays/");
  const responseCity = await fetch("https://psgc.gitlab.io/api/cities-municipalities/");
const barangays = await responseBarangay.json();
const cities = await responseCity.json();


const hasValidBarangay = barangays.some(
  (b: any) => b.name.toLowerCase() === barangay.toLowerCase()
);

const hasValidCities = cities.some(
  (b: any) => b.name.toLowerCase() === city.toLowerCase()
);


if(!chosenPropertyType.length){
  errors.push({ errPropertyTypeEmpty: "Choose a property type." });
}

  if(!streetAddress.length){
  errors.push({ errStreetAddressEmpty: "Street address is required." });
}

if(!barangay.length){
  errors.push({ errBarangayEmpty: "Barangay is required." });
}

if(!city.length){
  errors.push({ errCityEmpty: "City is required." });
}

if(!postal.length){
  errors.push({ errPostalEmpty: "Postal code is required." });
}

  if (barangay.length && !hasValidBarangay) {
  errors.push({ invalidBarangay: "Barangay is not found." });
  }

  if (city.length && !hasValidCities) {
  errors.push({ invalidCity: "City is not found" });
  }

  if(postal.length > 4){
    errors.push({errPostalFormat: 'Invalid postal code format!'})
  }

  req.session.old['streetAddress'] = streetAddress
  req.session.old['barangay'] = barangay
  req.session.old['city'] = city
  req.session.old['postal'] = postal
  req.session.old['chosenPropertyType'] = chosenPropertyType

  if(errors.length){
    if(req.session.old){
      return res.status(400).render('quote', { errors, user: req.session.user ?? null, old: req.session.old });
    }
    return res.status(400).render('quote', { errors, user: req.session.user ?? null, old: {streetAddress, barangay, city, postal, chosenPropertyType } });
  }

  return res.status(200).render('quote', {errors: [], user: req.session.user ?? null, old: req.session.old})
}

export const createScheduleQuote = async (req: Request<{}, {}, scheduleQuoteTypes>, res: Response, next: NextFunction) => {
  const { preferredDate, preferredTime, urgency } = req.body
  const errors = []
  
   if (!req.session.old) {
  req.session.old = {};
}
  if(!preferredDate.length && !preferredTime.length && !urgency.length){
    errors.push({ errScheduleAllFieldsEmpty: "All fields are required!" });
    return res.status(400).render('quote', { errors, user: req.session.user ?? null, old: req.session.old });
  }

  if(!preferredDate.length){
    errors.push({ errDateEmpty: "Date is required!" });
  }
  if(!preferredTime.length){
    errors.push({ errTimeEmpty: "Time is required!" });
  }
  if(!urgency.length){
    errors.push({ errUrgencyEmpty: "Urgency is required!" });
  }

  req.session.old['preferredDate'] = preferredDate
  req.session.old['preferredTime'] = preferredTime
  req.session.old['urgency'] = urgency

  if(errors.length){
    if(req.session.old){
      return res.status(400).render('quote', { errors, user: req.session.user ?? null, old: req.session.old });
    }
    return res.status(400).render('quote', { errors, user: req.session.user ?? null, old: { preferredDate, preferredTime, urgency } });
  }

  return res.status(200).render('quote', {errors: [], user: req.session.user ?? null, old: req.session.old})
}

export const createContactQuote = async (req: Request<{}, {}, contactQuoteTypes>, res: Response, next: NextFunction) => {
  const { firstName, lastName, email, phone, referral } = req.body
  const errors = []
  
  if (!req.session.old) {
  req.session.old = {};
}
  if(!firstName.length && !lastName.length && !email.length && !phone.length){
    errors.push({ errContactAllFieldsEmpty: 'All fields are required!' })
    return res.status(400).render("quote", { errors, user: req.session.user ?? null, old: req.session.old })
  }

  if(!firstName.length){
    errors.push({ errFirstNameEmpty: 'Firstname is required!' })
  }
  
  if(firstName.length < 3){
    errors.push({ errFirstNameLimitChars: 'Firstname must be atleast 3 characters!' })
  }

  if(firstName.length && !validator.isAlpha(firstName, "en-US", {ignore: " "})){
    errors.push({ errFirstNameFormat: 'Firstname cannot contain a number or any special characters' })
    return res.status(400).render("quote", { errors, user: req.session.user ?? null, old: req.session.old })
  }

  if(!lastName.length){
    errors.push({ errLastNameEmpty: 'Lastname is required!' })
  }

  if(lastName.length < 3){
    errors.push({ errLastNameLimitChars: 'Lastname must be atleast 3 characters!' })
  }

  if(lastName.length && !validator.isAlpha(lastName, "en-US", {ignore: " "})){
    errors.push({ errLastNameFormat: 'Lastname field cannot contain a number or any special characters' })
    return res.status(400).render("quote", { errors, user: req.session.user ?? null, old: req.session.old })
  }


  if(!email.length){
    errors.push({ errEmailEmpty: 'Email is required!' })
  }

  if(email.length && !validator.isEmail(email)){
    errors.push({ errEmailNameFormat: 'Invalid email format!' })
  }

  if(!phone.length){
    errors.push({ errPhoneEmpty: 'Phone is required!' })
  }

  if(!validator.isMobilePhone(phone, "en-PH")){
    errors.push({ errPhoneNameFormat: "Invalid phone number. Please enter a valid Philippine mobile number (e.g. 09XXXXXXXXX or +63XXXXXXXXXX)." })
  }

  req.session.old['firstName'] = firstName
  req.session.old['lastName'] = lastName
  req.session.old['email'] = email
  req.session.old['phone'] = phone
  req.session.old['referral'] = referral

   if(errors.length){
    if(req.session.old){
      return res.status(400).render('quote', { errors, user: req.session.user ?? null, old: req.session.old });
    }
    return res.status(400).render('quote', { errors, user: req.session.user ?? null, old: { firstName, lastName, email, phone, referral } });
  }

  try {
    const data = req.session.old as quoteTypes
   const findCustomerEmail = await findCustomerByEmail(email.trim())

if(findCustomerEmail.length === 0){
  throw new Error("Email not found");
}

const userId = findCustomerEmail[0]!.user_id;

// create quote first
const createdQuote = await createNewQuote(data);

// check uploads
const allSuccess = createdQuote.uploadedFile.every((file: any) => file.success)

if(!allSuccess){
  throw new Error("Upload failed");
}

// now find quotes by email
const findQuoteByEmail: any = await findQuote(email)

// update each quote with correct user_id
if(findQuoteByEmail.length){
  for (const quote of findQuoteByEmail) {
  await updateQuote(quote.email, userId)
}
}
    delete req.session.old
  return res.status(200).render('quote', {errors: [], user: req.session.user ?? null,  old: req.session.old})
  } catch (error) {
    if(error instanceof Error){
    errors.push({ errCreateQuote: `Can't create a new quote. ${error.message}.` })
    console.log(error.message)
    }
  return res.status(400).render('quote', {errors, user: req.session.user ?? null, old: req.session.old})
  }

}
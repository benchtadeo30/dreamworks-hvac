import express  from "express";
import { createServiceQuote, createPropertyQuote, createScheduleQuote, createContactQuote } from "../controllers/quoteController";
import multer, { memoryStorage } from 'multer'

const quoteRouter = express.Router();


const upload = multer({storage: multer.memoryStorage()})

quoteRouter.get('/', (req, res) => {
   if(req.session.old){
   return res.render('quote', {errors: [], user: req.session.user || null, old: req.session.old})
   }
   return res.render('quote', {errors: [], user: req.session?.user, old: null})
})

quoteRouter.post('/1', upload.array("files"), createServiceQuote)
quoteRouter.post('/2', createPropertyQuote)
quoteRouter.post('/3', createScheduleQuote)
quoteRouter.post('/4', createContactQuote)

export default quoteRouter;
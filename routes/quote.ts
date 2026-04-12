import express  from "express";

const quoteRouter = express.Router();

quoteRouter.get('/', (req, res) => {
    res.render('quote')
})

export default quoteRouter;
import express  from "express";

const adminRouter = express.Router();

adminRouter.get('/', (req, res) => {
    res.render('admin-portal')
})

adminRouter.get('/login', (req, res) => {
    res.render('login-admin')
})

export default adminRouter;
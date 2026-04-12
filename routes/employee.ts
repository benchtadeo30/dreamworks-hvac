import express  from "express";

const employeeRouter = express.Router();

employeeRouter.get('/', (req, res) => {
    res.render('employee-portal')
})

employeeRouter.get('/login', (req, res) => {
    res.render('login-employee')
})

export default employeeRouter;
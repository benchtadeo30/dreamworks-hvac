import express, { type Request, type Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import customerRouter from '../routes/customer';
import quoteRouter from '../routes/quote';
import adminRouter from '../routes/admin';
import employeeRouter from '../routes/employee';
import registrationRouter from '../routes/registration';
import errorHandler  from '../error';
dotenv.config()

const app = express();
const PORT = process.env.PORT

app.set('view engine', 'ejs')
app.use(express.json())

app.get('/', (req, res) => {
    
    res.render("dreamworks-hvac")
})

app.get('/error', (req: Request, res: Response) => res.render("server_error"))
app.get('/status-error', (req: Request, res: Response) => res.render("status_code_empty"))
app.use('/registration', registrationRouter)
app.use('/customer', customerRouter)
app.use('/quote', quoteRouter)
app.use('/employee', employeeRouter)
app.use('/admin', adminRouter)

app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Listens to port ${PORT}`)
})

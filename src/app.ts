import express, { type Request, type Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import customerRouter from '../routes/customer';
import quoteRouter from '../routes/quote';
import adminRouter from '../routes/admin';
import employeeRouter from '../routes/employee';
import registrationRouter from '../routes/registration';
import errorHandler  from '../error';
import session from 'express-session'
dotenv.config()

const app = express();
const PORT = process.env.PORT

app.set('view engine', 'ejs')
app.use(session({secret: 'Benchtadeo_123456789', resave: true, saveUninitialized: false}))
app.use(express.json())

app.get('/webhook-test', async (req, res) => {
    try {
        const response = await fetch('http://localhost:5678/webhook/test')
        const resp = await response.json()
        return res.json({ data: resp.data })
    } catch (error) {
        if(error instanceof Error){
            return res.status(400).json({ message: error.message })
        }
    }
   return res.json({ message: 'workflow connected' })
});

app.get('/', (req, res) => {
    if(req.session.user){
        return res.render("dreamworks-hvac", { user: req.session.user })
    }
    return res.render("dreamworks-hvac", { user: null })
})

app.get('/error', (req: Request, res: Response) => res.render("server_error"))
app.get('/status-error', (req: Request, res: Response) => res.render("status_code_empty"))
app.use('/registration', registrationRouter)
app.use('/quote', quoteRouter)
app.use('/customer', customerRouter)
app.use('/employee', employeeRouter)
app.use('/admin', adminRouter)

app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Listens to port ${PORT}`)
})

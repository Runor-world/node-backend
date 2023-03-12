require('dotenv').config()
const connectDatabase = require('./db/connection')
require('express-async-errors')
const morgan  = require('morgan')
const passport = require('passport')
const passportStrategy = require('./passport')
const cookieSession = require('cookie-session')

// middlewares
const errorHandlerMiddleware = require('./middleware/error-handler')
const notFoundRouteMiddleware = require('./middleware/not-found')
const authenticateUserMiddleware = require('./middleware/auth')


// passport strategy


const express = require('express')
const app = express()

// routers
const authRouter = require('./routes/auth')
const jobRouter = require('./routes/jobs')
const profileRouter = require('./routes/profile')

const cors = require('cors')
const helmet = require('helmet')
const rateLimiter = require('express-rate-limit')
const xss = require('xss-clean')
const { application } = require('express')


// morgan to log request info in the console during development
if(process.env.SERVER !== 'production'){
    app.use(morgan('dev'))
}

// set encoding middlewares
app.use(express.json())
app.use(express.static('./public'))
// security middlewares
// app.set('trust proxy', 1)

app.use(cookieSession({name: 'session', keys: [process.env.SESSION_KEY] ,maxAge: 24 * 60 * 60 * 1000}))

app.use(cors({
    origin: ['http://localhost:3000', 'https://runor.org'],
    credentials: true,
    methods: 'GET,PUT,POST,PATCH'
}))
app.use(xss())
app.use(helmet())
app.use(
    rateLimiter(
        {
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 100, // limit each IP to 100 request per windowMs
        }
    )
)

// passort initialization
app.use(passport.initialize())
app.use(passport.session())

// set router
app.get('/api', async(req, res) =>{
    res.send('<h1 style="text-align: center">Welcome to runor backend</h2>')
})
app.use('/api/auth', authRouter)
app.use('/api/profile', profileRouter)
app.use('/api/jobs', authenticateUserMiddleware, jobRouter)

// error middlewares
app.use(errorHandlerMiddleware)
app.use(notFoundRouteMiddleware)

const port  = process.env.PORT || 8000
const mongo_uri = process.env.SERVER === 'development'? "mongodb://127.0.0.1:27017/runor":process.env.MONGO_URI

const start = async () => {
    try{
        await connectDatabase(mongo_uri)
        app.listen(port, ()=>{
            console.log(`App listening on port ${port}`)
        })
    }
    catch(error){
        console.log(error)
    }
}

start()
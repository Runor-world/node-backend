require('dotenv').config()
const connectDatabase = require('./db/connection')
require('express-async-errors')
// middlewares
const errorHandlerMiddleware = require('./middleware/error-handler')
const notFoundRouteMiddleware = require('./middleware/not-found')
const authenticateUserMiddleware = require('./middleware/auth')

const express = require('express')
const app = express()

// routers
const authRouter = require('./routes/auth')
const jobRouter = require('./routes/jobs')

const cors = require('cors')
const helmet = require('helmet')
const rateLimiter = require('express-rate-limit')
const xss = require('xss-clean')

// set encoding middlewares
app.use(express.json())
app.use(express.static('./public'))
// security middlewares
// app.set('trust proxy', 1)
const corsOptions = {
    // origin: process.env.CLIENT_ORIGIN || 'http://localhost:8000' 
    origin: "*"
}
app.use(cors(corsOptions))
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



// set router
app.use('/api/auth', authRouter)
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
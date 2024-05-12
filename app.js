import dotenv from 'dotenv'
import express from 'express';
import mongoose, { version } from 'mongoose';
import cookieParser from 'cookie-parser';
import { AccountRouter } from './routes/AccountRoutes.js';
import { KeyRouter } from './routes/KeyRoutes.js';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerui from 'swagger-ui-express'
import YAML from 'yamljs';
import { CronJob } from 'cron'
import { Key } from './model/Keys.js';

const app = express()
dotenv.config()

// set up database connection
mongoose.connect(process.env.DATABASE_URL);


var set = mongoose.connection;
set.on('error', console.error.bind(console, 'connection error:'));
set.once('open', function() {
    console.log('Db connected successfully')
});

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// set up swagger docs config
const swaggerDocs = YAML.load('./docs.yaml')

const spacs = swaggerJSDoc(swaggerDocs)
app.use('/api-docs', swaggerui.serve, swaggerui.setup(spacs))

// setting up a cron job to update expired access keys to expired status
// this cron job runs at 6:00am everyday
const job = new CronJob(
    '0 0 6 * * *',
    async function () {
        console.log('cron job run today...')
        const key = await Key.updateMany({ expiry: { $lt: new Date() }, status: 'active'}, { status: 'expired'}).catch(err => console.log(err.message))
    },
    null,
    true,
    'utc'
)

app.get('/', (req, res) => {
    res.redirect('/api-docs')
})

app.get('/api', (req, res) => {
    res.redirect('/api-docs')
})

app.use('/api', AccountRouter)
app.use('/api', KeyRouter)

app.listen(3000 || process.env.PORT, () => {
    console.log("Server is running...")
})
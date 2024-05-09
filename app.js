import express from 'express';
import mongoose, { version } from 'mongoose';
import cookieParser from 'cookie-parser';
import { AccountRouter } from './routes/AccountRoutes.js';
import { KeyRouter } from './routes/KeyRoutes.js';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerui from 'swagger-ui-express'
import YAML from 'yamljs';

const app = express()

// set up database connection
mongoose.connect("mongodb://127.0.0.1:27017/multiTenant");


var set = mongoose.connection;
set.on('error', console.error.bind(console, 'connection error:'));
set.once('open', function() {
    console.log('Db connected successfully')
});

const swaggerDocs = YAML.load('./docs.yaml')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

const spacs = swaggerJSDoc(swaggerDocs)
app.use('/api-docs', swaggerui.serve, swaggerui.setup(spacs))

app.use('/api', AccountRouter)
app.use('/api', KeyRouter)

app.listen(3000, () => {
    console.log("Server is running on port 3000")
})
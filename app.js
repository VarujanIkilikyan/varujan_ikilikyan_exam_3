import express from 'express';
import 'dotenv/config'
import {createServer}  from 'http'
import logger from 'morgan';
import path from 'path';
import cookieParser from 'cookie-parser'


import './migrate.js';

import SelectorRouter from './routes/index.js';
import errorHandler from "./middlewares/errorHandler.js";


const app = express();
const server = createServer(app);

app.use(logger('dev'))

app.set('view engine', 'ejs');
app.set('views', path.join(path.resolve(), 'views'));
app.use(express.static(path.join(path.resolve(), 'public')));


app.use(express.json());
app.use(cookieParser());


app.use(SelectorRouter);


app.use(errorHandler.notFound);
app.use(errorHandler.errors);



const { PORT = 3000, HOST = 'localhost' } = process.env;
server.listen(+PORT, HOST,()=>{
    console.log(`Server run on ${HOST}:${PORT}`);
});

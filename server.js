import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import knex from 'knex'
import bcrypt from 'bcrypt-nodejs'

import { handleGetOrder } from "./controllers/getOrder.js";
import { handleModifyOrder } from "./controllers/modifyOrder.js";
import { handleGetOrdersForClient } from "./controllers/getOrdersForClient.js";
import { handleGetOrdersForDoctor } from "./controllers/getOrdersForDoctor.js";
import { handleGetClient } from "./controllers/getClient.js";
import { handleGetDoctor } from "./controllers/getDoctor.js";
import { handleRegisterNewClient } from "./controllers/registerNewClient.js";
import { handleCreateNewOrder } from "./controllers/createNewOrder.js";


const db = knex({
    client: 'pg',
    connection: {
        host : '127.0.0.1',
        user : '',
        password : '',
        database : 'covidlabdb'
    }
});

const app = express();

app.use(cors())
app.use(bodyParser.json())



app.post('/getOrder', (req, res) => handleGetOrder(req, res, db, bcrypt))

app.put('/modifyOrder', (req, res) => handleModifyOrder(req, res, db, bcrypt))

app.post('/getOrdersForClient', (req, res) => handleGetOrdersForClient(req, res, db, bcrypt))

app.post('/getOrdersForDoctor', (req, res) => handleGetOrdersForDoctor(req, res, db, bcrypt))

app.post('/getClient', (req, res) => handleGetClient(req, res, db, bcrypt))

app.post('/getDoctor', (req, res) => handleGetDoctor(req, res, db, bcrypt))

app.post('/registerNewClient', (req, res) => handleRegisterNewClient(req, res, db, bcrypt))

app.post('/createNewOrder', (req, res) => handleCreateNewOrder(req, res, db, bcrypt))


app.use( function(req, res, next) {
    res.send('404');
});


app.listen(3001);

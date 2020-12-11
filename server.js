import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import knex from 'knex'
import bcrypt from 'bcrypt-nodejs'

import { handleGetOrder } from "./controllers/getOrder.js";
import { handleModifyOrder } from "./controllers/modifyOrder.js";


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


app.post('/getOrdersForClient', (req, res) => {

db.select('*').from('clients').where({
    email: req.body.email
}).then(client => {
    if (client.length === 1) {

        bcrypt.compare(req.body.password, client[0].password, function(err, resp) {
                    if (resp) {
                        db.select('*').from('orders').where({
                            client: client[0].name
                        }).then(data => {
                            if (data.length>0){
                                console.log(data);
                                res.send(data);
                            } else res.status(404).send('orders not found')

                        })
                    }
                });


    } else res.status(403).send('access denied')
})
.catch(err => {
        console.log(err)
        res.status(400).send('something went wrong...');
    })

})


app.post('/getOrdersForDoctor', (req, res) => {

db.select('*').from('doctors').where({
    email: req.body.email
}).then(doctor => {
    if (doctor.length === 1) {
        console.log(doctor)

        bcrypt.compare(req.body.password, doctor[0].password, function(err, resp) {
                    if (resp) {
                        db.select('*').from('orders').where({
                            result: null
                        }).then(data => {
                            if (data.length>0){
                                console.log(data);
                                res.send(data);
                            } else res.status(404).send('orders not found')
                        })
                    }
        });
    } else res.status(403).send('Account doesnt exist')
})
.catch(err => {
        console.log(err)
        res.status(400).send('something went wrong...');
    })

})


app.post('/getClient', (req, res) => {

    db.select('id', 'name', 'email', 'phone').from('clients').where({
        email: req.body.email

    }).then(client => {
        if (client.length===1){
            db.select('password').from('clients').where({
                email: req.body.email

            }).then(acc => {
                bcrypt.compare(req.body.password, acc[0].password, function(err, resp) {
                    resp ? res.send(client[0]) : res.status(404).send('Wrong password')
                });
            })



        } else res.status(404).send('Client not found.')

    }).catch(err => {
        console.log(err)
    })

})

// app.post('/getClient', (req, res) => {

//     db.select('id', 'name', 'email', 'phone').from('clients').where({
//         email: req.body.email,
//         password: req.body.password

//     }).then(data => {
//         if (data.length===1){
//           console.log(data);
//           res.send(data[0]);
//         } else res.status(404).send('Client not found.')

//     }).catch(err => {
//         console.log(err)
//     })

// })

app.post('/getDoctor', (req, res) => {

    db.select('name', 'email', 'password').from('doctors').where({
        email: req.body.email

    }).then(doctor => {
        if (doctor.length===1){

          bcrypt.compare(req.body.password, doctor[0].password, function(err, resp) {

                    delete doctor[0].password;
                    resp ? res.send(doctor[0]) : res.status(404).send('Wrong password')
                });

        } else {
            console.log('KKKKK')
            res.status(404).send('Doctor not found.')
        }

    }).catch(err => {
        console.log(err)
    })

})


app.post('/registerNewClient', (req, res) => {

    var hash = bcrypt.hashSync(req.body.password);

    db('clients').insert({
        name: req.body.name,
        email: req.body.email,
        password: hash,
        phone: req.body.phone
    })
    .then((odp)=>{
        res.send(`Client ${req.body.name} created.`)
        console.log(odp)
    })
    .catch(err => {
        if (err.code === '23505') {
            res.status(500).send('Client with this email already exist.');
            console.log('User istnieje...');
        } else {
            res.status(501).send('Something went wrong... Try again');
            console.log('Coś nie tak...');
        }
    })

})

app.post('/createNewOrder', (req, res) => {


    db('orders')
    .returning('order_number')
    .insert({
        name: req.body.name,
        surname: req.body.surname,
        pesel: req.body.pesel,
        birthday: req.body.birthday,
        register_date: req.body.register_date,
        client: req.body.client,
        recipient: req.body.recipient,
        patient_email: req.body.patient_email
    })
    .then((odp)=>{
        console.log(odp)
        res.send(odp);
    })
    .catch(err => {
        res.status(400).send('Something went wrong... Try again');
    })
})



app.use( function(req, res, next) {

    // you can do what ever you want here
    // for example rendering a page with '404 Not Found'
    res.send('404');

});

app.listen(3001);

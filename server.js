import express from 'express'
import bodyParser from 'body-parser'


const app = express();

app.use(bodyParser.json())

app.post('/sendUser', (req, res) => {

    const user = req.body;

    console.log(user)
    res.send(JSON.stringifyt(user))
})

app.get('/baranek', (req, res) => {
    res.send('hurrey')
})

app.use( function(req, res, next) {

    // you can do what ever you want here
    // for example rendering a page with '404 Not Found'
    res.send('asd');

});

app.listen(3001);
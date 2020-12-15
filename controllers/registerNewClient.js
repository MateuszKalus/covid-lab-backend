export const handleRegisterNewClient = (req, res, db, bcrypt) => {

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

}

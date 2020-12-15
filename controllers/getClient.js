export const handleGetClient = (req, res, db, bcrypt) => {

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

}

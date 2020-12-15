export const handleGetOrdersForClient = (req, res, db, bcrypt) => {

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

}

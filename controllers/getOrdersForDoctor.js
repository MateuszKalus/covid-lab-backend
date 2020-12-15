export const handleGetOrdersForDoctor = (req, res, db, bcrypt) => {

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

}

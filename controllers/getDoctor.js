export const handleGetDoctor = (req, res, db, bcrypt) => {

    db.select('name', 'email', 'password').from('doctors').where({
        email: req.body.email

    }).then(doctor => {
        if (doctor.length===1){

          bcrypt.compare(req.body.password, doctor[0].password, function(err, resp) {

                    delete doctor[0].password;
                    resp ? res.send(doctor[0]) : res.status(404).send('Wrong password')
                });

        } else {
            res.status(404).send('Doctor not found.')
        }

    }).catch(err => {
        console.log(err)
    })

}

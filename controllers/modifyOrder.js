export const handleModifyOrder = (req, res, db, bcrypt) => {

    db.select('*').from('doctors').where({
        email: req.body.email
    }).then(doct => {
        if (doct.length === 1) {

            bcrypt.compare(req.body.password, doct[0].password, function(err, resp) {

                if (resp) {

                    const doctor = doct[0].name;
                    const department = doct[0].department;

                    const {order_number, result} = req.body;

                    const subQuery = db('orders').select('surname').where({order_number})

                    subQuery.then(response => {
                        if(response.length>0) {
                            subQuery.update({result, doctor, department})
                            .then(resp=>{
                                res.send('update done')
                            })
                            .catch(err=>{res.status(400).send(err)})
                        }
                        else{
                            res.status(400).send('update failed')
                        }
                    })
                    .catch(err=>{res.status(400).send(err)})

                }
            })

        }
        else {
            res.status(400).send('doctor doesnt exist...')
        }
    })
    .catch(err => {
        console.log(err)
        res.status(400).send('something went wrong...');
    })




}

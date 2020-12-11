export const handleGetOrder = (req, res, db, bcrypt) => {

    console.log('PARATORE')
    db.select('*').from('orders').where({
        order_number: parseInt(req.body.order_number),
        birthday: req.body.birthday

    }).then(data => {
        if (data.length===1){
          if (data[0].result !== null){
            res.send(data[0]);
            console.log('Resultat: ', data[0].result)
          } else res.status(425).send('Doc didnt check your order yet.')
        } else res.status(400).send('order not found')

    }).catch(err => {
        console.log(err)
        res.status(404).send('order doesnt exist');
    })

}

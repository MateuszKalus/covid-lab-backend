export const handleCreateNewOrder = (req, res, db, bcrypt) => {

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
}

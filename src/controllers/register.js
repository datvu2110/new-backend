
const handleRegister = (req,res, db, bcrypt) => {
    const {email, name, password} = req.body
    const hash = bcrypt.hashSync(password)
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            return trx('users')
            .returning('*')
            .insert({
                email:loginEmail[0],
                name:name
            }).then(user => {
                //res.json(user[0])
                res.json("New user is created")
            }).catch(error => {
                res.send('unable to register')
            })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(err => console.log(err))
   
}

module.exports = {
    handleRegister: handleRegister
}
const handleSignin = (req,res, db,bcrypt) => {
    db.select('email','hash').from('login')
        .where('email', '=', req.body.email)
        .then(data => {
            const isValid = bcrypt.compareSync(req.body.password, data[0].hash)
            console.log(isValid)
            if (isValid){
            
                return   db.select('*').from('users')
                    .where('email', '=',req.body.email)
                    .then(user => {
                        res.json(user[0])
                    })
                    .catch(err => res.status(200).json('User not Found'))
                
            }else{
                res.status(200).json({
                    message: 'Wrong Credential'
                })
            }
            
        })
    .catch(err => res.status(200).json({
        message: 'Wrong Credential'
    }))
}

module.exports = {
    handleSignin:handleSignin
}
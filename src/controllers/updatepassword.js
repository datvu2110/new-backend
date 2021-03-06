const updatepassword = (req,res,db,bcrypt) => {
    const {password} = req.body
    const {email} = req.params
    const hash = bcrypt.hashSync(password)
    db('login').where ('email', email)
                    .returning('*')
                    .update({
                        hash: hash
                    })
                    .then (response => {
                        db.select().from('login').where('email',email).then( function(data){
                            res.send(data)
                        
                        })
                    })
}
module.exports = {
    updatepassword:updatepassword
}
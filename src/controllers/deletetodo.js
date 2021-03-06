const deletetodo = (req, res, db) => {
    const {id} = req.params
    db('todo').where('noteid', id)
        .del()
        .then( () => {
            db.select()
                .from ('todo')
                .then( (todo) =>{
                    res.send(todo)
                })
        })
}

module.exports = {
    deletetodo:deletetodo
}
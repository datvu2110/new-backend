const toggletodo = (req,res,db) => {
    const {done} =  req.body
    const {id} = req.params

    db('todo').where ('noteid', id)
                    .returning('*')
                    .update({
                        done: done
                    })
                    .then (response => {
                        db.select().from('todo').where('noteid',id).then( function(todo){
                            res.send(todo)
                            
                        })
                    })
}

module.exports = {
    toggletodo:toggletodo
}
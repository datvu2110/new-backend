const updatetodo = (req,res,db) => {
    const {todo} = req.body
    const {id} = req.params
    db('todo').where ('noteid', id)
              .returning('*')
              .update({
                  todo:todo
              })
              .then(response => {
                db.select().from('todo').where('noteid',id).then( function(todo){
                    res.send(todo)
                })
                })
}
module.exports = {
    updatetodo:updatetodo
}
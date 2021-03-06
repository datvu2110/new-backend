const addtodo = (req,res,db) => {
    
    const {todo} = req.body
    const {id} = req.params

    db('todo')
        .returning('*')
        .insert({
            todo:todo,
            id:id
        })
        .then(response => {
            const json = JSON.parse(JSON.stringify(response))
            res.json({"noteid": json[0].noteid});
            //res.json("new todo added")
        })
    
}

module.exports = {
    addtodo:addtodo
}
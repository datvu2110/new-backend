const gettodo = (req,res, db) => {
    const {id} =  req.params
    db('todo').where({
        id: id
    }).select('todo','noteid', 'id',"done")

    .then(item => {
        res.json(item)
    })
}

module.exports = {
    gettodo:gettodo
}
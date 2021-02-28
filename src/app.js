require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const knex = require('knex')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt-nodejs')

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

const app = express()

const db = knex({
    client:'pg',
    connection: 'postgres://pzosfuutpnktdp:afc22b2e86b508082ae81f434bc5fbfa698904c797767749c4c016ce35d9cedb@ec2-54-165-164-38.compute-1.amazonaws.com:5432/d1au4drbo6gkl7?ssl=true&sslfactory=org.postgresql.ssl.NonValidatingFactory'
    // connection: 'postgres://:@localhost/noteapp'
})

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())
app.use(bodyParser.json())


app.get('/', (req, res) => {
	res.send("Hello World")
})


// Get all todos for users with an ID 
app.get('/todo/:id', (req,res) => {
    const {id} =  req.params
    db('todo').where({
        id: id
    }).select('todo','noteid', 'id',"done")

    .then(item => {
        res.json(item)
    })
})

//Delete a todo with the todo ID
app.delete('/todo/:id', (req, res) => {
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
})

//Check the username and password
app.post('/signin', (req,res) => {
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
                    .catch(err => res.status(400).json('User not Found'))
                
            }else{
                res.status(400).json({
                    message: 'Wrong Credential'
                })
            }
            
        })
    .catch(err => res.status(400).json({
        message: 'Wrong Credential'
    }))
})

// Register an user
app.post('/register',(req,res) => {
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
   
})

// Update the password with the user ID
app.put('/update/:id', (req,res) => {
    const {password} = req.body
    const {id} = req.params
    const hash = bcrypt.hashSync(password)
    db('login').where ('id', id)
                    .returning('*')
                    .update({
                        hash: hash
                    })
                    .then (response => {
                        db.select().from('login').where('id',id).then( function(id){
                            //res.send("id")
                            res.send("Password is updated")
                        })
                    })
})

// Update the todo with the todo ID
app.put('/todo/:id', (req,res) => {
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
})



app.put('/toggle/:id', (req,res) => {
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
})


// Add a new todo
app.post('/add/:id',  (req,res) => {
    
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
    
})

app.use(function errorHandler(error, req, res, next) {
    let response
    if (NODE_ENV === 'production') {
        response = {error: {message: 'server error'}}
    } else {
        console.error(error)
        response = {message: error.message, error}
    }
    res.status(500).json(response)
})

module.exports = app
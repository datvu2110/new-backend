require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const knex = require('knex')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt-nodejs')
const register = require('./controllers/register')
const signin  = require('./controllers/signin')
const gettodo = require('./controllers/get-todo')


process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

const app = express()

const db = knex({
    client:'pg',
    connection: 'postgres://pzosfuutpnktdp:afc22b2e86b508082ae81f434bc5fbfa698904c797767749c4c016ce35d9cedb@ec2-54-165-164-38.compute-1.amazonaws.com:5432/d1au4drbo6gkl7?ssl=true&sslfactory=org.postgresql.ssl.NonValidatingFactory'
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
app.get('/todo/:id', (req,res) => {gettodo.gettodo(req,res,db)})

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
app.post('/signin', (req,res) => {signin.handleSignin(req,res,db,bcrypt)})

// Register an user
app.post('/register',(req,res) => {register.handleRegister(req,res,db,bcrypt)})

// Update the password with the user ID
app.put('/update/:email', (req,res) => {
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
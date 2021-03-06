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
const gettodo = require('./controllers/gettodo')
const deletetodo = require('./controllers/deletetodo')
const updatepassword = require('./controllers/updatepassword')
const updatetodo = require('./controllers/updatetodo')
const toggletodo = require('./controllers/toggletodo')
const addtodo = require('./controllers/addtodo')

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
app.get('/todo/:id', (res,req) => {gettodo.gettodo(req,res,db)})

//Delete a todo with the todo ID
app.delete('/todo/:id', (req,res) => {deletetodo.deletetodo(req,res,db)})

//Check the username and password
app.post('/signin', (req,res) => {signin.handleSignin(req,res,db,bcrypt)})

// Register an user
app.post('/register',(req,res) => {register.handleRegister(req,res,db,bcrypt)})

// Update the password with the user ID
app.put('/update/:email', (req,res) => {updatepassword.updatepassword(req,res,db,bcrypt)})

// Update the todo with the todo ID
app.put('/todo/:id', (req,res) => {updatetodo.updatetodo(req,res,db)})


app.put('/toggle/:id', (req,res) => {toggletodo.toggletodo(req,res,db)} )


// Add a new todo
app.post('/add/:id', (req,res) => {addtodo.addtodo(req,res,db)})

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
const {expect} = require('chai')
const supertest = require('supertest')
const app = require('../src/app')
const sinon = require('sinon')
const knex = require('knex')

const users = [{"email":"new@gmail.com"},{"email":"a@gmail.com"},{"email":"alo@gmail.com"},{"email":"sđsffs@gmail.com"},{"email":"mentor@example.com"},{"email":"mentor1@example.com"},{"email":"apierce@chegg.com"},{"email":"jeff@jeff.com"},{"email":"test@test.com"},{"email":"b@gmail.com"},{"email":"c@gmail.com"},{"email":"aloha@gmail.com"},{"email":"abc@gmail.com"},{"email":"aaaa@gmail.com"},{"email":"avv@gmail.com"},{"email":"abc@ggmail.com"},{"email":"aab@gmail.com"},{"email":"aaa@gmail.com"},{"email":"bbbb@gmail.com"},{"email":"sdsfsdfsf@gmail.com"},{"email":"123@gmail.com"},{"email":"abs@gmail.com"},{"email":"aav@gmail.com"},{"email":"testing@gmail.com"},{"email":"anhdat@gmail.com"},{"email":"tidat@gmail.com"},{"email":"bbee@gmail.com"},{"email":"thieugia@gmail.com"},{"email":"bbbbb@gmail.com"},{"email":"gh@gmail.com"},{"email":"tidat2110@gmail.com"},{"email":"nah@gmail.com"},{"email":"nene@gmail.com"},{"email":"abcbc@gmail.com"},{"email":"someone1@email.com"},{"email":"someone11@email.com"},{"email":"someone111@email.com"},{"email":"newnew@gmail.com"},{"email":"name12@gmail.com"},{"email":"abcde@gmail.com"},{"email":"adfsdfs@gmail.com"},{"email":"sfsfdsfsdadfsa@gmail.com"},{"email":"sfssdfs@gmail.com"},{"email":"sdafsdf@gmail.com"},{"email":"sdfsf@gmail.com"},{"email":"sdfsfs@gmail.com"},{"email":"aafsfddsf@gmail.com"},{"email":"asdfdsdskl@gmail.com"},{"email":"233243242432@gmail.com"},{"email":"dborland@thinkful.com"},{"email":"dat.vu@utexas.edu"},{"email":"bee@gmail.com"},{"email":"adsfsd@gmail.com"}]
const todo2 = [ { todo: 'yes', noteid: 17, id: 2, done: 1 },
{ todo: 'hello', noteid: 25, id: 2, done: 0 },
{ todo: 'em oi', noteid: 26, id: 2, done: 0 },
{ todo: 'em gi oi', noteid: 27, id: 2, done: 0 },
{ todo: 'sad', noteid: 28, id: 2, done: 0 },
{ todo: 'acc', noteid: 29, id: 2, done: 0 },
{ todo: 'todoTest', noteid: 34, id: 2, done: 0 },
{ todo: 'todoTest', noteid: 35, id: 2, done: 0 },
{ todo: 'todoTest', noteid: 36, id: 2, done: 0 },
{ todo: 'todoTest', noteid: 38, id: 2, done: 0 },
{ todo: 'todoTest', noteid: 39, id: 2, done: 0 },
{ todo: 'todoTest', noteid: 40, id: 2, done: 0 },
{ todo: 'todoTest', noteid: 41, id: 2, done: 0 }]

describe('App', ()=>{
    
    it('GET /api responds with 200 containing "Hello World"', ()=> {
        return supertest(app)
           .get('/')
           .expect(200, 'Hello World')
    })

  
    it('GET todo with for user with ID 2', ()=> {
        return supertest(app)
           .get('/todo/2')
           .expect(200)
    })

    it('PUT /todo:id update todo with the noteID', ()=> {

        let data = { id: 41 ,todo: "todoTest" }
        let actual = { noteid: 41, todo: 'todoTest', id: 2, done: 0 }
        return supertest(app)
           .put('/todo/41')
           .send(data)
           .set('Accept', 'application/json')
           .expect('Content-Type', /json/)
           .expect(200)    
    })

    it('POST /signin if the user signs in successfully' , () => {
        let data = {email: "a@gmail.com" , password: "hello"}
        return supertest(app)
            .post('/signin')
            .send(data)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
    })

    it('PUT /toggle/:id toggle the todo item' , () => {
        let data = {done : 1}
        return supertest(app)
            .put('/toggle/41')
            .send(data)
            .set('Accept', 'application/json')
            .expect('Content-Type', /html/)
            .expect(200,'Toggle Successfully')
    })

    it('POST /todo/:id add new todo' , () => {
        let data = {
            "todo": "hello another one",
            "id" : "13"
        }
        return supertest(app)
            .post('/add/13')
            .send(data)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200,'"new todo added"')
    })
    
    it('POST /register create new user' , () => {
        let data = {
            "name": "Aloha",
            "email": "sdfsdfwf242324232412121111@gmail.com",
            "password" : "hello"
        }
        return supertest(app)
            .post('/register')
            .send(data)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200,'"New user is created"')
    })

    it('PUT /update the password' , () => {
        let data = { "password" : "hello" }
        return supertest(app)
            .put('/update/2')
            .send(data)
            .set('Accept', 'application/json')
            .expect('Content-Type', /html/)
            .expect(200,'Password is updated')
    })

    it('DELETE /delete the todo' , () => {
        
        return supertest(app)
            .delete('/delete/20')
            .set('Accept', 'application/json')
            .expect('Content-Type', /html/)
            .expect(404)
    })
})


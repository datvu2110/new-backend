const {expect} = require('chai')
const supertest = require('supertest')
const app = require('../src/app')
const sinon = require('sinon')
const knex = require('knex')

describe('App', ()=>{
    it('GET /api responds with 200 containing "Hello World"', ()=> {
        return supertest(app)
           .get('/')
           .expect(200, 'Hello World')
    })
})

describe('App', ()=>{
    it('Test users', ()=> {
        sinon.stub(knex, "from").callsFake( (any) => {return {"email" : "email@email.com"}; })
        return supertest(app)
           .get('/users')
           .expect(200, 'Hello World')
    })
})

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


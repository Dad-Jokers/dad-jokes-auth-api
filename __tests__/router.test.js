'use strict';

process.env.SECRET = 'ocean';

const supertest = require('supertest');
const { server } = require('../src/server');
const { db, jokes } = require('../src/models/index');
const mockRequest = supertest(server);

let dads = {
  user: {
    username: 'user', password: 'user', role: 'user'
  },
  editor: {
    username: 'editor', password: 'editor', role: 'editor'
  },
  admin: {
    username: 'admin', password: 'admin', role: 'admin'
  }
}

let seedJoke = {
  name: "test-name",
  setup: "test setup",
  punchline: 'test punchline'
}

let newJoke = {
  name: "new joke",
  setup: "new setup",
  punchline: 'new punchline'
}


beforeAll(async (done) => {
  await db.sync();
  let seed = await jokes.create(seedJoke)
  console.log(seed);
  done();
});
afterAll(async (done) => {
  await db.drop();
  done();
});

describe('Auth functionality of each role', () => {

  Object.keys(dads).forEach(dadType => {
    describe(`${dadType}`, () => {

      test(`can register`, async (done) => {
        let response = await mockRequest.post('/register').send(dads[dadType]);
        const dadObject = response.body;
        console.log(dadObject.user.username)
        expect(response.status).toBe(201);
        expect(dadObject.user.id).toBeDefined();
        expect(dadObject.user.username).toEqual(dads[dadType].username);
        expect(dadObject.user.role).toEqual(dads[dadType].role);
        done();
      })

      test(`can sign in`, async (done) => {
        let response = await mockRequest.post('/signin').auth(dads[dadType].username, dads[dadType].password);
        const dadObject = response.body;
        expect(response.status).toBe(200);
        expect(dadObject.user.token).toBeDefined();
        done();
      })

      test('can access a protected route to get all jokes with a punchline (read capability)', async (done) => {
        let response = await mockRequest.post('/signin').auth(dads[dadType].username, dads[dadType].password);
        let token = response.body.user.token;

        let jokes = await mockRequest.get('/jokes/all').auth(token, { type: 'bearer' });   
        expect(response.status).toBe(200);
        expect(jokes.body[0].punchline).toBeDefined();
        done();
      })

      test('can to create a joke if role is is editor or admin', async (done) => {
        let response = await mockRequest.post('/signin').auth(dads[dadType].username, dads[dadType].password);
        let token = response.body.user.token;

        let createdJoke = await mockRequest.post('/jokes').auth(token, { type: 'bearer' }).send(newJoke); 
       
        if(dads[dadType].role === 'user'){
          expect(createdJoke.status).toBe(500);          
        } else {
          expect(response.status).toBe(200);
        }
        done();
      })

      test('can update a joke is editor or admin', async (done) => {
        // var response of signin
        let response = await mockRequest.post('/signin').auth(dads[dadType].username, dads[dadType].password);
        // var token
        let token = response.body.user.token;
        let updateJoke = {
          setup: "updated setup"
        };
        // update joke using id
        let jokeID = await mockRequest.put('/jokes/1').auth(token, { type: 'bearer' }).send(updateJoke);

        if(dads[dadType].role === 'user') {
          expect(jokeID.status).toBe(500);
        } else {
          expect(jokeID.status).toBe(200);
          expect(updateJoke.setup).toEqual(jokeID.body.setup);
        }
        done();
      })

      test('can delete if admin', async (done) => {
        let response = await mockRequest.post('/signin').auth(dads[dadType].username, dads[dadType].password);
        // var token
        let token = response.body.user.token;

        let jokeID = await mockRequest.delete('/jokes/1').auth(token, { type: 'bearer' });        

        if(dads[dadType].role === 'user' || dads[dadType].role === 'editor') {
          expect(jokeID.status).toBe(500);
        } else {
          expect(jokeID.status).toBe(200);
          expect(jokeID.body.id).toBeUndefined();
        }
        done();
      })
    })
  })
});
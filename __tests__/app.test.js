require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const { request } = require('../lib/app');
const app = require('../lib/app');
const client = require('../lib/client');
const powers = require('../data/powers.js');
describe('app routes', () => {
  describe('routes', () => {
    let token;
  
    beforeAll(async () => {
      execSync('npm run setup-db');
  
      await client.connect();
      const signInData = await fakeRequest(app)
        .post('/auth/signup')
        .send({
          email: 'jon@user.com',
          password: '1234'
        });
      
      token = signInData.body.token; // eslint-disable-line
    }, 10000);
  
    afterAll(done => {
      return client.end(done);
    });

    // it('gets the powers endpoint', async () => {
    //   const response = await request.get('/powers');
    //   expect(response.status).toBe(200);
    //   expect(response.body).toBe(powers[0]);
    // });




    // it('gets the powers show endpoint', async () => {
    //   const response = await request.get('/powers/1');
    //   expect(response.status).toBe(200);
    //   expect(response.body).toBe(powers[0]);
    // });

    test('returns powers', async() => {

      const expectation = [
        {
          id: 1,
          name: 'Super Speed',
          description: 'Able to run near or at speed of light',
          realistic: false,
          type: 'physical'
        },
        {
          id: 2,
          name: 'Fly',
          description: 'To be able to fly',
          realistic: true,
          type: 'teleknetic'
        },
        {
          id: 3,
          name: 'Eternal-life',
          description: 'Live forever',
          realistic: false,
          type: 'physical'
        },
        {
          id: 4,
          name: 'Give life',
          description:'be able to give life to inanimate objects',
          realistic: true,
          type: 'super natural'
        }, 
        {
          id: 5,
          name: 'Heal through time reversion',
          description: 'Be able to heal anything by turning back time in a specific area',
          realistic: false,
          type: 'space/time'
        }
      ];

      const data = await fakeRequest(app)
        .get('/powers')
        .expect('Content-Type', /json/)
        .expect(200);
      console.log(data, 'Something!!');
      expect(data.body).toEqual(expectation);
    });
  });
});

require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
// const { request } = require('../lib/app');
const app = require('../lib/app');
const client = require('../lib/client');
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

    test('returns powers', async() => {

      const expectation = [{
        id:1,
        name: 'Super Speed',
        description: 'Able to run near or at speed of light',
        realistic: false,
        type: 'physical'
      },
      {
        id:2,
        name: 'Fly',
        description: 'To be able to fly',
        realistic: true,
        type: 'teleknetic'
      },
      {
        id:3,
        name: 'Eternal-life',
        description: 'Live forever',
        realistic: false,
        type: 'physical'
      },
      {
        id:4,
        name: 'Give life',
        description:'be able to give life to inanimate objects',
        realistic: true,
        type: 'super natural'
      }, 
      {
        id:5,
        name: 'Heal through time reversion',
        description: 'Be able to heal anything by turning back time in a specific area',
        realistic: false,
        type: 'space/time'
      }];

      const data = await fakeRequest(app)
        .get('/powers')
        .expect('Content-Type', /json/)
        .expect(200);
      expect(data.body).toEqual(expectation);

      
    });
    test('returns powers/id endpoint', async() => {
  
      const expectation = [
        {
          id: 1,
          name: 'Super Speed',
          description: 'Able to run near or at speed of light',
          realistic: false,
          type: 'physical'
        }
      ];
  
      const data = await fakeRequest(app)
        .get('/powers/1')
        .expect('Content-Type', /json/)
        .expect(200);
      expect(data.body).toEqual(expectation);
    
    });

    test('post /powers creates new power', async () => {
      const newPower = {
        id: 6,
        name: 'Full Energy Spectrum eyes',
        description: 'Be able to see all spectrums of energy',
        realistic: true,
        type: 'physical'
      };

      const data = await fakeRequest(app)
        .post('/powers')
        .send(newPower)
        .expect('Content-Type', /json/)
        .expect(200);
      expect(data.body.name).toEqual(newPower.name);
      expect(data.body.id).toBeGreaterThan(0);

    });

    test('put /powers/:id updates powers', async () => {
      const updatedPower = {
        
        name: 'Take life',
        description: 'Be able to take life from any animated entity',
        realistic: true,
        type: 'super natural'
      };
      const data = await fakeRequest(app)
        .put('/powers/4')
        .send(updatedPower)
        .expect('Content-Type', /json/)
        .expect(200);
      expect(data.body.name).toEqual(updatedPower.name);
      expect(data.body.description).toEqual(updatedPower.description);
    });

  });
});

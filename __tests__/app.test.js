require('dotenv').config();

const { execSync } = require('child_process');
const powersData = require('../data/powers.js');

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
      // const signInData = await fakeRequest(app)
      //   .post('/auth/signup')
      //   .send({
      //     email: 'jon@user.com',
      //     password: '1234'
      //   });
      
      // token = signInData.body.token; // eslint-disable-line
    }, 10000);
  
    afterAll(done => {
      return client.end(done);
    });

    test('returns powers', async() => {
      const expectation = [{
        id: 1,
        power_name:'Super Speed',
        description: 'Able to run near or at speed of light',
        realistic: false,
        power_type: 'physical'
      },
      {
        id: 2,
        power_name:'Fly',
        description:'To be able to fly',
        realistic: true,
        power_type: 'telekinetic'
      },
      {
        id: 3,
        power_name:'Eternal life',
        description:'Live forever',
        realistic: false,
        power_type: 'physical'
      },
      {
        id: 4,
        power_name:'Give life',
        description:'be able to give life to inanimate objects',
        realistic: true,
        power_type: 'super natural'
      }, 
      {
        id: 5,
        power_name:'Heal through time reversion',
        description:'Be able to heal anything by turning back time in a specific area',
        realistic: false,
        power_type: 'space/time'
      }];
      const expectedShape = {
        id: 1,
        power_name:'Super Speed',
        description:'Able to run near or at speed of light',
        realistic: false,
        power_type: 'physical'
      };

      const data = await fakeRequest(app)
        .get('/powers')
        .expect('Content-Type', /json/)
        .expect(200);
      expect(data.body).toEqual(expectation);

     

      expect(data.body[0]).toEqual(expectedShape);

      
    }, 10000);
    test('returns powers/id endpoint', async() => {
  
      const expectation = 
      {
        id: 1,
        power_name: 'Super Speed',
        description: 'Able to run near or at speed of light',
        realistic: false,
        power_type: 'physical'
      };
  
      const data = await fakeRequest(app)
        .get('/powers/1')
        .expect('Content-Type', /json/)
        .expect(200);
      expect(data.body).toEqual(expectation);
    
    }, 10000);

    test('post /powers creates new power', async () => {
      await fakeRequest(app).post('/types').send({ type:'physical' });
      const newPower = {
        id:6,
        power_name: 'Full Spectrum Energy Eyes',
        description: 'Able to run near or at speed of light',
        realistic: false,
        power_type: 'physical'
      };

      const data = await fakeRequest(app)
        .post('/powers')
        .send(newPower)
        .expect('Content-Type', /json/)
        .expect(200);
      expect(data.body.name_id).toEqual(6);
      expect(data.body.id).toBeGreaterThan(0);

    });

    test('put /powers/:id updates powers', async () => {
      const updatedPower = {
        
        id: 4,
        power_name: 'Take Life',
        description:'be able to take life from an animated objects',
        realistic: true,
        power_type: 'super natural'
      };
      const data = await fakeRequest(app)
        .put('/powers/4')
        .send(updatedPower)
        .expect('Content-Type', /json/)
        .expect(200);
      expect(data.body.name_id).toEqual(updatedPower.name_id);
      expect(data.body.description).toEqual(updatedPower.description);
    }, 10000);

  });
});

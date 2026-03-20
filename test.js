const request = require('supertest');
const app = require('./app');

describe('Quality Gate Checks', () => {
  it('should confirm the system is Healthy', async () => {
    const res = await request(app).get('/health');
    if (res.body.status !== 'Healthy') {
        throw new Error("Improvement Failed: System is unstable!");
    }
  });
});
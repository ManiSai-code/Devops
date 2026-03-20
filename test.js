const request = require('supertest');
const app = require('./app');

describe('Continuous Improvement Integration Tests', () => {
  
  // Test 1: Connectivity Check
  it('should load the homepage successfully', async () => {
    const res = await request(app).get('/');
    if (res.statusCode !== 200) {
        throw new Error("Improvement Failed: Website is unreachable!");
    }
  });

  // Test 2: Database Persistence Check
  it('should successfully store a DevOps idea in the MySQL database', async () => {
    const testIdea = "Test Idea - " + Date.now(); // Unique idea for every test
    
    const res = await request(app)
      .post('/add-idea')
      .send({ idea: testIdea }); 
    
    // If the DB is disconnected in XAMPP, this will return a 500 error
    if (res.statusCode !== 200) {
        throw new Error("Functional Failure: The Database rejected the improvement idea!");
    }
  });
});
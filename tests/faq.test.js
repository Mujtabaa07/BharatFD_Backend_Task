const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/app');
const expect = chai.expect;

chai.use(chaiHttp);

describe('FAQ API', () => {
  it('should get all FAQs', (done) => {
    chai.request(app)
      .get('/api/faqs')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });

  it('should create a new FAQ', (done) => {
    const newFAQ = {
      question: 'Test Question',
      answer: 'Test Answer'
    };

    chai.request(app)
      .post('/api/faqs')
      .send(newFAQ)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('question', newFAQ.question);
        expect(res.body).to.have.property('answer', newFAQ.answer);
        done();
      });
  });
});
const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
  const valid = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
  const solution =
    '769235418851496372432178956174569283395842761628713549283657194516924837947381625';
  const invalidChars =
    '0.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
  const tooShort =
    '.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
  const invalid =
    '9.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
  suite('Solve Requests', () => {
    const url = '/api/solve';
    test('Solve, valid puzzle', () => {
      chai
        .request(server)
        .post(url)
        .send({
          puzzle: valid,
        })
        .end((err, res) => {
          assert.deepEqual(res.body, { solution });
        });
    });
    test('Solve, missing puzzle', () => {
      chai
        .request(server)
        .post(url)
        .send({
          puzzle: '',
        })
        .end((err, res) => {
          assert.deepEqual(res.body, {
            error: 'Required field missing',
          });
        });
    });
    test('Solve, invalid characters puzzle', () => {
      chai
        .request(server)
        .post(url)
        .send({
          puzzle: invalidChars,
        })
        .end((err, res) => {
          assert.deepEqual(res.body, {
            error: 'Invalid characters in puzzle',
          });
        });
    });
    test('Solve, too short puzzle', () => {
      chai
        .request(server)
        .post(url)
        .send({
          puzzle: tooShort,
        })
        .end((err, res) => {
          assert.deepEqual(res.body, {
            error: 'Expected puzzle to be 81 characters long',
          });
        });
    });
    test('Solve, invalid puzzle', () => {
      chai
        .request(server)
        .post(url)
        .send({
          puzzle: invalid,
        })
        .end((err, res) => {
          assert.deepEqual(res.body, {
            error: 'Puzzle cannot be solved',
          });
        });
    });
  });

  suite('Check Requests', () => {
    const url = '/api/check';

    const validCoor = 'A2';
    const invalidCoor = 'J5';

    test('Check, all fields', () => {
      chai
        .request(server)
        .post(url)
        .send({
          puzzle: valid,
          coordinate: validCoor,
          value: '6',
        })
        .end((err, res) => {
          assert.deepEqual(res.body, { valid: true });
        });
    });
    test('Check, one conflict', () => {
      chai
        .request(server)
        .post(url)
        .send({
          puzzle: valid,
          coordinate: validCoor,
          value: '1',
        })
        .end((err, res) => {
          assert.deepEqual(res.body, { valid: false, conflict: ['row'] });
        });
    });
    test('Check, 2 conflicts', () => {
      chai
        .request(server)
        .post(url)
        .send({
          puzzle: valid,
          coordinate: validCoor,
          value: '3',
        })
        .end((err, res) => {
          assert.deepEqual(res.body, { valid: false, conflict: ['column', 'region'] });
        });
    });
    test('Check, 3 conflicts', () => {
      chai
        .request(server)
        .post(url)
        .send({
          puzzle: valid,
          coordinate: validCoor,
          value: '5',
        })
        .end((err, res) => {
          assert.deepEqual(res.body, { valid: false, conflict: ['row', 'column', 'region'] });
        });
    });
    test('Check, missing required fields', () => {
      chai
        .request(server)
        .post(url)
        .send({
          puzzle: valid,
          coordinate: validCoor,
          value: '',
        })
        .end((err, res) => {
          assert.deepEqual(res.body, { error: 'Required field(s) missing' });
        });
    });
    test('Check, invalid characters', () => {
      chai
        .request(server)
        .post(url)
        .send({
          puzzle: invalidChars,
          coordinate: validCoor,
          value: '6',
        })
        .end((err, res) => {
          assert.deepEqual(res.body, { error: 'Invalid characters in puzzle' });
        });
    });
    test('Check, incorrect length', () => {
      chai
        .request(server)
        .post(url)
        .send({
          puzzle: tooShort,
          coordinate: validCoor,
          value: '6',
        })
        .end((err, res) => {
          assert.deepEqual(res.body, { error: 'Expected puzzle to be 81 characters long' });
        });
    });
    test('Check, invalid coordinate', () => {
      chai
        .request(server)
        .post(url)
        .send({
          puzzle: valid,
          coordinate: invalidCoor,
          value: '6',
        })
        .end((err, res) => {
          assert.deepEqual(res.body, { error: 'Invalid coordinate' });
        });
    });
    test('Check, invalid value', () => {
      chai
        .request(server)
        .post(url)
        .send({
          puzzle: valid,
          coordinate: invalidCoor,
          value: '0',
        })
        .end((err, res) => {
          assert.deepEqual(res.body, { error: 'Invalid value' });
        });
    });
  });
});

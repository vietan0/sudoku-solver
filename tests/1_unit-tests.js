const chai = require('chai');
const assert = chai.assert;
const { puzzlesAndSolutions } = require('../controllers/puzzle-strings');

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

suite('Unit Tests', () => {
  const valid = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
  const invalidChars =
    '0.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
  const tooShort =
    '.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';

  // Validate
  test('Valid puzzle', () => {
    assert.equal(solver.validate(valid), true);
  });
  test('Invalid chars puzzle', () => {
    assert.equal(solver.validate(invalidChars), 'Invalid characters in puzzle');
  });
  test('Incorrect length puzzle', () => {
    assert.equal(solver.validate(tooShort), 'Expected puzzle to be 81 characters long');
  });

  // Placement
  test('Valid row placement', () => {
    assert.equal(solver.checkRowPlacement(valid, 4, 7, 2), true);
  });
  test('Invalid row placement', () => {
    assert.equal(solver.checkRowPlacement(valid, 4, 7, 1), 'row');
  });

  test('Valid column placement', () => {
    assert.equal(solver.checkColPlacement(valid, 4, 7, 1), true);
  });
  test('Invalid column placement', () => {
    assert.equal(solver.checkColPlacement(valid, 4, 7, 2), 'column');
  });

  test('Valid region placement', () => {
    assert.equal(solver.checkRegionPlacement(valid, 4, 7, 2), true);
  });
  test('Invalid region placement', () => {
    assert.equal(solver.checkRegionPlacement(valid, 4, 7, 7), 'region');
  });

  // Solver
  test('Solver, valid string', () => {
    assert.deepEqual(solver.solve(puzzlesAndSolutions[0][0]), {
      solution: puzzlesAndSolutions[0][1],
    });
  });
  test('Solver, invalid string', () => {
    assert.deepEqual(solver.solve(invalidChars), { error: 'Invalid characters in puzzle' });
  });
  test('Solver returns expected solution', () => {
    puzzlesAndSolutions.forEach((puz) => {
      assert.deepEqual(solver.solve(puz[0]), { solution: puz[1] });
    });
  });
});

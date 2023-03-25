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

  test('Validate puzzle string', () => {
    assert.equal(solver.validate(valid), true);
    assert.equal(solver.validate(invalidChars), 'Invalid characters in puzzle');
    assert.equal(solver.validate(tooShort), 'Expected puzzle to be 81 characters long');
  });

  test('Validate row placement', () => {
    assert.equal(solver.checkRowPlacement(valid, 4, 7, 2), true);
    assert.equal(solver.checkRowPlacement(valid, 4, 7, 1), 'row');
  });

  test('Validate column placement', () => {
    assert.equal(solver.checkColPlacement(valid, 4, 7, 1), true);
    assert.equal(solver.checkColPlacement(valid, 4, 7, 2), 'column');
  });

  test('Validate region placement', () => {
    assert.equal(solver.checkRegionPlacement(valid, 4, 7, 2), true);
    assert.equal(solver.checkRegionPlacement(valid, 4, 7, 7), 'region');
  });

  test('Solve a puzzle', () => {
    const [puz1, puz2, puz3, puz4] = puzzlesAndSolutions;
    assert.deepEqual(solver.solve(invalidChars), { error: 'Invalid characters in puzzle' });
    assert.deepEqual(solver.solve(tooShort), { error: 'Expected puzzle to be 81 characters long' });
    assert.deepEqual(solver.solve(puz1[0]), { solution: puz1[1] });
    assert.deepEqual(solver.solve(puz2[0]), { solution: puz2[1] });
    assert.deepEqual(solver.solve(puz3[0]), { solution: puz3[1] });
    assert.deepEqual(solver.solve(puz4[0]), { solution: puz4[1] });
  });
});

'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route('/api/check').post((req, res) => {
    const { puzzle, coordinate, value } = req.body;
    // early returns
    if (!puzzle || !coordinate || !value) return res.json({ error: 'Required field(s) missing' });
    if (solver.validate(puzzle) !== true) return res.json({ error: solver.validate(puzzle) });
    if (isNaN(Number(value)) || Number(value) > 9 || Number(value < 1)) return res.json({ error: 'Invalid value' });

    const [row, col] = solver.getRowAndCol(coordinate);
    if (!row || !col) return res.json({ error: 'Invalid coordinate' });

    // if there is already placed value
    const table = solver.splitIntoRows(puzzle);
    if (table[row - 1][col - 1] === value) return res.json({ valid: true });

    // if not, proceed
    const rowOk = solver.checkRowPlacement(puzzle, row, col, value);
    const colOk = solver.checkColPlacement(puzzle, row, col, value);
    const regOk = solver.checkRegionPlacement(puzzle, row, col, value);
    const conflict = [];
    if (rowOk !== true) conflict.push(rowOk);
    if (colOk !== true) conflict.push(colOk);
    if (regOk !== true) conflict.push(regOk);

    if (rowOk === true && colOk === true && regOk === true)
      res.json({
        valid: true,
      });
    else
      res.json({
        valid: false,
        conflict,
      });
  });

  app.route('/api/solve').post((req, res) => {
    const { puzzle } = req.body;
    res.json(solver.solve(puzzle));
  });
};

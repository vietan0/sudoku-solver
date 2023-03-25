class SudokuSolver {
  validate(puzzleString) {
    // not allowed to match anything but digits and dot
    const regex = /[^1-9\.]+/g; // negated set

    // possible fail cases
    if (!puzzleString) return 'Required field missing';
    if (puzzleString.length !== 81) return 'Expected puzzle to be 81 characters long';
    if (puzzleString.match(regex) !== null) return 'Invalid characters in puzzle';

    // everything is good
    return true;
  }

  splitIntoRows(puzzleString) {
    const table = [];
    for (let i = 0; i < 81; i += 9) {
      const row = puzzleString.substring(i, i + 9);
      table.push(row);
    }
    return table;
  }

  updateRow(row, targetIndex, newChar) {
    const prev = row.substring(0, targetIndex - 1);
    const next = row.substring(targetIndex);

    return prev + newChar + next;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const table = this.splitIntoRows(puzzleString);
    const targetRow = table[row - 1]; // String

    return !targetRow.includes(value.toString()) || 'row'; // Bool
  }

  checkColPlacement(puzzleString, row, column, value) {
    const table = this.splitIntoRows(puzzleString);
    let targetCol = '';
    table.forEach((row) => {
      targetCol += row[column - 1];
    });

    return !targetCol.includes(value.toString()) || 'column';
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const regions = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ];
    let targetRows;
    let targetCols;
    regions.forEach((region) => {
      if (region.includes(row)) targetRows = region;
      if (region.includes(column)) targetCols = region;
    });

    const table = this.splitIntoRows(puzzleString);
    let targetRegion = '';
    table.forEach((rowStr, index) => {
      if (targetRows.includes(index + 1)) {
        targetCols.forEach((pos) => {
          targetRegion += rowStr[pos - 1];
        });
      }
    });

    return !targetRegion.includes(value.toString()) || 'region';
  }

  getCoor(row, column) {
    const convert = {
      1: 'A',
      2: 'B',
      3: 'C',
      4: 'D',
      5: 'E',
      6: 'F',
      7: 'G',
      8: 'H',
      9: 'I',
    };
    return convert[row] + column; // string e.g. 'A1', 'D5', 'G9'
  }

  getRowAndCol(coor) {
    const convert = {
      A: 1,
      B: 2,
      C: 3,
      D: 4,
      E: 5,
      F: 6,
      G: 7,
      H: 8,
      I: 9,
    };
    if (coor.length !== 2) return [null, null];
    const [letter, number] = coor.split('');
    return [convert[letter], Number(number)]; // array of 2 Numbers
  }

  tryEachValue(puzzleString, value, coor, emptySpacesAndPossibleFills) {
    const [row, column] = this.getRowAndCol(coor);
    if (
      this.checkRowPlacement(puzzleString, row, column, value) === true &&
      this.checkColPlacement(puzzleString, row, column, value) === true &&
      this.checkRegionPlacement(puzzleString, row, column, value) === true
    ) {
      emptySpacesAndPossibleFills[coor].push(value);
    }
  }

  updateTable(table, emptySpacesAndPossibleFills) {
    let localTable = table;
    localTable.forEach((row, rowIndex) => {
      const charsInRow = row.split('');
      charsInRow.forEach((char, charIndex) => {
        if (char === '.') {
          // 1. get coor of dot (e.g. A2)
          const dotCoor = this.getCoor(rowIndex + 1, charIndex + 1);
          const possibleFills = emptySpacesAndPossibleFills[dotCoor];
          if (possibleFills.length === 1) {
            // 2. replace dot with value
            const updatedRow = this.updateRow(row, charIndex + 1, possibleFills[0]);
            localTable[rowIndex] = updatedRow;
          }
        }
      });
    });
    return localTable;
  }

  solve(puzzleString) {
    // return early for invalid puzzles
    if (this.validate(puzzleString) !== true) return { error: this.validate(puzzleString) };

    let localPuzzleString = puzzleString;
    let table = this.splitIntoRows(localPuzzleString);
    let initialEmptySpaces = localPuzzleString.split('').filter((c) => c === '.').length;

    for (let i = 1; i <= initialEmptySpaces; i++) {
      // 1. fill up emptySpacesAndPossibleFills
      let emptySpacesAndPossibleFills = {};
      table.forEach((row, rowIndex) => {
        const charsInRow = row.split('');
        charsInRow.forEach((char, charIndex) => {
          if (char === '.') {
            const coor = this.getCoor(rowIndex + 1, charIndex + 1);
            emptySpacesAndPossibleFills[coor] = [];
          }
        });
      });
      Object.keys(emptySpacesAndPossibleFills).forEach((coor) => {
        for (let value = 1; value <= 9; value++) {
          this.tryEachValue(localPuzzleString, value, coor, emptySpacesAndPossibleFills);
        }
      });

      // 2. update table
      table = this.updateTable(table, emptySpacesAndPossibleFills);
      localPuzzleString = table.join('');
    }

    if (localPuzzleString.includes('.')) return { error: 'Puzzle cannot be solved' };
    return { solution: localPuzzleString };
  }
}

module.exports = SudokuSolver;

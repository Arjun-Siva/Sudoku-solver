import React, { Component } from 'react';
import Cell from './../Cell/Cell';
import './Grid.css';

class Grid extends Component{
    constructor(props){
        super(props);
        this.state = {
            cells:this.initCells(),
            useHeuristic: true,
        };
        this.block_starting_index = this.blockIndices();
        this.backtrackCount = 0;
    }

    blockIndices = () => {
        // Stores the starting indices of the each block/sector
        var block_ind = {};var i = 0;
        for(let r = 0; r < 3;r++) {
            for( let c = 0; c < 3; c++) {
                block_ind[i] = [r*3,c*3];
                i++;
            }
        }
        return block_ind;
    }

    initCells = () => {
        // Initiate all cells/squares to empty string
        let cells = new Array(9);
        for (let index = 0; index < 9; index++) {
            cells[index] = new Array(9);            
        }
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                cells[row][col] = {
                    val : "",
                    unstable : false,
                    block: 3 * Math.floor(row/3) + Math.floor(col/3),
                }
            }
        }
        return cells;
    }

    toggleHeuristic = (event) => {
        // To use or not use heuristic
        let value = event.target.value;
        if (value === "YES") {
            this.setState({useHeuristic: true});
        }
        else{
            this.setState({useHeuristic: false});
        }
    }

    handleReset = () => {
        // Resets all cells to empty string
        this.setState({cells: this.initCells()});
        this.backtrackCount = 0;
    }

    handleChange = (row,col,newVal) => { 
        // Invoked when there is a change in value in any of the cells
        let newArray = JSON.parse(JSON.stringify(this.state.cells));
        
        newArray[row][col].val = newVal;
        
        let updatedMatrix = this.checkAllCellsStability(newArray);
        this.setState({cells: updatedMatrix});
    }

    checkStability = (newArray, row, col) => {
        // Check if a value in a given cell is consistency of all Sudoku rules
        if (newArray[row][col].val === "") {
            return newArray;
        }

        let block = newArray[row][col].block;
        //check entire row
        for(let i = 0; i < 9; i++) {
            if(i===col)
                continue;

            if(newArray[row][i].val === newArray[row][col].val){
                newArray[row][i].unstable = true;
                newArray[row][col].unstable = true;
            }
        }

        //check entire column
        for(let j = 0; j < 9; j++) {
            if(j===row)
                continue;

            if(newArray[j][col].val === newArray[row][col].val){
                newArray[j][col].unstable = true;
                newArray[row][col].unstable = true;
            }
        }

        var [i, j] = this.block_starting_index[block];
        for(let r=i;r<i+3;r++) {
            for(let c=j;c<j+3;c++) {
                if(! ["1","2","3","4","5","6","7","8","9",""].includes(newArray[r][c].val))
                    newArray[r][c].unstable = true;

                if(r===row && c===col)
                    continue;

                if(newArray[r][c].val === newArray[row][col].val){
                    newArray[r][c].unstable = true;
                    newArray[row][col].unstable = true;
                }
            }
        }

        return newArray;
    }

    checkAllCellsStability = (cellArray) => {
        // Checks the consistency of all the cells
        for(let i = 0; i < 9; i++) {
            for (let j = 0; j< 9; j++) {
                cellArray[i][j].unstable = false;
            }
        }

        for(let row = 0; row < 9; row++) {
            for(let col = 0; col < 9; col++){
                cellArray = this.checkStability(cellArray, row, col);
            }
        }
        return cellArray;
    }

    possibleNumbers = (tempArray, row, col) => {
        // The potential numbers that can be filled in an empty cell at a given configuration
        if(tempArray[row][col].val !== "")
            return [];
        
        var available = ["1","2","3","4","5","6","7","8","9"];
        let index;
        for (let i = 0; i < 9; i++) {
            index = available.indexOf(tempArray[row][i].val);
            if (index > -1) {
                available.splice(index, 1);
            }
        }
        for (let i = 0; i < 9; i++) {
            index = available.indexOf(tempArray[i][col].val);
            if (index > -1) {
                available.splice(index, 1);
            }
        }

        var block = tempArray[row][col].block;

        let [r, c] = this.block_starting_index[block];
        for(let i = r; i < r+3; i++) {
            for(let j = c;j < c+3; j++) {
                index = available.indexOf(tempArray[i][j].val);
                if (index > -1) {
                    available.splice(index, 1);
                }
            }
        }
        return available;
    }

    updateCellsAndPossible = (cell_n_p, cellsArray, row, col) => {
        // Update the potential values that can be filled in a empty cell
        var cells_and_possible = JSON.parse(JSON.stringify(cell_n_p));

        for(let i = 0; i < 9; i++) {
            if(cellsArray[row][i].val === "")
                cells_and_possible[row][i] = this.possibleNumbers(cellsArray, row, i);
        }

        for(let i = 0; i < 9; i++) {
            if(cellsArray[i][col].val === "")
                cells_and_possible[i][col] = this.possibleNumbers(cellsArray, i, col);
        }

        const block = cellsArray[row][col].block;
        const [r, c] = this.block_starting_index[block];
        for(let i = r;i < r+3; i++) {
            for(let j = c; j < c+3; j++) {
                if(cellsArray[i][j].val === "")
                    cells_and_possible[i][j] = this.possibleNumbers(cellsArray, i, j);
            }
        }

        return cells_and_possible;
    }

    nextCellToSolve = (cells_and_possible,cells) => {
        // If heuristics is toggled on, the next cell with the minimum number of potential numbers is selected.
        // Else, the next empty cell along the row is selected for filling next.
        if(this.state.useHeuristic) {
            var min = 10, r = -1, c = -1;
            for(let row=0;row<9;row++) {
                for(let col=0;col<9;col++) {
                    if(cells_and_possible[row][col].length < min && cells[row][col].val === "") {
                        min = cells_and_possible[row][col].length;
                        r = row;
                        c = col;
                    }
                }
            }
            return [r,c];
        }
        else{
            for(let row=0;row<9;row++) {
                for(let col=0;col<9;col++) {
                    if(cells[row][col].val === "") {
                        return [row, col];
                    }
                }
            }
            return [-1,-1];
        }
    }

    generateCellsAndPossible = (cells) => {
        // Generate a list of potential numbers that can be filled in all the cells
        var cells_and_possible = Array(9);
        for(let i = 0; i < 9;i++){
            cells_and_possible[i] = Array(9);
        }

        for(let i = 0; i < 9; i++) {
            for(let j = 0; j < 9; j++) {
                cells_and_possible[i][j] = this.possibleNumbers(cells, i , j);
            }
        }

        return cells_and_possible;
    }

    solvePuzzle = () => {
        // Solves the puzzle by backtracking if a solution exists
        let cells = JSON.parse(JSON.stringify(this.state.cells));
        this.backtrackCount = 0;

        for(let i = 0; i < 9; i++) {
            for(let j = 0; j < 9; j++) {
                if(cells[i][j].unstable){
                    alert("Invalid inputs");
                    return;
                }
            }
        }
        var cells_and_possible = this.generateCellsAndPossible(cells);
        var [nextr,nextc] = this.nextCellToSolve(cells_and_possible,cells);
        let [suc,newCells] = this.recursiveSolve(cells, cells_and_possible,nextr,nextc);
        if(suc) {
            this.setState({cells: newCells});
        }
        else{
            alert("No solutions exist");
        }
    }
    
    recursiveSolve(cellsArray, cells_n_p, r, c) {
        // Fills a given cell with a potential number and recursively fill the next cell.
        // If there are no potential numbers, then backtracks.

        this.backtrackCount = this.backtrackCount + 1;
        var nextr, nextc;
        var cells = JSON.parse(JSON.stringify(cellsArray));
        var cells_and_possible = JSON.parse(JSON.stringify(cells_n_p));

        if(r === -1 || c === -1) {
            return [true,cells];
        }

        const possibleNos = cells_and_possible[r][c];
        for(let i = 0; i< possibleNos.length; i++) {
            var num = possibleNos[i];
            cells[r][c].val = num;
            cells_and_possible = this.updateCellsAndPossible(cells_and_possible, cells, r, c);
            [nextr,nextc] = this.nextCellToSolve(cells_and_possible,cells);

            const [success, newCells] = this.recursiveSolve(cells, cells_and_possible, nextr, nextc);

            if(success) {
                return [true, newCells];
            }
        };

        return [false, cells];
    }

    generatePuzzle = () => {
        // Five numbers are randomly filled without breaking the consistency and then the sudoku is solved.
        // After solving, a random number of cells are emptied
        var rows = Array(10);
        var cols = Array(10);

        for(let i = 0; i < 5; i++) {
            rows[i] = Math.floor(Math.random() * 9);
            cols[i] = Math.floor(Math.random() * 9);
        }

        var cells = this.initCells();
        var cells_and_possible = this.generateCellsAndPossible(cells);
        var r,c, randR, randC;

        for(let i = 0; i < 5; i++) {
            r = rows[i]; c = cols[i];
            if(cells_and_possible[r][c].length > 0) {
                let randind = Math.floor( Math.random() * cells_and_possible[r][c].length);
                cells[r][c].val = cells_and_possible[r][c][randind];
            }
            else {
                cells[r][c].val = "";
            }
            cells_and_possible = this.updateCellsAndPossible(cells_and_possible, cells, r, c);
        }

        var [nextr,nextc] = this.nextCellToSolve(cells_and_possible,cells);
        let [suc,newCells] = this.recursiveSolve(cells, cells_and_possible,nextr,nextc);
        if(suc) {
            const n = Math.floor( Math.random() * 60) + 20;
            for(let j = 0; j < n; j++) {
                randR = Math.floor(Math.random() * 9);
                randC = Math.floor(Math.random() * 9);
                newCells[randR][randC].val = "";
            }
            this.backtrackCount = 0;
            this.setState({cells: newCells});
        }
        else{
            this.generateSolvablePuzzle();
        }   
    }

    render() {
        return(
            <div className="Container">
                <div onChange={this.toggleHeuristic.bind(this)} className="Heuristic">
                    <p>Use heuristic:</p>
                    <input type="radio" value="YES" name="heuristic" defaultChecked className="child"/> YES
                    <input type="radio" value="NO" name="heuristic" className="child"/> NO
                </div>
                <div>
                {
                    [...Array(9).keys()].map( (r) => {
                        return (
                        <div className="Column">
                            {
                                [...Array(9).keys()].map( (c) => {
                                    let details = {...this.state.cells[r][c]};
                                    return <Cell
                                            row={r} 
                                            col={c}
                                            unstable={details.unstable}
                                            onChange={this.handleChange}
                                            val={details.val}
                                            />
                                })
                            }
                        </div>
                        );
                    })
                }
                </div>
                <div className="Buttons">
                    <button onClick = {() => this.solvePuzzle()} className="solve">Solve</button>
                    <button onClick = {() => this.generatePuzzle()} className="generate">Generate puzzle</button>
                    <button onClick = {() => this.handleReset()} className="reset">Reset</button>
                </div>
                <p>Number of backtracks: <b>{this.backtrackCount>0 ? this.backtrackCount -1: ""}</b></p>
            </div>
        )
    }
}

export default Grid;
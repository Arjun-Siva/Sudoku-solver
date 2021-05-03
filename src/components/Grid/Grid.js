import React, { Component } from 'react';
import Cell from './../Cell/Cell';

class Grid extends Component{
    constructor(props){
        super(props);
        this.state = {
            cells:this.initCells(),
        };
        this.block_starting_index = this.blockIndices();
        this.backtrackCount = 0;
    }

    blockIndices = () => {
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
        let cells = new Array(9);
        for (let index = 0; index < 9; index++) {
            cells[index] = new Array(9);            
        }
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                cells[row][col] = {
                    val : "",
                    unstable : false,
                    block: 3*Math.floor(row/3) + Math.floor(col/3),
                }
            }
        }
        return cells;
    }

    handleChange = (row,col,newVal) => {
        let newArray = JSON.parse(JSON.stringify(this.state.cells));
        
        newArray[row][col].val = newVal;

        let updatedMatrix = this.checkAllCellsStability(newArray);
        this.setState({cells: updatedMatrix});
    }

    checkStability = (newArray, row, col) => {
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
        for(let i=r;i<r+3;i++) {
            for(let j=c;j<c+3;j++) {
                index = available.indexOf(tempArray[i][j].val);
                if (index > -1) {
                    available.splice(index, 1);
                }
            }
        }
        return available;
    }

    updateCellsAndPossible = (cell_n_p, cellsArray, row, col) => {
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
        for(let i=r;i<r+3;i++) {
            for(let j=c;j<c+3;j++) {
                if(cellsArray[i][j].val === "")
                    cells_and_possible[i][j] = this.possibleNumbers(cellsArray, i, j);
            }
        }

        return cells_and_possible;
    }

    nextCellToSolve = (cells_and_possible,cells) => {
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

    generateCellsAndPossible = (cells) => {
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
        let cells = JSON.parse(JSON.stringify(this.state.cells));

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
            console.log(this.backtrackCount);
            this.setState({cells: newCells});
        }
        else{
            alert("No solutions exist")
        }
    }
    
    recursiveSolve(cellsArray, cells_n_p, r, c) {
        this.backtrackCount = this.backtrackCount + 1;
        console.log(this.backtrackCount)
        var nextr, nextc;
        var cells = JSON.parse(JSON.stringify(cellsArray));
        var cells_and_possible = JSON.parse(JSON.stringify(cells_n_p));

        if(r === -1 || c === -1) {
            //this.setState({cells: cells});
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
        //console.log(`Failed at ${r}, ${c}`);
        return [false, cells];
    }

    generatePuzzle = () => {
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
            this.setState({cells: newCells});
        }
        else{
            this.generateSolvablePuzzle();
        }   
    }

    render() {
        return(
            <div className="Container">
                {
                    [...Array(9).keys()].map( (r) => {
                        return <div style={{display:'flex'}} className="box">
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
                    })
                }
                <button onClick = {() => this.solvePuzzle()}>Solve</button>
                <button onClick = {() => this.generatePuzzle()}>Generate puzzle</button>
            </div>
        )
    }
}

export default Grid;
import React, { Component } from 'react';
import Cell from './../Cell/Cell';

class Grid extends Component{
    constructor(props){
        super(props);
        this.state = {
            cells:this.initCells(),
            block_starting_index: this.blockIndices(),
            possible_placeholders: 0,
        };
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
        let newArray = [];

        for (var i = 0; i < 9; i++)
            newArray[i] = this.state.cells[i].slice()
        
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

        var [i, j] = this.state.block_starting_index[block];
        for(let r=i;r<i+3;r++) {
            for(let c=j;c<j+3;c++) {
                if((parseInt(newArray[r][c].val) > 9 || parseInt(newArray[r][c].val) < 1) && newArray[r][c].val !== "")
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
        var available = ["1","2","3","4","5","6","7","8","9"];
        for (let i = 0; i < 9; i++) {
            let index = available.indexOf(tempArray[row][i].val);
            if (index > -1) {
                available.splice(index, 1);
            }
        }
        for (let i = 0; i < 9; i++) {
            let index = available.indexOf(tempArray[i][col].val);
            if (index > -1) {
                available.splice(index, 1);
            }
        }

        var block = tempArray[row][col].block;

        let [c, r] = this.state.block_starting_index[block];
        for(let i=r;r<r+3;i++) {
            for(let j=c;j<c+3;j++) {
                let index = available.indexOf(tempArray[i][j].val);
                if (index > -1) {
                    available.splice(index, 1);
                }
            }
        }

        return available;
    }

    nextCellToSolve = (cells_and_possible) => {
        var min = 10, r = -1, c = -1;
        for(var row in cells_and_possible) {
            for(var col in cells_and_possible[row]) {
                if(cells_and_possible[row][col].length < min && cells_and_possible[row][col].length > 0) {
                    min = cells_and_possible[row][col].length;
                    r = row;
                    c = col;
                }
            }
        }

        return [r,c];
    }

    solvePuzzle = () => {
        var cellArray = this.state.cells;
        var cells_and_possible = {};
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if(cellArray[i][j].val !== ""){
                    continue;
                }
                else{
                    let available = this.possibleNumbers(cellArray, i, j);
                    
                    try{
                        cells_and_possible[i][j] = available;
                    }
                    catch(err){
                        cells_and_possible[i] = {};
                        cells_and_possible[i][j] = available;
                    }
                }
            }
        }

        var [next_r,next_c] = this.nextCellToSolve(cells_and_possible);
        var [success, newCellArray] = this.recursiveBackTrack(cellArray,cells_and_possible,next_r,next_c)
        if(success)
            this.setState({cells:newCellArray});
        else
            console.log("Failed :(");
            
    }

    recursiveBackTrack = (cellArray, cells_and_possible, row, col) => {
        var available = cells_and_possible[row][col];
        for(var newVal in available) {
            cellArray[row][col].val = newVal;

            for(let i = 0; i < 9; i++) {
                if(i===col)
                    continue;
    
                cells_and_possible[row][i] = this.possibleNumbers(cellArray, row, i);
            }
    
            //check entire column
            for(let j = 0; j < 9; j++) {
                if(j===row)
                    continue;
    
                cells_and_possible[j][col] = this.possibleNumbers(cellArray, j, col);
            }

            var block = cellArray[row][col].block;    
            var [i, j] = this.state.block_starting_index[block];
            for(let r=i;r<i+3;r++) {
                for(let c=j;c<j+3;c++) {
                    cells_and_possible[i][j] = this.possibleNumbers(cellArray, i, j);
                }
            }

            var [next_r,next_c] = this.nextCellToSolve(cells_and_possible);
            if(next_r === -1 && next_c === -1)
                return cellArray;
                
            var [success, newCellArray] = this.recursiveBackTrack(cellArray, cells_and_possible, next_r, next_c);
            if(success)
                return ([true, newCellArray])
        }
        return [false,null];
    } 

    render() {
        return(
            <div>
                {
                    [...Array(9).keys()].map( (r) => {
                        return <div style={{display:'flex'}}>
                        {
                        [...Array(9).keys()].map( (c) => {
                            let details = {...this.state.cells[r][c]};
                            return <Cell 
                                    row={r} 
                                    col={c}
                                    unstable={details.unstable}
                                    onChange={this.handleChange}
                                    />
                        })
                        }
                        </div>
                    })
                }
                <button onClick = {() => this.solvePuzzle()}>Solve</button>
            </div>
        )
    }
}

export default Grid;
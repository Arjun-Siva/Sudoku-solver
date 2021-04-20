import React, { Component } from 'react';
import Cell from './../Cell/Cell';

class Grid extends Component{
    constructor(props){
        super(props);
        this.state = {
            cells:this.initCells(),
        };
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
        if((newVal < 1 || newVal > 9) && newVal!==""){
            updatedMatrix[row][col].unstable = true;
        }
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

        //check block
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if(r===row && c===col)
                    continue;
                if(newArray[r][c].block === block && newArray[r][c].val === newArray[row][col].val){
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

    fixNumbers = () => {
        let newArray = [];

        for (var i = 0; i < 9; i++)
            newArray[i] = this.state.cells[i].slice()
    
        for (let i = 0; i<9; i++) {
            for (let j = 0; j<9; j++) {
                if(newArray[i][j].val !== "")
                    newArray[i][j].fixed = true;
            }
        }
        this.setState({cells: newArray})
    }

    possibleNumbers = (tempArray, row, col) => {
        let available = ["1","2","3","4","5","6","7","8","9"];
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

        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (tempArray[r][c].block === block) {
                    let index = available.indexOf(tempArray[r][c].val);
                    if (index > -1) {
                        available.splice(index, 1);
                    }
                }
            }
        }

        return available;
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

        console.log(cells_and_possible);
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
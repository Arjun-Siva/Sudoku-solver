import React, { Component } from 'react';
import Cell from './../Cell/Cell';

class Grid extends Component{
    constructor(props){
        super(props);
        this.state = {
            cells:this.initCells(),
            block_starting_index: this.blockIndices(),
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
        if(tempArray[row][col].val !== "")
            return [];
        
        var available = ["1","2","3","4","5","6","7","8","9"];
        let index;
        for (let i = 0; i < 9; i++) {
            index = available.indexOf(tempArray[row][i].val);
            // console.log("index:"+index)
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

        let [r, c] = this.state.block_starting_index[block];
        for(let i=r;i<r+3;i++) {
            for(let j=c;j<c+3;j++) {
                index = available.indexOf(tempArray[i][j].val);
                if (index > -1) {
                    available.splice(index, 1);
                }
            }
        }
        //console.log("Returning possible:"+available);
        return available;
    }

    updateCellsAndPossible = (cellsArray) => {
        let cells = JSON.parse(JSON.stringify(cellsArray));
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

    nextCellToSolve = (cells_and_possible) => {
        var min = 10, r = -1, c = -1;
        for(let row=0;row<9;row++) {
            for(let col=0;col<9;col++) {
                try{
                if(cells_and_possible[row][col].length < min && cells_and_possible[row][col].length > 0) {
                    min = cells_and_possible[row][col].length;
                    r = row;
                    c = col;
                }}
                catch(error){
                    console.log("cell&arr:"+cells_and_possible);
                    window.stop();
                }
            }
        }
        console.log("r:"+r+",c:"+c+",no.:"+min);
        return [r,c];
    }

    notComplete = (cells) => {
        for(let i = 0; i< 9; i++) {
            for(let j = 0; j < 9; j++){
                if(cells[i][j].val === "")
                    return true;
            }
        }
        return false;
    }

    solvePuzzle = () =>{
        let cells = JSON.parse(JSON.stringify(this.state.cells));
        var cells_and_possible = Array(9);
        var last = {};
        for(let i = 0; i < 9;i++){
            cells_and_possible[i] = Array(9);
        }
        for(let i = 0; i < 9; i++) {
            last[i] = {};
            for(let j = 0; j < 9; j++) {
                cells_and_possible[i][j] = this.possibleNumbers(cells, i , j);
                last[i][j] = 0;
            }
        }

        
        let available;
        var [r,c] = this.nextCellToSolve(cells_and_possible);
        var prev = [r,c];
        while(this.notComplete(cells)) {
            if([r,c] === [-1,-1]){
                [r,c] = prev;
                continue;
            }
            console.log([r,c]);
            available = cells_and_possible[r][c];
            if(available.length === 0) {
                [r,c] = prev;
            }
            else{
                cells[r][c].val = available[last[r][c]];
                last[r][c] = last[r][c] + 1;
                cells_and_possible = this.updateCellsAndPossible(cells);
                [r,c] = this.nextCellToSolve(cells_and_possible);
                prev = [r,c];
            }
            
        }
        this.setState({cells: cells});
    }

    recursiveBacktrack = (cellsArray , r, c, count) => {
        let cells = JSON.parse(JSON.stringify(cellsArray));
        console.log(count);
        if(r>8) {
            return [true, cells];
        }
        let next_r, next_c;

        if(c===8) {
            next_r = r + 1;
            next_c = 0;
        }
        else{
            next_r = r;
            next_c = c+1;
        }

        if( cells[r][c].val !== "") {
            return this.recursiveBacktrack(cells, next_r, next_c, count+1);
        }
        else {
            var available = this.possibleNumbers(cells,r,c);
            available.forEach((num) => {
                cells[r][c].val = num;
                let [success, newCells] = this.recursiveBacktrack(cells, next_r, next_c, count+1);
                if(success) {
                    return [true, newCells];
                }
            });
            console.log("Failed at:"+r+","+c);
            cells[r][c].val = "";
            return [false, cells];
        }
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
                                    val={details.val}
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
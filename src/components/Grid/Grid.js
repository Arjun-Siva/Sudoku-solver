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

        let [r, c] = this.block_starting_index[block];
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

    updateCellsAndPossible = (cell_n_p,cellsArray,row,col) => {
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
                if(cellsArray[i][col].val === "")
                    cells_and_possible[i][j] = this.possibleNumbers(cellsArray, i, j);
            }
        }

        return cells_and_possible;
    }

    nextCellToSolve = (cells_and_possible,cells) => {
        var min = 10, r = -1, c = -1;
        for(let row=0;row<9;row++) {
            for(let col=0;col<9;col++) {
                try{
                if(cells_and_possible[row][col].length < min && cells[row][col].val === "") {
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
        //console.log("r:"+r+",c:"+c+",no.:"+min);
        return [r,c];
    }

    solvePuzzle = () =>{
        let cells = JSON.parse(JSON.stringify(this.state.cells));
        var cells_and_possible = Array(9);
        for(let i = 0; i < 9;i++){
            cells_and_possible[i] = Array(9);
        }
        for(let i = 0; i < 9; i++) {
            for(let j = 0; j < 9; j++) {
                cells_and_possible[i][j] = this.possibleNumbers(cells, i , j);
            }
        }
        
        var [nextr,nextc] = this.nextCellToSolve(cells_and_possible,cells);
        let suc = this.recursiveSolve(cells, cells_and_possible,nextr,nextc);
        console.log("count:" + this.backtrackCount);
    }
    
    recursiveSolve(cellsArray, cells_n_p, r, c) {
        this.backtrackCount = this.backtrackCount + 1;
        if(r === -1 || c === -1) {
            this.setState({cells: cellsArray});

            return true;
        }
        var nextr, nextc;
        var cells = JSON.parse(JSON.stringify(cellsArray));
        var cells_and_possible = JSON.parse(JSON.stringify(cells_n_p));
        //console.log("current cell:"+r+","+c);

        const possibleNos = cells_and_possible[r][c];
        possibleNos.forEach(num => {
            //console.log(r,c,num);
            cells[r][c].val = num;
            cells_and_possible = this.updateCellsAndPossible(cells_and_possible, cells, r, c);
            [nextr,nextc] = this.nextCellToSolve(cells_and_possible,cells);
            let success = this.recursiveSolve(cells, cells_and_possible, nextr, nextc);
            if(success) {
                //console.log("success"+r+","+c)
                // return ([true, newCells]);
                return true;
            }
            //console.log("Failed at:"+r+","+c);
        });
        //console.log("All tries failed:"+r+","+c);
        return false;
        
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
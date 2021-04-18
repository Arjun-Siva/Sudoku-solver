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
        var cells = new Array(9);
        for (let index = 0; index < 9; index++) {
            cells[index] = new Array(9);            
        }
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                cells[row][col] = {
                    val : "",
                    unstable : false,
                    fixed: false,
                    block: 3*Math.floor(row/3) + Math.floor(col/3),
                }
            }
        }
        return cells;
    }

    handleChange = (row,col,newVal) => {
        var newArray = [];

        for (var i = 0; i < 9; i++)
            newArray[i] = this.state.cells[i].slice()
            
        newArray[row][col].val = newVal;

        var updatedMatrix = this.checkStability(newArray, row, col);
        this.setState({cells: updatedMatrix});
        console.log(`Changed state:${newVal}`)
    }

    checkStability = (newArray, row, col) => {
        var block = newArray[row][col].block;
        console.log("checking stability")
        //check entire row
        for(var i = 0; i < 9; i++) {
            if(i===col)
                continue;

            if(newArray[row][i] === newArray[row][col]){
                newArray[row][i].unstable = true;
                newArray[row][col].unstable = true;
                console.log(`Change row stab ${row},${i}`)
            }
        }

        //check entire column
        for(var j = 0; j < 9; j++) {
            if(j===row)
                continue;

            if(newArray[j][col] === newArray[row][col]){
                newArray[j][col].unstable = true;
                newArray[row][col].unstable = true;
            }
        }

        //check block
        for (var r = 0; r < 9; r++) {
            for (var c = 0; c < 9; c++) {
                if(r===row && c===col)
                    continue;
                if(newArray[r][c].block === block){
                    newArray[r][c].unstable = true;
                    newArray[row][col].unstable = true;
                }
            }
        }

        return newArray;
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
                            //let y = r*10 + c;
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
            </div>
        )
    }
}

export default Grid;
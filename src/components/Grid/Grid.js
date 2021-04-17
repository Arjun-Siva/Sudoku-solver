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
                    val : null,
                    unstable : false,
                    fixed: false,
                }
            }
        }
        return cells;
    }

    handleChange = (row,col,newVal) => {

    }

    render(){
        return(
            <div>
                {
                    [...Array(9).keys()].map( (r) => {
                        [...Array(9).keys()].map( (c) => {
                            let details = {...this.state.cells[r][c]};
                            return <Cell 
                                    row={r} 
                                    col={c} 
                                    val={details.val} 
                                    unstable={details.unstable} 
                                    fixed={details.fixed} 
                                    onChange={()=>this.handleChange()}
                                    />
                        })
                    })
                }
            </div>
        )
    }
}

export default Grid;
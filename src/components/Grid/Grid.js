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
        this.setState({cells: newArray});
        console.log(`Changed state:${newVal}`)
    }

    render(){
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
                                    //val={details.val} 
                                    unstable={details.unstable} 
                                    fixed={details.fixed} 
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
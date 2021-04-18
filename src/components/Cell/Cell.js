import React, { Component } from 'react';
import './Cell.css';

class Cell extends Component{
    handleChange = (val) => {
        this.props.onChange(this.props.row, this.props.col, val);
    }

    render(){

        return(
            <div>
                <input type="number" min="1" max="9" 
                    onChange={event => {this.handleChange(event.target.value)}} 
                    className={"Input"+(this.props.unstable) ? " Unstable" : ""}/>
            </div>
        )
    }
}

export default Cell;
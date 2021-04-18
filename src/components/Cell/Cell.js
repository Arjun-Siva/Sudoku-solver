import React, { Component } from 'react';
import './Cell.css';

class Cell extends Component{
    handleChange = (val) => {
        this.props.onChange(this.props.row, this.props.col, val);
    }

    addUnstability = () => {
        if(this.props.unstable)
            return " Unstable";
        else
            return "";
    }

    render(){

        return(
            <div>
                <input type="number" min="1" max="9" 
                    onChange={event => {this.handleChange(event.target.value)}} 
                    className={"Input"+ this.addUnstability()}/>
            </div>
        )
    }
}

export default Cell;
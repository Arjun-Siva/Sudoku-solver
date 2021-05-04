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
            <div className={"r"+ this.props.row + " c"+ this.props.col}>
                <input type="number" min="1" max="9" 
                    onChange={event => {this.handleChange(event.target.value)}} 
                    className={"Input"+ this.addUnstability()}
                    value={this.props.val}
                />
            </div>
        )
    }
}

export default Cell;
import React, { Component } from 'react';

class Cell extends Component{
    handleChange = (val) => {
        this.props.onChange(this.props.row, this.props.col, val);
    }

    render(){

        return(
            <div>
                <input type="number" min="1" max="9" onChange={event => {this.handleChange(event.target.value)}} />
            </div>
        )
    }
}

export default Cell;
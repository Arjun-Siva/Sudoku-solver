import React, { Component } from 'react';

class Cell extends Component{
    handleChange = (event) => {
        this.props.onChange(this.props.row, this.props.col, event.target.value);
    }

    render(){

        return(
            <div>
                <input type="number" onChange={this.handleChange()} value={this.props.val} />
            </div>
        )
    }
}

export default Cell;
import React from 'react';

class Cell extends React.Component {
    render() {
        return (
            <div className="col">
                <div className="cell" style={{ backgroundColor: this.props.backgroundColor }}>
                    {this.props.value}
                </div>
            </div>
        );
    }
}

export default Cell;
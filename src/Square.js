import React from 'react';

export default class Square extends React.PureComponent {
    render() {
        let contents = ' ';
        let colour = 'skyblue';

        switch (this.props.squareState.displayState) {
            case 'covered':
                break;
            case 'uncovered':
                contents = this.props.squareState.surroundingMines || ' ';
                colour = 'white';
                break;
            case 'flagged':
                contents = 'F';
                colour = 'yellow';
                break;
            case 'maybe':
                contents = '?';
                colour = 'lime';
                break;
            case 'detonated':
                contents = 'X';
                colour = 'black';
                break;
        }

        return (
            <td key={this.props.x + ' ' + this.props.y} style={{backgroundColor: colour}}>
                <button type='button'
                        disabled={!this.props.gameInProgress || ['uncovered', 'detonated'].includes(this.props.squareState.displayState)}
                        onClick={this.props.gameInProgress ? this.props.onClick : undefined}
                        onDoubleClick={this.props.gameInProgress ? this.props.onDoubleClick : undefined}
                        onContextMenu={this.props.gameInProgress ? this.props.onRightClick : undefined}
                >
                    {contents}
                </button>
            </td>
        );
    }
}

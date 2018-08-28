import React from 'react';
import Square from './Square';

export default class GameBoard extends React.Component {
    render() {
        return (
            <table>
                <tbody>
                    {
                        this.props.squares[0].map((row, y) =>
                            <tr key={y}>
                                {
                                    this.props.squares.map((_, x) =>
                                        <Square key={x + ',' + y}
                                                x={x}
                                                y={y}
                                                gameInProgress={this.props.isGameActive}
                                                onClick={e => this.props.handleSquareClick(e, x, y)}
                                                onDoubleClick={() => this.props.handleSquareDoubleClick(x, y)}
                                                onRightClick={e => this.props.handleSquareRightClick(e, x, y)}
                                                squareState={this.props.squares[x][y]}
                                        />
                                    )
                                }
                            </tr>
                        )
                    }
                </tbody>
            </table>
        );
    }
}

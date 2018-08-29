import React from 'react';
import Square from './Square';
import SquareDataInterface from './interfaces/SquareDataInterface';

export interface Props {
    squares: SquareDataInterface[][];

    isGameActive: boolean;

    handleSquareClick: (e: React.MouseEvent, x: number, y: number) => void;
    handleSquareRightClick: (e: React.MouseEvent, x: number, y: number) => void;
    handleSquareDoubleClick: (x: number, y: number) => void;
}

/**
 * Class representing the game board
 */
export default class GameBoard extends React.Component<Props> {
    render() {
        return (
            <table>
                <tbody>
                    {
                        this.props.squares[0].map((_row, y) =>
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

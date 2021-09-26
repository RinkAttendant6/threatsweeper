import React, { KeyboardEvent, MouseEvent } from 'react';
import Square from './Square';
import ISquareDataInterface, {
    DisplayState,
} from './interfaces/ISquareDataInterface';
import { numericSort, numericSortDescending } from './utils/arrays';

export enum NavigationDirection {
    Up,
    Down,
    Left,
    Right,
    Start,
    End,
    Top,
    Bottom,
}

export interface Props {
    squares: ISquareDataInterface[][];

    isGameActive: boolean;

    handleSquareClick: (x: number, y: number) => void;
    handleSquareRightClick: (x: number, y: number) => void;
    handleSquareDoubleClick: (x: number, y: number) => void;
}

interface State {
    activeRow: number | null;
    activeCol: number | null;
}

/**
 * Class representing the game board
 */
export default class GameBoard extends React.Component<Props, State> {
    /**
     * Get a column of the game board
     */
    #getColumn(col: number): ISquareDataInterface[] {
        return this.props.squares[col];
    }

    /**
     * Get a row of the game board
     */
    #getRow(row: number): ISquareDataInterface[] {
        return this.props.squares.map((colSquares) => colSquares[row]);
    }

    /**
     * Handle navigating the game board using a keyboard
     */
    #handleKeyboardNavigation(
        e: KeyboardEvent,
        col: number,
        row: number,
        direction: NavigationDirection
    ): void {
        e.preventDefault();

        let targetCol = -1;
        let targetRow = -1;

        const isFocusable = (square: ISquareDataInterface): boolean =>
            !(
                square.displayState === DisplayState.Uncovered &&
                square.surroundingMines === 0
            );

        const rowOfCurrentColumn = this.#getColumn(col);
        const columnOfCurrentRow = this.#getRow(row);

        const focusableRows: number[] = rowOfCurrentColumn
            .map((row, idx) => (isFocusable(row) ? idx : -1))
            .filter((row) => row > -1);

        const focusableColumns: number[] = columnOfCurrentRow
            .map((col, idx) => (isFocusable(col) ? idx : -1))
            .filter((col) => col > -1);

        switch (direction) {
            case NavigationDirection.Up:
                targetRow =
                    focusableRows
                        .sort(numericSortDescending)
                        .find((idx) => idx < row) ?? row;
                break;
            case NavigationDirection.Down:
                targetRow =
                    focusableRows.sort(numericSort).find((idx) => idx > row) ??
                    row;
                break;
            case NavigationDirection.Left:
                targetCol =
                    focusableColumns
                        .sort(numericSortDescending)
                        .find((idx) => idx < col) ?? col;
                break;
            case NavigationDirection.Right:
                targetCol =
                    focusableColumns
                        .sort(numericSort)
                        .find((idx) => idx > col) ?? col;
                break;
            case NavigationDirection.Start:
                targetCol = focusableColumns.shift() ?? col;
                break;
            case NavigationDirection.End:
                targetCol = focusableColumns.pop() ?? col;
                break;
            case NavigationDirection.Top:
                targetRow = focusableRows.shift() ?? row;
                break;
            case NavigationDirection.Bottom:
                targetRow = focusableRows.pop() ?? row;
                break;
        }

        if (targetCol === -1) targetCol = col;
        if (targetRow === -1) targetRow = row;

        this.setState({
            activeCol: targetCol,
            activeRow: targetRow,
        });
    }

    constructor(props: Props) {
        super(props);
        this.state = {
            activeCol: null,
            activeRow: null,
        };
    }

    render() {
        return (
            <table onContextMenu={(e: MouseEvent) => e.preventDefault()}>
                <tbody>
                    {this.props.squares[0].map((_row, y) => (
                        <tr key={y}>
                            {this.props.squares.map((_, x) => (
                                <Square
                                    key={x + ',' + y}
                                    x={x}
                                    y={y}
                                    gameAvailable={this.props.isGameActive}
                                    onClick={() =>
                                        this.props.handleSquareClick(x, y)
                                    }
                                    onDoubleClick={() =>
                                        this.props.handleSquareDoubleClick(x, y)
                                    }
                                    onRightClick={() =>
                                        this.props.handleSquareRightClick(x, y)
                                    }
                                    onNavigate={(e, direction) =>
                                        this.#handleKeyboardNavigation(
                                            e,
                                            x,
                                            y,
                                            direction
                                        )
                                    }
                                    squareState={this.props.squares[x][y]}
                                    isFocused={
                                        this.state.activeCol === x &&
                                        this.state.activeRow === y
                                    }
                                />
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    }
}

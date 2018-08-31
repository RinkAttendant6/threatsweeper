import React from 'react';
import GameBoard from './GameBoard';
import SquareDataInterface, {DisplayState} from "./interfaces/SquareDataInterface";

export interface Props {
    width: number;
    height: number;
    mines: number;
}

export interface State {
    squares: SquareDataInterface[][];
    mines: Set<string>;
    timer: number;
    won: boolean;
    lost: boolean;
}

/**
 * Class representing the game
 */
export default class Game extends React.Component<Props, State> {
    private timerID: number|null;

    constructor(props: Props) {
        super(props);

        this.timerID = null;

        this.state = {
            squares: [[]],
            mines: new Set(),
            timer: 0,
            won: false,
            lost: false
        };
    }

    /**
     * Initialize the array that holds all information about the squares on the game board
     */
    initializeSquaresArray(mines: Set<string>): SquareDataInterface[][] {
        let {width, height} = this.props;
        let squares: SquareDataInterface[][] = [];

        for (let i = 0; i < width; ++i) {
            squares[i] = [];

            for (let j = 0; j < height; ++j) {
                squares[i][j] = {
                    surroundingMines: this.computeSurroundingMines(mines, i, j),
                    displayState: DisplayState.Covered
                };
            }
        }

        return squares;
    }

    /**
     * Determine the number of surrounding mines for a given square
     */
    computeSurroundingMines(mines: Set<string>, x: number, y: number): number {
        if (mines.has(x + ',' + y)) {
            return -1;
        }

        const choices = [
            [x - 1, y - 1],
            [x - 1, y ],
            [x - 1, y + 1],
            [x, y - 1],
            [x, y + 1],
            [x + 1, y - 1],
            [x + 1, y ],
            [x + 1, y + 1]
        ];

        return choices.reduce((acc: number, [v, h]): number => {
            const inBounds = v >= 0 && v < this.props.width && h >= 0 && h < this.props.height;
            return acc + (inBounds ? Number(mines.has(v + ',' + h)) : 0);
        }, 0);
    }

    /**
     * Starts a new game
     */
    startNewGame(): void {
        this.stopTimer();

        const mines = this.generateMines();
        const squares = this.initializeSquaresArray(mines);

        this.startTimer();

        this.setState({
            squares: squares,
            mines: mines,
            timer: 0,
            won: false,
            lost: false
        });
    }

    componentDidMount() {
        this.startNewGame();
    }

    componentWillUnmount() {
        this.stopTimer();
    }

    /**
     * Generates a set of mines
     */
    generateMines(): Set<string> {
        let mines = new Set();

        while (mines.size < this.props.mines) {
            let x = Math.floor(Math.random() * Math.floor(this.props.width));
            let y = Math.floor(Math.random() * Math.floor(this.props.height));
            mines.add(x + ',' + y);
        }

        return mines;
    }

    /**
     * Starts a timer
     */
    startTimer() {
        this.timerID = window.setInterval(
            () => this.tick(),
            1000
        )
    }

    /**
     * Stops a timer
     */
    stopTimer() {
        if (this.timerID !== null) {
            window.clearInterval(this.timerID);
        }
    }

    private tick() {
        this.setState((prevState => this.setState({timer: prevState.timer + 1})));
    }

    /**
     * Handles winning game event
     */
    handleGameWin(): void {
        this.stopTimer();
        this.setState({won: true});
    }

    /**
     * Handles losing game event
     */
    handleGameLose(): void {
        this.stopTimer();
        this.setState({lost: true});
    }

    /**
     * Handles the click event of a square
     */
    handleSquareClick(event: React.MouseEvent<HTMLElement>, x: number, y: number): void {
        if (event.nativeEvent.which !== 1 || this.state.squares[x][y].displayState !== DisplayState.Covered) {
            // Not left click or clicked on invalid square
            return;
        }

        let newSquares = this.state.squares.slice();

        const surroundingMines = this.state.squares[x][y].surroundingMines
        const newState: DisplayState = surroundingMines === -1 ? DisplayState.Detonated : DisplayState.Uncovered;

        newSquares[x][y].displayState = newState;

        if (newState === DisplayState.Uncovered && surroundingMines === 0) {
            newSquares = this._revealAdjacentSquares(newSquares, x, y);
        }

        if (surroundingMines === -1) {
            this.handleGameLose();
        } else {
            const won = this.state.squares.every(column => column.every(s => s.displayState === DisplayState.Uncovered || s.surroundingMines === -1));

            if (won) {
                this.handleGameWin();
            }
        }

        this.setState({squares: newSquares});
    }

    /**
     * Reveals adjacent squares
     */
    private _revealAdjacentSquares(squares: SquareDataInterface[][], x: number, y: number): SquareDataInterface[][] {
        const choices = [
            [x - 1, y - 1],
            [x - 1, y ],
            [x - 1, y + 1],
            [x, y - 1],
            [x, y + 1],
            [x + 1, y - 1],
            [x + 1, y ],
            [x + 1, y + 1]
        ];

        const coveredAdjacentSquares = choices.filter(([v, h]) => {
            const inBounds = v >= 0 && v < this.props.width && h >= 0 && h < this.props.height;
            return inBounds && squares[v][h].displayState === DisplayState.Covered;
        });

        for (let [v, h] of coveredAdjacentSquares) {
            squares[v][h].displayState = DisplayState.Uncovered;

            if (squares[v][h].surroundingMines === 0) {
                this._revealAdjacentSquares(squares, v, h);
            }
        }

        return squares;
    }

    /**
     * Handles the right-click event of a square
     */
    handleSquareRightClick(event: React.MouseEvent<HTMLElement>, x: number, y: number): void {
        event.preventDefault();

        const stateTransitions: DisplayState[] = [
            DisplayState.Covered,
            DisplayState.Flagged,
            DisplayState.Maybe
        ];

        let currentSquareStateIdx = stateTransitions.indexOf(this.state.squares[x][y].displayState);

        if (currentSquareStateIdx < 0) {
            // Right-clicking shouldn't do anything
            return;
        }

        let newSquareStateIdx: number = (currentSquareStateIdx + 1) % stateTransitions.length;
        let newSquareState: DisplayState = stateTransitions[newSquareStateIdx];

        let newSquares = this.state.squares.slice();
        newSquares[x][y].displayState = newSquareState;

        this.setState({squares: newSquares});
    }

    /**
     * Handles the double-click event of a square
     */
    handleSquareDoubleClick(x: number, y: number): void {
        // TODO handle double click to reveal squares
        console.log('Double clicked on square %d %d', x, y);
    }

    render() {
        const isGameInProgress = !this.state.won && !this.state.lost;
        const numberOfFlags = this.state.squares.reduce((acc, column): number => {
            return acc + column.reduce((acc, cell): number => {
                return acc + Number(cell.displayState === DisplayState.Flagged);
            }, 0);
        }, 0);

        return <>
            <button type='button' disabled={isGameInProgress} onClick={() => this.startNewGame()}>
                New game
            </button>
            <div className='header' style={{textAlign: 'center'}}>
                <p>Time: {this.state.timer} seconds</p>
                <p>Flags: {numberOfFlags} / {this.state.mines.size}</p>
            </div>
            <GameBoard
                squares={this.state.squares}
                handleSquareClick={this.handleSquareClick.bind(this)}
                handleSquareRightClick={this.handleSquareRightClick.bind(this)}
                handleSquareDoubleClick={this.handleSquareDoubleClick.bind(this)}
                isGameActive={isGameInProgress}
            />
            {
                this.state.won && <p>Congratulations!</p>
            }
            {
                this.state.lost && <p>Better luck next time! </p>
            }
        </>;
    }
}

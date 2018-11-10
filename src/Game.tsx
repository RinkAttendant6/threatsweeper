import React from 'react';
import GameBoard from './GameBoard';
import IGameLevelInterface from './interfaces/IGameLevelInterface';
import Levels from './Levels';
import LevelSelectorDialog from './LevelSelectorDialog';
import Modal from 'react-modal';
import ISquareDataInterface, {DisplayState} from './interfaces/ISquareDataInterface';

export interface State {
    level: IGameLevelInterface;

    mines: Set<string>;
    squares: ISquareDataInterface[][];

    timer: number;

    lost: boolean;
    won: boolean;

    newGameDialogOpen: boolean;
}

/**
 * Class representing the game
 */
export default class Game extends React.Component<{}, State> {
    private timerID: number|null;

    constructor(props = {}) {
        super(props);

        this.timerID = null;

        this.state = {
            level: Levels.EASY,

            mines: new Set(),
            squares: [[]],
            timer: 0,

            won: false,
            lost: false,

            newGameDialogOpen: false
        };
    }

    /**
     * Initialize the array that holds all information about the squares on the game board
     */
    private initializeSquaresArray(mines: Set<string>): ISquareDataInterface[][] {
        let {width, height} = this.state.level;
        let squares: ISquareDataInterface[][] = [];

        for (let i = 0; i < width; ++i) {
            squares[i] = [];

            for (let j = 0; j < height; ++j) {
                squares[i][j] = {
                    displayState: DisplayState.Covered,
                    surroundingMines: this.computeSurroundingMines(mines, i, j)
                };
            }
        }

        return squares;
    }

    /**
     * Determine the number of surrounding mines for a given square
     */
    private computeSurroundingMines(mines: Set<string>, x: number, y: number): number {
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

        const {width, height} = this.state.level;

        return choices.reduce((acc: number, [v, h]): number => {
            const inBounds = v >= 0 && v < width && h >= 0 && h < height;
            return acc + (inBounds ? Number(mines.has(v + ',' + h)) : 0);
        }, 0);
    }

    /**
     * Starts a new game
     */
    startNewGame(level: IGameLevelInterface = Levels.EASY): void {
        this.stopTimer();

        this.setState({level}, () => {
            const mines = this.generateMines();
            const squares = this.initializeSquaresArray(mines);

            this.setState({
                squares,
                mines,
                timer: 0,
                won: false,
                lost: false,
                newGameDialogOpen: false
            });

            this.startTimer();
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
    private generateMines(): Set<string> {
        const {width, height} = this.state.level;
        let mines = new Set();

        while (mines.size < this.state.level.mines) {
            let x = Math.floor(Math.random() * Math.floor(width));
            let y = Math.floor(Math.random() * Math.floor(height));
            mines.add(x + ',' + y);
        }

        return mines;
    }

    /**
     * Starts a timer
     */
    private startTimer() {
        this.timerID = window.setInterval(
            () => this.tick(),
            1000
        );
    }

    /**
     * Stops a timer
     */
    private stopTimer() {
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
    handleGameWin = (): void => {
        this.stopTimer();
        this.setState({won: true});
    };

    /**
     * Handles losing game event
     */
    handleGameLose = (): void => {
        this.stopTimer();
        this.setState({lost: true});
    };

    /**
     * Handles the click event of a square
     */
    handleSquareClick = (event: React.MouseEvent<HTMLElement>, x: number, y: number): void => {
        if (event.nativeEvent.which !== 1 || this.state.squares[x][y].displayState !== DisplayState.Covered) {
            // Not left click or clicked on invalid square
            return;
        }

        let newSquares = this.state.squares.slice();

        const surroundingMines = this.state.squares[x][y].surroundingMines;
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
    };

    /**
     * Reveals adjacent squares
     */
    private _revealAdjacentSquares(squares: ISquareDataInterface[][], x: number, y: number): ISquareDataInterface[][] {
        const {width, height} = this.state.level;

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
            const inBounds = v >= 0 && v < width && h >= 0 && h < height;
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
    handleSquareRightClick = (event: React.MouseEvent<HTMLElement>, x: number, y: number): void => {
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
    };

    /**
     * Handles the double-click event of a square
     */
    handleSquareDoubleClick = (x: number, y: number): void => {
        // TODO handle double click to reveal squares
        console.log('Double clicked on square %d %d', x, y);
    };

    /**
     * Handles clicking the new game button
     */
    handleNewGameClick = (): void => {
        this.setState({newGameDialogOpen: true});
    };

    /**
     * Handles closing the new game modal
     */
    handleModalClose = (): void => {
        this.setState({newGameDialogOpen: false});
    };

    public render() {
        const isGameInProgress = !this.state.won && !this.state.lost;
        const numberOfFlags = this.state.squares.reduce((acc, column): number => {
            return acc + column.reduce((acc, cell): number => {
                return acc + Number(cell.displayState === DisplayState.Flagged);
            }, 0);
        }, 0);

        return <>
            <button type='button' onClick={this.handleNewGameClick}>
                New game
            </button>
            <div className='header' style={{textAlign: 'center'}}>
                <p>Time: {this.state.timer} seconds</p>
                <p>Flags: {numberOfFlags} / {this.state.mines.size}</p>
            </div>
            <GameBoard
                squares={this.state.squares}
                handleSquareClick={this.handleSquareClick}
                handleSquareRightClick={this.handleSquareRightClick}
                handleSquareDoubleClick={this.handleSquareDoubleClick}
                isGameActive={isGameInProgress}
            />
            {
                this.state.won && <p>Congratulations!</p>
            }
            {
                this.state.lost && <p>Better luck next time! </p>
            }
            <LevelSelectorDialog
                open={this.state.newGameDialogOpen}
                onClose={this.handleModalClose}
                newGameCallback={this.startNewGame.bind(this)}
                gameInProgress={isGameInProgress}
            />
        </>;
    }
}

Modal.setAppElement('#app');

import React from 'react';
import GameBoard from './GameBoard';
import HighScoreBoard from './HighScoreBoard';
import IGameLevelInterface from './interfaces/IGameLevelInterface';
import Levels from './Levels';
import LevelSelectorPanel from './LevelSelectorPanel';
import ISquareDataInterface, {
    DisplayState,
} from './interfaces/ISquareDataInterface';
import { Stack } from '@fluentui/react/lib/Stack';

export interface State {
    level: IGameLevelInterface;

    mines: Set<string>;
    squares: ISquareDataInterface[][];

    timer: number;

    gameInProgress: boolean;
    lost: boolean;
    won: boolean;
    scores: number[];
}

/**
 * Class representing the game
 */
export default class Game extends React.Component<unknown, State> {
    private timerID: number | null;

    constructor(props = {}) {
        super(props);

        this.timerID = null;

        this.state = {
            level: Levels.EASY,

            mines: new Set(),
            squares: [[]],
            timer: 0,

            gameInProgress: false,
            won: false,
            lost: false,
            scores: JSON.parse(localStorage.getItem('highscores') ?? '[]'),
        };
    }

    /**
     * Initialize the array that holds all information about the squares on the game board
     */
    private initializeSquaresArray(
        mines: Set<string>
    ): ISquareDataInterface[][] {
        const { width, height } = this.state.level;
        const squares: ISquareDataInterface[][] = [];

        for (let i = 0; i < width; ++i) {
            squares[i] = [];

            for (let j = 0; j < height; ++j) {
                squares[i][j] = {
                    displayState: DisplayState.Covered,
                    surroundingMines: this.computeSurroundingMines(mines, i, j),
                };
            }
        }

        return squares;
    }

    /**
     * Determine the number of surrounding mines for a given square
     */
    private computeSurroundingMines(
        mines: Set<string>,
        x: number,
        y: number
    ): number {
        if (mines.has(x + ',' + y)) {
            return -1;
        }

        const choices = [
            [x - 1, y - 1],
            [x - 1, y],
            [x - 1, y + 1],
            [x, y - 1],
            [x, y + 1],
            [x + 1, y - 1],
            [x + 1, y],
            [x + 1, y + 1],
        ];

        const { width, height } = this.state.level;

        return choices.reduce((acc: number, [v, h]): number => {
            const inBounds = v >= 0 && v < width && h >= 0 && h < height;
            return acc + (inBounds ? Number(mines.has(v + ',' + h)) : 0);
        }, 0);
    }

    /**
     * Initializes a game
     */
    initializeGame(): void {
        const mines = this.generateMines();
        const squares = this.initializeSquaresArray(mines);

        this.setState({
            squares,
            mines,
            timer: 0,
            won: false,
            lost: false,
        });
    }

    /**
     * Starts a new game
     */
    startNewGame(level: IGameLevelInterface = Levels.EASY): void {
        if (
            this.state.gameInProgress &&
            !window.confirm('Are you sure you want to start a new game?')
        ) {
            return;
        }

        this.stopTimer();

        this.setState({ level }, () => {
            this.initializeGame();
        });
    }

    componentDidMount() {
        this.initializeGame();
    }

    componentWillUnmount() {
        this.stopTimer();
    }

    /**
     * Generates a set of mines
     */
    private generateMines(): Set<string> {
        const { width, height } = this.state.level;
        const mines: Set<string> = new Set();

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
        this.timerID = window.setInterval(() => this.tick(), 1000);
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
        this.setState((prevState) =>
            this.setState({ timer: prevState.timer + 1 })
        );
    }

    /**
     * Handles winning game event
     */
    handleGameWin = (): void => {
        this.stopTimer();

        this.setState((prevState) => {
            const scores = [...prevState.scores, prevState.timer]
                .sort((a, b) => a - b)
                .slice(0, 10);

            localStorage.setItem('highscores', JSON.stringify(scores));

            return {
                gameInProgress: false,
                won: true,
                scores,
            };
        });
    };

    /**
     * Handles losing game event
     */
    handleGameLose = (): void => {
        this.stopTimer();

        this.setState({
            gameInProgress: false,
            lost: true,
        });
    };

    /**
     * Handles the click event of a square
     */
    handleSquareClick = (
        event: React.MouseEvent<HTMLElement>,
        x: number,
        y: number
    ): void => {
        if (
            event.nativeEvent.which !== 1 ||
            this.state.squares[x][y].displayState !== DisplayState.Covered
        ) {
            // Not left click or clicked on invalid square
            return;
        }

        if (!this.state.gameInProgress) {
            this.setState({ gameInProgress: true }, () => this.startTimer());
        }

        let newSquares = this.state.squares.slice();

        const surroundingMines = this.state.squares[x][y].surroundingMines;
        const newState: DisplayState =
            surroundingMines === -1
                ? DisplayState.Detonated
                : DisplayState.Uncovered;

        newSquares[x][y].displayState = newState;

        if (newState === DisplayState.Uncovered && surroundingMines === 0) {
            newSquares = this._revealAdjacentSquares(newSquares, x, y);
        }

        if (surroundingMines === -1) {
            this.handleGameLose();
        } else {
            const won = this.state.squares.every((column) =>
                column.every(
                    (s) =>
                        s.displayState === DisplayState.Uncovered ||
                        s.surroundingMines === -1
                )
            );

            if (won) {
                this.handleGameWin();
            }
        }

        this.setState({ squares: newSquares });
    };

    /**
     * Reveals adjacent squares
     */
    private _revealAdjacentSquares(
        squares: ISquareDataInterface[][],
        x: number,
        y: number
    ): ISquareDataInterface[][] {
        const { width, height } = this.state.level;

        const choices = [
            [x - 1, y - 1],
            [x - 1, y],
            [x - 1, y + 1],
            [x, y - 1],
            [x, y + 1],
            [x + 1, y - 1],
            [x + 1, y],
            [x + 1, y + 1],
        ];

        const coveredAdjacentSquares = choices.filter(([v, h]) => {
            const inBounds = v >= 0 && v < width && h >= 0 && h < height;
            return (
                inBounds && squares[v][h].displayState === DisplayState.Covered
            );
        });

        for (const [v, h] of coveredAdjacentSquares) {
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
    handleSquareRightClick = (
        event: React.MouseEvent<HTMLElement>,
        x: number,
        y: number
    ): void => {
        event.preventDefault();

        const stateTransitions: DisplayState[] = [
            DisplayState.Covered,
            DisplayState.Flagged,
            DisplayState.Maybe,
        ];

        if (!this.state.gameInProgress) {
            this.setState({ gameInProgress: true }, () => this.startTimer());
        }

        let currentSquareStateIdx = stateTransitions.indexOf(
            this.state.squares[x][y].displayState
        );

        if (currentSquareStateIdx < 0) {
            // Right-clicking shouldn't do anything
            return;
        }

        let newSquareStateIdx: number =
            (currentSquareStateIdx + 1) % stateTransitions.length;
        let newSquareState: DisplayState = stateTransitions[newSquareStateIdx];

        let newSquares = this.state.squares.slice();
        newSquares[x][y].displayState = newSquareState;

        this.setState({ squares: newSquares });
    };

    /**
     * Handles the double-click event of a square
     */
    handleSquareDoubleClick = (x: number, y: number): void => {
        // TODO handle double click to reveal squares
        console.log('Double clicked on square %d %d', x, y);
    };

    public render() {
        const isGameActive = !this.state.won && !this.state.lost;
        const numberOfFlags = this.state.squares.reduce(
            (acc, column): number => {
                return (
                    acc +
                    column.reduce((acc, cell): number => {
                        return (
                            acc +
                            Number(cell.displayState === DisplayState.Flagged)
                        );
                    }, 0)
                );
            },
            0
        );

        return (
            <>
                <LevelSelectorPanel
                    newGameCallback={this.startNewGame.bind(this)}
                />

                <Stack horizontal horizontalAlign='space-around'>
                    <Stack.Item>
                        <header
                            className='header'
                            style={{ textAlign: 'center' }}
                        >
                            <p>Time: {this.state.timer} seconds</p>
                            <p>
                                Flags: {numberOfFlags} / {this.state.mines.size}
                            </p>
                        </header>
                        <GameBoard
                            squares={this.state.squares}
                            handleSquareClick={this.handleSquareClick}
                            handleSquareRightClick={this.handleSquareRightClick}
                            handleSquareDoubleClick={
                                this.handleSquareDoubleClick
                            }
                            isGameActive={isGameActive}
                        />
                    </Stack.Item>
                    <HighScoreBoard highscores={this.state.scores} />
                </Stack>
                {this.state.won && <p>Congratulations!</p>}
                {this.state.lost && <p>Better luck next time! </p>}
            </>
        );
    }
}

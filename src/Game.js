import React from 'react';
import GameBoard from './GameBoard';

export default class Game extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            squares: [[]],
            mines: new Set(),
            won: false,
            lost: false
        };
    }

    /**
     * Initialize the array that holds all information about the squares on the game board
     * @param {Set} mines
     * @returns {Object<string, *>[][]}
     */
    initializeSquaresArray(mines) {
        let {width, height} = this.props;
        let squares = [];

        for (let i = 0; i < width; ++i) {
            squares[i] = [];

            for (let j = 0; j < height; ++j) {
                squares[i][j] = {
                    surroundingMines: this.computeSurroundingMines(mines, i, j),
                    displayState: 'covered'
                };
            }
        }

        return squares;
    }

    /**
     * Determine the number of surrounding mines for a given square
     * @param {Set} mines
     * @param {number} x
     * @param {number} y
     * @returns {number}
     */
    computeSurroundingMines(mines, x, y) {
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

        return choices.reduce((acc, [v, h]) => {
            const inBounds = v >= 0 && v < this.props.width && h >= 0 && h < this.props.height;
            return acc + (inBounds ? mines.has(v + ',' + h) : 0);
        }, 0);
    }

    /**
     * Starts a new game
     */
    startNewGame() {
        const mines = this.generateMines();
        const squares = this.initializeSquaresArray(mines);

        this.setState({
            squares: squares,
            mines: mines,
            won: false,
            lost: false
        });
    }

    componentDidMount() {
        this.startNewGame();
    }

    /**
     * Generates a set of mines
     * @returns {Set<any>}
     */
    generateMines() {
        let mines = new Set();

        while (mines.size < this.props.mines) {
            let x = Math.floor(Math.random() * Math.floor(this.props.width));
            let y = Math.floor(Math.random() * Math.floor(this.props.height));
            mines.add(x + ',' + y);
        }

        return mines;
    }

    /**
     * Handles winning game event
     */
    handleGameWin() {
        this.setState({won: true});
    }

    /**
     * Handles losing game event
     */
    handleGameLose() {
        this.setState({lost: true});
    }

    /**
     * Handles the click event of a square
     * @param {Event} event
     * @param {number} x
     * @param {number} y
     */
    handleSquareClick(event, x, y) {
        if (event.nativeEvent.which !== 1 || this.state.squares[x][y].displayState !== 'covered') {
            // Not left click or clicked on invalid square
            return;
        }

        let newSquares = this.state.squares.slice();

        const surroundingMines = this.state.squares[x][y].surroundingMines
        const newState = surroundingMines === -1 ? 'detonated' : 'uncovered';

        newSquares[x][y].displayState = newState;

        if (newState === 'uncovered' && surroundingMines === 0) {
            newSquares = this._revealAdjacentSquares(newSquares, x, y);
        }

        if (surroundingMines === -1) {
            this.handleGameLose();
        } else {
            const won = this.state.squares.every(column => column.every(s => s.displayState === 'uncovered' || s.surroundingMines === -1));

            if (won) {
                this.handleGameWin();
            }
        }

        this.setState({squares: newSquares});
    }

    /**
     * Reveals adjacent squares
     * @param {Object<string, *>[][]} squares
     * @param {number} x
     * @param {number} y
     * @returns {Object<string, *>[][]}
     * @private
     */
    _revealAdjacentSquares(squares, x, y) {
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
            return inBounds && squares[v][h].displayState === 'covered';
        });

        for (let [v, h] of coveredAdjacentSquares) {
            squares[v][h].displayState = 'uncovered';

            if (squares[v][h].surroundingMines === 0) {
                this._revealAdjacentSquares(squares, v, h);
            }
        }

        return squares;
    }

    /**
     * Handles the right-click event of a square
     * @param {Event} event
     * @param {number} x
     * @param {number} y
     */
    handleSquareRightClick(event, x, y) {
        event.preventDefault();

        let newSquareState;
        switch (this.state.squares[x][y].displayState) {
            case 'uncovered':
                // Right clicking an exposed square shouldn't do anything
                return;
            case 'covered':
                newSquareState = 'flagged';
                break;
            case 'flagged':
                newSquareState = 'maybe';
                break;
            default:
                newSquareState = 'covered';
                break;
        }

        let newSquares = this.state.squares.slice();
        newSquares[x][y].displayState = newSquareState;

        this.setState({squares: newSquares});
    }

    /**
     * Handles the double-click event of a square
     * @param {number} x
     * @param {number} y
     */
    handleSquareDoubleClick(x, y) {
        // TODO handle double click to reveal squares
        console.log('Double clicked on square %d %d', x, y);
    }

    render() {
        const isGameInProgress = !this.state.won && !this.state.lost;

        return <React.Fragment>
            {
                this.state.won && <p>Congratulations!</p>
            }
            {
                this.state.lost && <p>Better luck next time! </p>
            }
            <button type='button' disabled={isGameInProgress} onClick={() => this.startNewGame()}>
                New game
            </button>
            <GameBoard
                width={this.props.width}
                height={this.props.width}
                squares={this.state.squares}
                handleSquareClick={this.handleSquareClick.bind(this)}
                handleSquareRightClick={this.handleSquareRightClick.bind(this)}
                handleSquareDoubleClick={this.handleSquareDoubleClick.bind(this)}
                isGameActive={isGameInProgress}
            />
            <p>Mines: {this.state.mines.size}</p>
            <p>Squares: </p>
        </React.Fragment>;
    }
}

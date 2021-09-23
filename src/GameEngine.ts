import IGameLevelInterface from './interfaces/IGameLevelInterface';
import ISquareDataInterface, {
    DisplayState,
} from './interfaces/ISquareDataInterface';
import Levels from './Levels';

export interface GameState {
    won: boolean;
    lost: boolean;
    board: ISquareDataInterface[][];
}

export default class GameEngine {
    #board: ISquareDataInterface[][] = [];
    #won = false;
    #lost = false;

    #level: IGameLevelInterface = Levels.EASY;

    #mines: Set<string> = new Set();

    constructor() {
        this.initialize(this.#level);
    }

    initialize(level: IGameLevelInterface): void {
        this.#level = level;
        this.#mines = this.#generateMines();
        this.#board = this.#initializeSquaresArray();

        this.#won = false;
        this.#lost = false;
    }

    /**
     * Generates a set of mines
     */
    #generateMines(): Set<string> {
        const { width, height } = this.#level;
        const mines: Set<string> = new Set();

        while (mines.size < this.#level.mines) {
            let x = Math.floor(Math.random() * Math.floor(width));
            let y = Math.floor(Math.random() * Math.floor(height));
            mines.add(x + ',' + y);
        }

        return mines;
    }

    #initializeSquaresArray(): ISquareDataInterface[][] {
        const { width, height } = this.#level;
        const squares: ISquareDataInterface[][] = [];

        for (let i = 0; i < width; ++i) {
            squares[i] = [];

            for (let j = 0; j < height; ++j) {
                squares[i][j] = {
                    displayState: DisplayState.Covered,
                    surroundingMines: this.#computeSurroundingMines(i, j),
                };
            }
        }

        return squares;
    }

    /**
     * Determine the number of surrounding mines for a given square
     */
    #computeSurroundingMines(x: number, y: number): number {
        if (this.#mines.has(x + ',' + y)) {
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

        const { width, height } = this.#level;

        return choices.reduce((acc: number, [v, h]): number => {
            const inBounds = v >= 0 && v < width && h >= 0 && h < height;
            return acc + (inBounds ? Number(this.#mines.has(v + ',' + h)) : 0);
        }, 0);
    }

    /**
     * Reveal adjacent squares
     */
    #revealAdjacentSquares(
        squares: ISquareDataInterface[][],
        x: number,
        y: number
    ): ISquareDataInterface[][] {
        const { width, height } = this.#level;

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
                this.#revealAdjacentSquares(squares, v, h);
            }
        }

        return squares;
    }

    /**
     * Reveal a square
     */
    uncover(x: number, y: number): boolean {
        if (this.#board[x][y].displayState !== DisplayState.Covered) {
            return false;
        }

        let newSquares = this.#board.slice();

        const surroundingMines = this.#board[x][y].surroundingMines;
        const newState: DisplayState =
            surroundingMines === -1
                ? DisplayState.Detonated
                : DisplayState.Uncovered;

        newSquares[x][y].displayState = newState;

        if (newState === DisplayState.Uncovered && surroundingMines === 0) {
            newSquares = this.#revealAdjacentSquares(newSquares, x, y);
        }

        if (surroundingMines === -1) {
            this.#lost = true;
        } else {
            const won = this.#board.every((column) =>
                column.every(
                    (s) =>
                        s.displayState === DisplayState.Uncovered ||
                        s.surroundingMines === -1
                )
            );

            if (won) {
                this.#won = true;
            }
        }

        return true;
    }

    /**
     * Toggle a flag on a square
     */
    toggleFlag(x: number, y: number): boolean {
        const stateTransitions: DisplayState[] = [
            DisplayState.Covered,
            DisplayState.Flagged,
            DisplayState.Maybe,
        ];

        if (!stateTransitions.includes(this.#board[x][y].displayState)) {
            return false;
        }

        let currentSquareStateIdx = stateTransitions.indexOf(
            this.#board[x][y].displayState
        );

        let newSquareStateIdx: number =
            (currentSquareStateIdx + 1) % stateTransitions.length;
        let newSquareState: DisplayState = stateTransitions[newSquareStateIdx];

        let newSquares = this.#board.slice();
        newSquares[x][y].displayState = newSquareState;

        return true;
    }

    /**
     * Uncover adjacent squares of an uncovered square with the appropriate flags
     */
    autoUncoverAdjacent(x: number, y: number): boolean {
        if (this.#board[x][y].displayState !== DisplayState.Uncovered) {
            return false;
        }

        console.log('Auto-reveal activated on square %d %d', x, y);

        const { width, height } = this.#level;

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

        const adjacentSquares = choices.filter(([v, h]) => {
            return v >= 0 && v < width && h >= 0 && h < height;
        });

        const adjacentMaybe = adjacentSquares.filter(
            ([v, h]) => this.#board[v][h].displayState === DisplayState.Maybe
        );

        const adjacentFlags = adjacentSquares.filter(
            ([v, h]) => this.#board[v][h].displayState === DisplayState.Flagged
        );

        if (
            adjacentMaybe.length > 0 ||
            adjacentFlags.length !== this.#board[x][y].surroundingMines
        ) {
            return false;
        }

        const adjacentCoveredSquares = adjacentSquares.filter(
            ([v, h]) => this.#board[v][h].displayState === DisplayState.Covered
        );

        adjacentCoveredSquares.forEach(([v, h]) => this.uncover(v, h));

        return true;
    }

    get gameState(): GameState {
        return {
            board: this.#board,
            lost: this.#lost,
            won: this.#won,
        };
    }
}

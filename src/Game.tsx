import React from 'react';
import GameBoard from './GameBoard';
import GameEngine, { GameState } from './GameEngine';
import GameInfo from './GameInfo';
import GameLostDialog from './GameLostDialog';
import GameWonDialog from './GameWonDialog';
import IGameLevelInterface from './interfaces/IGameLevelInterface';
import Levels, { LevelName } from './Levels';
import LevelSelectorPanel from './LevelSelectorPanel';
import { DisplayState } from './interfaces/ISquareDataInterface';
import { Stack } from '@fluentui/react/lib/Stack';

export interface State {
    level: LevelName;

    game: GameState;
    timer: number;

    gameInProgress: boolean;
    scores: { [level in LevelName]: number[] };

    wonDialogOpen: boolean;
    lostDialogOpen: boolean;
}

/**
 * Class representing the game
 */
export default class Game extends React.Component<unknown, State> {
    #timerID: number | null = null;
    #gameEngine: GameEngine;

    constructor(props = {}) {
        super(props);

        this.#gameEngine = new GameEngine();

        this.state = {
            level: 'EASY',

            game: this.#gameEngine.gameState,
            timer: 0,

            gameInProgress: false,
            scores: JSON.parse(
                localStorage.getItem('highscores') ??
                    '{"EASY":[],"MEDIUM":[],"HARD":[]}'
            ),

            wonDialogOpen: false,
            lostDialogOpen: false,
        };
    }

    /**
     * Initializes a game
     */
    initializeGame(): void {
        this.#gameEngine.initialize(Levels[this.state.level]);

        this.setState({
            game: this.#gameEngine.gameState,
            timer: 0,
        });
    }

    /**
     * Starts a new game
     */
    startNewGame(level: LevelName = 'EASY'): void {
        if (
            this.state.gameInProgress &&
            !window.confirm('Are you sure you want to start a new game?')
        ) {
            return;
        }

        this.#stopTimer();

        this.setState({ level }, () => {
            this.initializeGame();
        });
    }

    componentWillUnmount() {
        this.#stopTimer();
    }

    /**
     * Starts a timer
     */
    #startTimer(): void {
        this.#timerID = window.setInterval(() => this.tick(), 1000);
    }

    /**
     * Stops a timer
     */
    #stopTimer(): void {
        if (this.#timerID !== null) {
            window.clearInterval(this.#timerID);
        }

        this.#timerID = null;
    }

    private tick() {
        this.setState((prevState) => ({ timer: prevState.timer + 1 }));
    }

    /**
     * Get the aggregate count of squares in various states on the game board
     */
    #computeBoardStatus(): { [K in DisplayState]: number } {
        const boardStatus = {
            [DisplayState.Covered]: 0,
            [DisplayState.Flagged]: 0,
            [DisplayState.Maybe]: 0,
            [DisplayState.Uncovered]: 0,
            [DisplayState.Detonated]: 0,
        };

        this.state.game.board.forEach((column) =>
            column.forEach((cell) => ++boardStatus[cell.displayState])
        );

        return boardStatus;
    }

    /**
     * Handles winning game event
     */
    handleGameWin = (): void => {
        this.#stopTimer();

        this.setState((prevState) => {
            const scores = prevState.scores;
            const levelScores = [...scores[prevState.level], prevState.timer]
                .sort((a, b) => a - b)
                .slice(0, 10);

            scores[prevState.level] = levelScores;

            localStorage.setItem('highscores', JSON.stringify(scores));

            return {
                wonDialogOpen: true,
                gameInProgress: false,
                scores,
            };
        });
    };

    /**
     * Handles losing game event
     */
    handleGameLose = (): void => {
        this.#stopTimer();
        this.setState({
            lostDialogOpen: true,
            gameInProgress: false,
        });
    };

    /**
     * Handles the click event of a square
     */
    handleSquareClick = (x: number, y: number): void => {
        if (!this.state.gameInProgress) {
            this.setState({ gameInProgress: true }, () => this.#startTimer());
        }

        if (this.#gameEngine.uncover(x, y)) {
            this.setState({ game: this.#gameEngine.gameState }, () => {
                if (this.state.game.won) {
                    this.handleGameWin();
                } else if (this.state.game.lost) {
                    this.handleGameLose();
                }
            });
        }
    };

    /**
     * Handles the right-click event of a square
     */
    handleSquareRightClick = (x: number, y: number): void => {
        if (!this.state.gameInProgress) {
            this.setState({ gameInProgress: true }, () => this.#startTimer());
        }

        if (this.#gameEngine.toggleFlag(x, y)) {
            this.setState({ game: this.#gameEngine.gameState });
        }
    };

    /**
     * Handles the double-click event of a square
     */
    handleSquareDoubleClick = (x: number, y: number): void => {
        if (this.#gameEngine.autoUncoverAdjacent(x, y)) {
            this.setState({ game: this.#gameEngine.gameState }, () => {
                if (this.state.game.won) {
                    this.handleGameWin();
                } else if (this.state.game.lost) {
                    this.handleGameLose();
                }
            });
        }
    };

    /**
     * Handles closing the game won/lost dialogs
     */
    handleCloseGameOverDialog(): void {
        this.setState({
            wonDialogOpen: false,
            lostDialogOpen: false,
        });
    }

    public render() {
        const isGameActive = !this.state.game.won && !this.state.game.lost;

        const boardStatus = this.#computeBoardStatus();
        const numberOfFlags = boardStatus[DisplayState.Flagged];

        return (
            <>
                <Stack
                    horizontalAlign='center'
                    tokens={{ childrenGap: 'm', padding: 's1' }}
                    style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.75)',
                    }}
                    as='main'
                >
                    <LevelSelectorPanel
                        newGameCallback={this.startNewGame.bind(this)}
                    />

                    <Stack
                        horizontal
                        horizontalAlign='space-around'
                        wrap
                        tokens={{ childrenGap: 'm' }}
                    >
                        <Stack.Item>
                            <div style={{ textAlign: 'center' }}>
                                <p>Time: {this.state.timer} seconds</p>
                                <p>
                                    Flagged threats: <b>{numberOfFlags}</b> of{' '}
                                    <b>{Levels[this.state.level].mines}</b>
                                </p>
                            </div>
                            <GameBoard
                                squares={this.state.game.board}
                                handleSquareClick={this.handleSquareClick}
                                handleSquareRightClick={
                                    this.handleSquareRightClick
                                }
                                handleSquareDoubleClick={
                                    this.handleSquareDoubleClick
                                }
                                isGameActive={isGameActive}
                            />
                        </Stack.Item>
                    </Stack>
                    <GameInfo highscores={this.state.scores} />
                </Stack>
                <GameWonDialog
                    hidden={!this.state.wonDialogOpen}
                    toggleHideDialog={this.handleCloseGameOverDialog.bind(this)}
                />
                <GameLostDialog
                    hidden={!this.state.lostDialogOpen}
                    instantLoss={boardStatus[DisplayState.Uncovered] === 0}
                    toggleHideDialog={this.handleCloseGameOverDialog.bind(this)}
                />
            </>
        );
    }
}

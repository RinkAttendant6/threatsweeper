import React from 'react';
import GameBoard from './GameBoard';
import GameEngine, { GameState } from './GameEngine';
import GameLostDialog from './GameLostDialog';
import GameWonDialog from './GameWonDialog';
import HighScoreBoard from './HighScoreBoard';
import IGameLevelInterface from './interfaces/IGameLevelInterface';
import Levels from './Levels';
import LevelSelectorPanel from './LevelSelectorPanel';
import { DisplayState } from './interfaces/ISquareDataInterface';
import { Stack } from '@fluentui/react/lib/Stack';

export interface State {
    level: IGameLevelInterface;

    game: GameState;
    timer: number;

    gameInProgress: boolean;
    scores: number[];

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
            level: Levels.EASY,

            game: this.#gameEngine.gameState,
            timer: 0,

            gameInProgress: false,
            scores: JSON.parse(localStorage.getItem('highscores') ?? '[]'),

            wonDialogOpen: false,
            lostDialogOpen: false,
        };
    }

    /**
     * Initializes a game
     */
    initializeGame(): void {
        this.#gameEngine.initialize(this.state.level);

        this.setState({
            game: this.#gameEngine.gameState,
            timer: 0,
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
        this.setState((prevState) =>
            this.setState({ timer: prevState.timer + 1 })
        );
    }

    /**
     * Handles winning game event
     */
    handleGameWin = (): void => {
        this.#stopTimer();

        this.setState((prevState) => {
            const scores = [...prevState.scores, prevState.timer]
                .sort((a, b) => a - b)
                .slice(0, 10);

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
        const numberOfFlags = this.state.game.board.reduce(
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
                <Stack
                    tokens={{ childrenGap: 'm' }}
                    style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.75)',
                        padding: '1em',
                    }}
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
                                    <b>{this.state.level.mines}</b>
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
                        <HighScoreBoard highscores={this.state.scores} />
                    </Stack>
                </Stack>
                <GameWonDialog
                    hidden={!this.state.wonDialogOpen}
                    toggleHideDialog={this.handleCloseGameOverDialog.bind(this)}
                />
                <GameLostDialog
                    hidden={!this.state.lostDialogOpen}
                    toggleHideDialog={this.handleCloseGameOverDialog.bind(this)}
                />
            </>
        );
    }
}

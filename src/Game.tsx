import React from 'react';
import PageVisibility from 'react-page-visibility';
import AchievementsEngine from './AchievementsEngine';
import GameBoard from './GameBoard';
import GameEngine, { GameState } from './GameEngine';
import GameInfo from './GameInfo';
import GameStatus from './GameStatus';
import GameLostDialog from './GameLostDialog';
import GameWonDialog from './GameWonDialog';
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

    gameCounters: {
        won: number;
        lost: number;
        instantlyLost: number;
    };

    wonDialogOpen: boolean;
    lostDialogOpen: boolean;
}

/**
 * Class representing the game
 */
export default class Game extends React.Component<unknown, State> {
    #timerID: number | null = null;
    #gameEngine: GameEngine;
    #achievementsEngine: AchievementsEngine;

    constructor(props = {}) {
        super(props);

        this.#achievementsEngine = new AchievementsEngine();
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
            gameCounters: {
                won: Number(localStorage.getItem('gamesWon')) || 0,
                lost: Number(localStorage.getItem('gamesLost')) || 0,
                instantlyLost:
                    Number(localStorage.getItem('gamesInstantlyLost')) || 0,
            },

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
        if (this.#timerID === null) {
            this.#timerID = window.setInterval(() => this.tick(), 1000);
        }
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
     * Get the new high score list
     * @returns number[]
     */
    #computeNewScores(): number[] {
        return [...this.state.scores[this.state.level], this.state.timer]
            .filter((score) => score > 0)
            .sort((a, b) => a - b)
            .slice(0, 10);
    }

    /**
     * Force achievements re-evaluation
     */
    #refreshAchievements(): void {
        this.#achievementsEngine.evaluate(
            this.#gameEngine.gameState,
            this.state.timer
        );
        this.#achievementsEngine.persist();
    }

    /**
     * Handles when the game is over
     * @param win Whether the game was won
     */
    handleGameOver(win: boolean): void {
        this.#stopTimer();

        const boardStatus = this.#computeBoardStatus();
        const instantLoss = !win && boardStatus[DisplayState.Uncovered] === 0;
        let scores = this.state.scores;
        let counters = this.state.gameCounters;

        if (win) {
            counters.won++;
            scores[this.state.level] = this.#computeNewScores();
            localStorage.setItem('highscores', JSON.stringify(scores));
            localStorage.setItem('gamesWon', String(counters.won));
        } else {
            counters.lost++;
            counters.instantlyLost += instantLoss ? 1 : 0;
            localStorage.setItem('gamesLost', String(counters.lost));
            localStorage.setItem(
                'gamesInstantlyLost',
                String(counters.instantlyLost)
            );
        }

        this.setState({
            wonDialogOpen: win,
            lostDialogOpen: !win,
            gameInProgress: false,
            scores,
            gameCounters: counters,
        });
    }

    /**
     * Handles the click event of a square
     */
    handleSquareClick = (x: number, y: number): void => {
        this.#startTimer();

        if (!this.state.gameInProgress) {
            this.setState({ gameInProgress: true });
        }

        if (this.#gameEngine.uncover(x, y)) {
            this.setState({ game: this.#gameEngine.gameState }, () => {
                if (this.state.game.won) {
                    this.handleGameOver(true);
                } else if (this.state.game.lost) {
                    this.handleGameOver(false);
                }

                this.#refreshAchievements();
            });
        }
    };

    /**
     * Handles the right-click event of a square
     */
    handleSquareRightClick = (x: number, y: number): void => {
        this.#startTimer();

        if (!this.state.gameInProgress) {
            this.setState({ gameInProgress: true });
        }

        if (this.#gameEngine.toggleFlag(x, y)) {
            this.setState({ game: this.#gameEngine.gameState }, () => {
                this.#refreshAchievements();
            });
        }
    };

    /**
     * Handles the double-click event of a square
     */
    handleSquareDoubleClick = (x: number, y: number): void => {
        this.#startTimer();

        if (this.#gameEngine.autoUncoverAdjacent(x, y)) {
            this.setState({ game: this.#gameEngine.gameState }, () => {
                if (this.state.game.won) {
                    this.handleGameOver(true);
                } else if (this.state.game.lost) {
                    this.handleGameOver(false);
                }

                this.#refreshAchievements();
            });
        }
    };

    /**
     * Handles changes in page visibility
     */
    handleVisibilityChange = (isVisible: boolean): void => {
        if (!this.state.gameInProgress) {
            return;
        }

        console.debug(isVisible);

        this.#gameEngine.paused = !isVisible;

        if (isVisible) {
            this.#startTimer();
        } else {
            this.#stopTimer();
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
        const numberRevealed = boardStatus[DisplayState.Uncovered];
        const boardSize =
            Levels[this.state.level].height * Levels[this.state.level].width;

        return (
            <PageVisibility onChange={this.handleVisibilityChange}>
                <>
                    <Stack
                        horizontalAlign='stretch'
                        tokens={{ childrenGap: 'm', padding: 's1' }}
                        as='main'
                    >
                        <LevelSelectorPanel
                            newGameCallback={this.startNewGame.bind(this)}
                        />
                        <GameBoard
                            squares={this.state.game.board}
                            handleSquareClick={this.handleSquareClick}
                            handleSquareRightClick={this.handleSquareRightClick}
                            handleSquareDoubleClick={
                                this.handleSquareDoubleClick
                            }
                            isGameActive={isGameActive}
                        />
                        <GameStatus
                            time={this.state.timer}
                            size={boardSize}
                            revealed={numberRevealed}
                            flags={numberOfFlags}
                            mines={Levels[this.state.level].mines}
                        />
                        <GameInfo
                            highscores={this.state.scores}
                            achievementsEngine={this.#achievementsEngine}
                        />
                    </Stack>
                    <GameWonDialog
                        hidden={!this.state.wonDialogOpen}
                        toggleHideDialog={this.handleCloseGameOverDialog.bind(
                            this
                        )}
                    />
                    <GameLostDialog
                        hidden={!this.state.lostDialogOpen}
                        instantLoss={boardStatus[DisplayState.Uncovered] === 0}
                        toggleHideDialog={this.handleCloseGameOverDialog.bind(
                            this
                        )}
                    />
                </>
            </PageVisibility>
        );
    }
}

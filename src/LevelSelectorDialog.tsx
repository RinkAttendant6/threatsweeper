import IGameLevelInterface from './interfaces/IGameLevelInterface';
import Levels from './Levels';
import React from 'react';
import Modal from 'react-modal';

export interface Props {
    open: boolean;
    onClose: () => void;

    newGameCallback: (level: IGameLevelInterface) => void;

    gameInProgress: boolean;
}

export default class LevelSelectorDialog extends React.Component<Props> {
    render() {
        return (
            <Modal isOpen={this.props.open} contentLabel='Start new game'>
                <h2>Start new game</h2>
                {this.props.gameInProgress && (
                    <p>Starting a new game will end your current game.</p>
                )}
                <div>
                    <button
                        type='button'
                        value='easy'
                        onClick={() => this.props.newGameCallback(Levels.EASY)}
                    >
                        Easy (9 × 9)
                    </button>
                    <button
                        type='button'
                        value='medium'
                        onClick={() =>
                            this.props.newGameCallback(Levels.MEDIUM)
                        }
                    >
                        Medium (16 × 16)
                    </button>
                    <button
                        type='button'
                        value='expert'
                        onClick={() => this.props.newGameCallback(Levels.HARD)}
                    >
                        Expert (30 × 16)
                    </button>
                </div>
                <button onClick={this.props.onClose}>Return to game</button>
            </Modal>
        );
    }
}

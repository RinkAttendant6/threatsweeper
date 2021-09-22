import IGameLevelInterface from './interfaces/IGameLevelInterface';
import Levels from './Levels';
import React from 'react';

export interface Props {
    newGameCallback: (level: IGameLevelInterface) => void;
}

export default class LevelSelectorPanel extends React.Component<Props> {
    render() {
        return (
            <fieldset>
                <legend>New game</legend>
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
                    onClick={() => this.props.newGameCallback(Levels.MEDIUM)}
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
            </fieldset>
        );
    }
}

import React from 'react';

export interface Props {
    highscores: number[];
}

/**
 * Class representing the statistics board
 */
export default class HighScoreBoard extends React.Component<Props> {
    render() {
        if (this.props.highscores.length === 0) {
            return <p>No scores yet for this level</p>;
        }

        return (
            <ol>
                {this.props.highscores.map((score, key) => (
                    <li key={key}>{score} seconds</li>
                ))}
            </ol>
        );
    }
}

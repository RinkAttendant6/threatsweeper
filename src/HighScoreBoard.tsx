import React from 'react';

export interface Props {
    highscores: number[];
}

/**
 * Class representing the statistics board
 */
 export default class HighScoreBoard extends React.Component<Props> {
    render() {
        return (
            <section style={{padding: '0 1em'}}>
                <h2>Best times</h2>
                <ol>
                {
                    this.props.highscores.map((score, key) =>
                        <li key={key}>{score} seconds</li>
                    )
                }
                </ol>
            </section>
        );
    }
}

import React from 'react';
import { Label } from '@fluentui/react/lib/Label';

export interface Props {
    highscores: number[];
}

/**
 * Class representing the statistics board
 */
export default class HighScoreBoard extends React.Component<Props> {
    render() {
        return (
            <section>
                <Label>High scores</Label>
                <ol>
                    {this.props.highscores.map((score, key) => (
                        <li key={key}>{score} seconds</li>
                    ))}
                </ol>
            </section>
        );
    }
}

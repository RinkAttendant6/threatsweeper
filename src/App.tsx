import React from 'react';
import Game from './Game';
import { Stack } from '@fluentui/react/lib/Stack';

export default class App extends React.Component {
    public render() {
        return (
            <Stack tokens={{ childrenGap: 's1' }}>
                <header>
                    <h1>EOG Threat Hunt Minesweeper</h1>
                </header>
                <main>
                    <Game />
                </main>
            </Stack>
        );
    }
}

import React from 'react';
import Game from './Game';

export default class App extends React.Component {
    render() {
        return (
            <main>
                <h1>React Minesweeper</h1>
                <Game width={9} height={9} mines={10} />
            </main>
        );
    }
}

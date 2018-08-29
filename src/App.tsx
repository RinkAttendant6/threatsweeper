import React from 'react';
import Game from './Game';

export default class App extends React.Component {
    render() {
        return (
            <main>
                <Game width={9} height={9} mines={10} />
            </main>
        );
    }
}

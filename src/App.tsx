import React from 'react';
import Game from './Game';
import { Text } from '@fluentui/react/lib/Text';

export default class App extends React.Component {
    public render() {
        return (
            <>
                <Text as='h1' variant='xxLarge'>
                    Threatsweeper
                </Text>
                <Game />
            </>
        );
    }
}

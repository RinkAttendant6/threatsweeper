import React from 'react';
import Game from './Game';
import { Text } from '@fluentui/react/lib/Text';
import { registerIcons } from '@fluentui/react/lib/Styling';
import { MoreIcon } from '@fluentui/react-icons-mdl2';

export default class App extends React.Component {
    constructor(props: Record<string, never>) {
        super(props);

        registerIcons({
            icons: {
                more: <MoreIcon />,
            },
        });
    }

    public render() {
        return (
            <>
                <Text as='h1' variant='xxLarge'>
                    Threatsweeper
                </Text>
                <a
                    className='github-fork-ribbon'
                    href='https://github.com/RinkAttendant6/threatsweeper'
                    data-ribbon='Fork me on GitHub'
                    target='_blank'
                    rel='noreferrer noopener'
                >
                    Fork me on GitHub
                </a>
                <Game />
            </>
        );
    }
}

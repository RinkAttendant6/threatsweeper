import React from 'react';
import { Stack } from '@fluentui/react/lib/Stack';
import { Text } from '@fluentui/react/lib/Text';
import { BroomIcon, FlagIcon, TimerIcon } from '@fluentui/react-icons-mdl2';

export interface Props {
    time: number;
    size: number;
    revealed: number;
    flags: number;
    mines: number;
}

export default class GameStatus extends React.Component<Props> {
    public render() {
        return (
            <Stack
                horizontal
                wrap
                horizontalAlign='space-around'
                className='gameStatus shadowUtil'
            >
                <Text as='p' role='status'>
                    <TimerIcon
                        aria-label='Time'
                        style={{ marginRight: '0.5em', fontSize: '1.25em' }}
                    />
                    <b>{this.props.time}</b> seconds
                </Text>
                <Text as='p' role='status'>
                    <BroomIcon
                        aria-label='Sweeping progress'
                        style={{ marginRight: '0.5em', fontSize: '1.25em' }}
                    />
                    <b>
                        {new Intl.NumberFormat(undefined, {
                            style: 'percent',
                            maximumFractionDigits: 1,
                        }).format(
                            this.props.revealed /
                                (this.props.size - this.props.mines)
                        )}
                    </b>{' '}
                    devices powered on
                </Text>
                <Text
                    as='p'
                    style={{
                        padding: '0 0.5em',
                        backgroundColor:
                            this.props.flags > this.props.mines
                                ? 'pink'
                                : 'transparent',
                    }}
                >
                    <FlagIcon
                        aria-label='Nodes flagged'
                        style={{ marginRight: '0.5em', fontSize: '1.25em' }}
                    />
                    <b>{this.props.flags}</b> of <b>{this.props.mines}</b>
                </Text>
            </Stack>
        );
    }
}

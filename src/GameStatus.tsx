import React from 'react';
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
            <>
                <Text as='p' role='status'>
                    <TimerIcon
                        aria-label='Time'
                        style={{ marginRight: '0.5em', fontSize: '1.25em' }}
                    />
                    {this.props.time} seconds
                </Text>
                <Text as='p' role='status'>
                    <BroomIcon
                        aria-label='Sweeping progress'
                        style={{ marginRight: '0.5em', fontSize: '1.25em' }}
                    />
                    {new Intl.NumberFormat(undefined, {
                        style: 'percent',
                        maximumFractionDigits: 1,
                    }).format(
                        this.props.revealed /
                            (this.props.size - this.props.mines)
                    )}{' '}
                    devices powered on
                </Text>
                <Text as='p'>
                    <FlagIcon
                        aria-label='Nodes flagged'
                        style={{ marginRight: '0.5em', fontSize: '1.25em' }}
                    />
                    <b>{this.props.flags}</b> of <b>{this.props.mines}</b>
                </Text>
            </>
        );
    }
}

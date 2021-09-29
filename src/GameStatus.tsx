import React from 'react';
import { Text } from '@fluentui/react/lib/Text';
import { ClockIcon, FlagIcon } from '@fluentui/react-icons-mdl2';

export interface Props {
    time: number;
    flags: number;
    mines: number;
}

export default class GameStatus extends React.Component<Props> {
    public render() {
        return (
            <>
                <Text as='p' role='status'>
                    <ClockIcon
                        aria-label='Time'
                        style={{ marginRight: '0.5em', fontSize: '1.25em' }}
                    />
                    {this.props.time} seconds
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

import React from 'react';
import HighScoreBoard from './HighScoreBoard';
import { LevelName } from './Levels';
import { Label } from '@fluentui/react/lib/Label';
import { Pivot, PivotItem } from '@fluentui/react/lib/Pivot';
import { Stack } from '@fluentui/react/lib/Stack';
import { Text } from '@fluentui/react/lib/Text';
import {
    KeyboardClassicIcon,
    TouchPointerIcon,
} from '@fluentui/react-icons-mdl2';

export interface Props {
    highscores: { [level in LevelName]: number[] };
}

export default class GameInfo extends React.Component<Props> {
    render() {
        return (
            <Pivot className='gameInfo shadowUtil' overflowBehavior='menu'>
                <PivotItem headerText='Background (story)'>
                    <Text>
                        <p>
                            Upon receiving a notice from your company's{' '}
                            <abbr title='Internet Service Provider'>ISP</abbr>{' '}
                            about outgoing connections to a{' '}
                            <a
                                href='https://en.wikipedia.org/wiki/Botnet'
                                target='_blank'
                                rel='noopener'
                            >
                                malware command-and-control centre
                            </a>
                            , every network-connected device was shut down by
                            your company's overzealous system analysts.
                        </p>
                        <p>
                            Unfortunately, the suspected{' '}
                            <a
                                href='https://en.wikipedia.org/wiki/Ransomware'
                                target='_blank'
                                rel='noopener'
                            >
                                ransomware
                            </a>{' '}
                            operates by encrypting all mounted drives upon
                            startup.
                        </p>
                        <p>
                            You're a cybersecurity analyst in the{' '}
                            <a
                                href='https://en.wikipedia.org/wiki/Information_security_operations_center'
                                target='_blank'
                                rel='noopener'
                            >
                                Security Operations Centre
                            </a>{' '}
                            tasked with remediating this security incident. Can
                            you quarantine all the threats without having your
                            company's data held hostage?
                        </p>
                    </Text>
                </PivotItem>
                <PivotItem headerText='Gameplay'>
                    <Text>
                        <p>
                            Power on all uninfected nodes on the network without
                            powering on any infected nodes. Powered on nodes
                            will indicate the number of adjacent infected nodes.
                        </p>
                        <p>
                            Flags can be used to mark a node as quarantined so
                            that it cannot be accidentally powered on.
                        </p>
                    </Text>
                </PivotItem>
                <PivotItem headerText='Controls'>
                    <Stack
                        horizontal
                        horizontalAlign='space-between'
                        wrap
                        tokens={{ childrenGap: 's1' }}
                    >
                        <Stack.Item style={{ flexBasis: '45%' }}>
                            <Label>
                                <KeyboardClassicIcon
                                    style={{
                                        fontSize: '1.25em',
                                        marginRight: '0.25rem',
                                    }}
                                />
                                Keyboard
                            </Label>
                            <dl>
                                <dt>
                                    <kbd>Enter</kbd> or <kbd>Spacebar</kbd>
                                </dt>
                                <dd>On powered-off nodes: Power on</dd>
                                <dd>
                                    On powered-on nodes with adjacent threats:
                                    Attempt to safely auto power on adjacent
                                    nodes
                                </dd>
                                <dt>
                                    <kbd>Q</kbd>
                                </dt>
                                <dd>
                                    Toggle flag on selected powered-off node
                                </dd>
                                <dt>
                                    <kbd>W</kbd>
                                    <kbd>A</kbd>
                                    <kbd>S</kbd>
                                    <kbd>D</kbd> (or arrow keys)
                                </dt>
                                <dd>
                                    Navigate (nodes with no adjacent threats
                                    will be skipped)
                                </dd>
                                <dt>
                                    <kbd>Home</kbd>
                                </dt>
                                <dd>Navigate to start of row</dd>
                                <dt>
                                    <kbd>End</kbd>
                                </dt>
                                <dd>Navigate to end of row</dd>
                                <dt>
                                    <kbd>Page up</kbd>
                                </dt>
                                <dd>Navigate to top of column</dd>
                                <dt>
                                    <kbd>Page down</kbd>
                                </dt>
                                <dd>Navigate to bottom of column</dd>
                            </dl>
                        </Stack.Item>
                        <Stack.Item style={{ flexBasis: '45%' }}>
                            <Label>
                                <TouchPointerIcon
                                    style={{
                                        fontSize: '1.25em',
                                        marginRight: '0.25rem',
                                    }}
                                />
                                Mouse
                            </Label>
                            <dl>
                                <dt>Click</dt>
                                <dd>On powered-off nodes: Power on</dd>
                                <dt>Double-click</dt>
                                <dd>
                                    On powered-on nodes with adjacent threats:
                                    Attempt to safely auto power on adjacent
                                    nodes
                                </dd>
                                <dt>Right-click</dt>
                                <dd>
                                    Toggle flag on selected powered-off node
                                </dd>
                            </dl>
                        </Stack.Item>
                    </Stack>
                </PivotItem>
                <PivotItem headerText='High scores' className='highScorePanel'>
                    <Stack
                        horizontal
                        horizontalAlign='stretch'
                        wrap
                        tokens={{ childrenGap: 's1', padding: 'm' }}
                    >
                        {(['EASY', 'MEDIUM', 'HARD'] as LevelName[]).map(
                            (level) => (
                                <Stack.Item style={{ flex: '1' }} key={level}>
                                    <Text variant='large'>{level}</Text>
                                    <HighScoreBoard
                                        highscores={
                                            this.props.highscores[level]
                                        }
                                    />
                                </Stack.Item>
                            )
                        )}
                    </Stack>
                </PivotItem>
                <PivotItem headerText='Achievements'>
                    <Label>TODO</Label>
                </PivotItem>
            </Pivot>
        );
    }
}

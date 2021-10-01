import React from 'react';
import AchievementsEngine from './AchievementsEngine';
import AchievementsPanel from './AchievementsPanel';
import GameControls from './GameControls';
import HighScoreBoard from './HighScoreBoard';
import { LevelName } from './Levels';
import { Pivot, PivotItem } from '@fluentui/react/lib/Pivot';
import { Stack } from '@fluentui/react/lib/Stack';
import { Text } from '@fluentui/react/lib/Text';

export interface Props {
    highscores: { [level in LevelName]: number[] };
    achievementsEngine: AchievementsEngine;
}

export default class GameInfo extends React.Component<Props> {
    render() {
        return (
            <Pivot className='gameInfo shadowUtil' overflowBehavior='menu'>
                <PivotItem headerText='Background (story)'>
                    <Text>
                        <p>
                            Upon receiving a notice from your company’s{' '}
                            <abbr title='Internet Service Provider'>ISP</abbr>{' '}
                            about outgoing connections to a{' '}
                            <a
                                href='https://en.wikipedia.org/wiki/Botnet'
                                target='_blank'
                                rel='noreferrer noopener'
                            >
                                malware command-and-control centre
                            </a>
                            , every network-connected device was shut down by
                            your company’s overzealous system analysts.
                        </p>
                        <p>
                            Unfortunately, the suspected{' '}
                            <a
                                href='https://en.wikipedia.org/wiki/Ransomware'
                                target='_blank'
                                rel='noreferrer noopener'
                            >
                                ransomware
                            </a>{' '}
                            operates by encrypting all mounted drives upon
                            startup.
                        </p>
                        <p>
                            You are a cybersecurity analyst in the{' '}
                            <a
                                href='https://en.wikipedia.org/wiki/Information_security_operations_center'
                                target='_blank'
                                rel='noreferrer noopener'
                            >
                                Security Operations Centre
                            </a>{' '}
                            tasked with remediating this security incident. Can
                            you quarantine all the threats without having your
                            company’s data held hostage?
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
                    <GameControls />
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
                    <AchievementsPanel engine={this.props.achievementsEngine} />
                </PivotItem>
            </Pivot>
        );
    }
}

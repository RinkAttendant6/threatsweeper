import React from 'react';
import AchievementsEngine from './AchievementsEngine';
import { Text } from '@fluentui/react/lib/Text';
import { Trophy2Icon, Trophy2SolidIcon } from '@fluentui/react-icons-mdl2';

interface Props {
    engine: AchievementsEngine;
}

export default class AchievementsPanel extends React.Component<Props> {
    render() {
        const achievements = this.props.engine.list();
        const dateFormatter = new Intl.DateTimeFormat([], {
            dateStyle: 'long',
        });

        return (
            <ul className='achievementsPanel'>
                {Object.entries(achievements).map(([name, achievement]) => {
                    return (
                        <li
                            key={name}
                            className={
                                achievement.achievedOn
                                    ? 'achieved'
                                    : 'notAchieved'
                            }
                        >
                            <div className='trophyIcon'>
                                {achievement.achievedOn ? (
                                    <Trophy2SolidIcon />
                                ) : (
                                    <Trophy2Icon />
                                )}
                            </div>
                            <div>
                                <p className='achievementTitle'>
                                    <Text
                                        variant='mediumPlus'
                                        style={{ fontWeight: 'bold' }}
                                    >
                                        {achievement.link ? (
                                            <a
                                                href={achievement.link}
                                                target='_blank'
                                                rel='noreferrer noopener'
                                            >
                                                {achievement.name}
                                            </a>
                                        ) : (
                                            achievement.name
                                        )}
                                    </Text>
                                </p>
                                <Text className='achievementDescription'>
                                    {achievement.secret &&
                                    !achievement.achievedOn ? (
                                        <i>This is a secret achievement</i>
                                    ) : (
                                        achievement.description
                                    )}
                                </Text>
                                <div>
                                    <Text>
                                        {achievement.achievedOn ? (
                                            <>
                                                You first achieved this on{' '}
                                                <time
                                                    dateTime={achievement.achievedOn.toISOString()}
                                                    title={achievement.achievedOn.toISOString()}
                                                >
                                                    {dateFormatter.format(
                                                        achievement.achievedOn
                                                    )}
                                                </time>
                                            </>
                                        ) : (
                                            `Not achieved yet`
                                        )}
                                    </Text>
                                </div>
                            </div>
                        </li>
                    );
                })}
            </ul>
        );
    }
}

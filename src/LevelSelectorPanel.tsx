import Levels from './Levels';
import React from 'react';
import { DefaultButton } from '@fluentui/react/lib/Button';
import { Stack } from '@fluentui/react/lib/Stack';
import { Text } from '@fluentui/react/lib/Text';
import { ITooltipProps, TooltipHost } from '@fluentui/react/lib/Tooltip';

export interface Props {
    newGameCallback: (level: LevelName) => void;
}

type LevelName = keyof typeof Levels;

export default class LevelSelectorPanel extends React.Component<Props> {
    /**
     * Get tooltip properties (text) for each level
     */
    #getLevelDescriptionTooltipProps(level: LevelName): ITooltipProps {
        const descriptions: { [level in LevelName]: string } = {
            EASY: 'In real-life, a class C network contains a block of 256 IP addresses.',
            MEDIUM: 'In real-life, a class B network contains a block of 65,536 IP addresses.',
            HARD: 'In real-life, a class A network contains a block of 16,777,216 IP addresses.',
        };

        return {
            onRenderContent: () => (
                <>
                    {Levels[level].width} × {Levels[level].height} board size.{' '}
                    {descriptions[level]}{' '}
                    <a
                        href='https://en.wikipedia.org/wiki/Classful_network'
                        target='_blank'
                        rel='noreferrer noopener'
                    >
                        Learn more about classful networks.
                    </a>
                </>
            ),
        };
    }

    render() {
        const buttonLabels: { [level in LevelName]: string } = {
            EASY: 'Class C (Easy)',
            MEDIUM: 'Class B (Medium)',
            HARD: 'Class A (Expert)',
        };

        return (
            <fieldset>
                <legend>New game</legend>
                <Stack horizontal wrap tokens={{ childrenGap: 's1' }}>
                    <Text>Network size:</Text>
                    {Object.entries(buttonLabels).map(([level, text]) => (
                        <TooltipHost
                            key={level}
                            tooltipProps={this.#getLevelDescriptionTooltipProps(
                                level as LevelName
                            )}
                        >
                            <DefaultButton
                                type='button'
                                value={level}
                                onClick={() =>
                                    this.props.newGameCallback(
                                        level as LevelName
                                    )
                                }
                            >
                                {text}
                            </DefaultButton>
                        </TooltipHost>
                    ))}
                </Stack>
            </fieldset>
        );
    }
}

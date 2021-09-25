import IGameLevelInterface from './interfaces/IGameLevelInterface';
import Levels from './Levels';
import React from 'react';
import { CompoundButton } from '@fluentui/react/lib/Button';
import { Stack } from '@fluentui/react/lib/Stack';
import { Text } from '@fluentui/react/lib/Text';

export interface Props {
    newGameCallback: (level: IGameLevelInterface) => void;
}

export default class LevelSelectorPanel extends React.Component<Props> {
    render() {
        return (
            <fieldset>
                <legend>New game</legend>
                <Stack tokens={{ childrenGap: 's1' }}>
                    <Text>Choose network size:</Text>
                    <CompoundButton
                        type='button'
                        value='easy'
                        secondaryText='Easy (9 × 9)'
                        onClick={() => this.props.newGameCallback(Levels.EASY)}
                    >
                        Class C -/24
                    </CompoundButton>
                    <CompoundButton
                        type='button'
                        value='medium'
                        secondaryText='Medium (16 × 16)'
                        onClick={() =>
                            this.props.newGameCallback(Levels.MEDIUM)
                        }
                    >
                        Class B -/16
                    </CompoundButton>
                    <CompoundButton
                        type='button'
                        value='expert'
                        secondaryText='Expert (30 × 16)'
                        onClick={() => this.props.newGameCallback(Levels.HARD)}
                    >
                        Class A -/8
                    </CompoundButton>
                </Stack>
            </fieldset>
        );
    }
}

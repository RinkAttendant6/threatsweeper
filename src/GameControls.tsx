import React from 'react';
import { Label } from '@fluentui/react/lib/Label';
import { Stack } from '@fluentui/react/lib/Stack';
import {
    KeyboardClassicIcon,
    TouchPointerIcon,
} from '@fluentui/react-icons-mdl2';

export default class GameControls extends React.Component {
    render() {
        return (
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
                            On powered-on nodes with adjacent threats: Attempt
                            to safely auto power on adjacent nodes
                        </dd>
                        <dt>
                            <kbd>Q</kbd>
                        </dt>
                        <dd>Toggle flag on selected powered-off node</dd>
                        <dt>
                            <kbd>W</kbd>
                            <kbd>A</kbd>
                            <kbd>S</kbd>
                            <kbd>D</kbd> (or arrow keys)
                        </dt>
                        <dd>
                            Navigate (nodes with no adjacent threats will be
                            skipped)
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
                            On powered-on nodes with adjacent threats: Attempt
                            to safely auto power on adjacent nodes
                        </dd>
                        <dt>Right-click</dt>
                        <dd>Toggle flag on selected powered-off node</dd>
                    </dl>
                </Stack.Item>
            </Stack>
        );
    }
}

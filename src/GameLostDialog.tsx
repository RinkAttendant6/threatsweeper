import React from 'react';
import { Dialog, DialogType, DialogFooter } from '@fluentui/react/lib/Dialog';
import { PrimaryButton } from '@fluentui/react/lib/Button';
import { ReportHackedIcon } from '@fluentui/react-icons-mdl2';
import { Stack } from '@fluentui/react/lib/Stack';
import { PartialTheme, ThemeProvider } from '@fluentui/react/lib/Theme';

interface Props {
    hidden: boolean;
    toggleHideDialog: () => void;
}

const theme: PartialTheme = {
    palette: {
        themePrimary: '#a4262c',
        themeDarkAlt: '#932227',
    },
};

export default class GameLostDialog extends React.Component<Props> {
    render() {
        const dialogContentProps = {
            type: DialogType.largeHeader,
            title: "You've been pwned!",
            subText:
                'Oh no! An infected device was booted and your network has been compromised by a wormable ransomware.',
        };

        return (
            <ThemeProvider theme={theme}>
                <Dialog
                    hidden={this.props.hidden}
                    onDismiss={this.props.toggleHideDialog}
                    dialogContentProps={dialogContentProps}
                >
                    <Stack
                        horizontal
                        verticalAlign='center'
                        tokens={{ childrenGap: 'm' }}
                    >
                        <ReportHackedIcon
                            style={{ fontSize: '1.5rem', color: 'red' }}
                        />
                        <span>
                            Cyber security is a shared responsibility.{' '}
                            <a href='https://getcybersafe.gc.ca/en'>
                                Learn how to stay safe online.
                            </a>
                        </span>
                    </Stack>
                    <DialogFooter>
                        <PrimaryButton
                            onClick={this.props.toggleHideDialog}
                            text='Try again'
                        />
                    </DialogFooter>
                </Dialog>
            </ThemeProvider>
        );
    }
}

import React from 'react';
import { Dialog, DialogType, DialogFooter } from '@fluentui/react/lib/Dialog';
import { PrimaryButton } from '@fluentui/react/lib/Button';
import { ReportHackedIcon } from '@fluentui/react-icons-mdl2';
import { Stack } from '@fluentui/react/lib/Stack';
import { PartialTheme, ThemeProvider } from '@fluentui/react/lib/Theme';

interface Props {
    hidden: boolean;
    instantLoss: boolean;
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
            title: this.props.instantLoss
                ? 'Pwned by a 0-day!'
                : "You've been pwned!",
            subText: this.props.instantLoss
                ? `How unlucky! Unfortunately, sometimes that's just the way it is.`
                : `Oh no! An infected device was booted and your network has been compromised by a wormable ransomware.`,
        };

        const content = this.props.instantLoss ? (
            <>
                In real-life, a{' '}
                <a
                    href='https://en.wikipedia.org/wiki/Zero-day_(computing)'
                    target='_blank'
                    rel='noopener'
                >
                    0-day exploit
                </a>{' '}
                is often very difficult to defend against. Your best option is
                to keep your systems up-to-date and practice safe computing
                habits.
            </>
        ) : (
            <>Cyber security is a shared responsibility.</>
        );

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
                            {content}{' '}
                            <a
                                href='https://getcybersafe.gc.ca/en'
                                target='_blank'
                                rel='noopener'
                            >
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

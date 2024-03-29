import React from 'react';
import { Dialog, DialogType, DialogFooter } from '@fluentui/react/lib/Dialog';
import { PrimaryButton } from '@fluentui/react/lib/Button';
import { EncryptionIcon } from '@fluentui/react-icons-mdl2';
import { Stack } from '@fluentui/react/lib/Stack';

interface Props {
    hidden: boolean;
    toggleHideDialog: () => void;
}

export default class GameWonDialog extends React.Component<Props> {
    render() {
        const dialogContentProps = {
            type: DialogType.largeHeader,
            title: 'Well done',
            subText:
                "Congratulations! All the known threats on your network have been identified and quarantined. You're back in business!",
        };

        return (
            <>
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
                        <EncryptionIcon
                            style={{ fontSize: '1.5rem', color: 'green' }}
                        />
                        <span>
                            Remember, there is no such thing as 100% secure.{' '}
                            <a
                                href='https://getcybersafe.gc.ca/en'
                                target='_blank'
                                rel='noreferrer noopener'
                            >
                                Learn how to stay safe online.
                            </a>
                        </span>
                    </Stack>
                    <DialogFooter>
                        <PrimaryButton
                            onClick={this.props.toggleHideDialog}
                            text='Play again?'
                        />
                    </DialogFooter>
                </Dialog>
            </>
        );
    }
}

import React from 'react';
import ISquareDataInterface, {
    DisplayState,
} from './interfaces/ISquareDataInterface';
import {
    EndPointSolidIcon,
    BlockedSiteIcon,
    BlockedSiteSolid12Icon,
    UnknownSolidIcon,
} from '@fluentui/react-icons-mdl2';

export interface Props {
    x: number;
    y: number;
    gameAvailable: boolean;

    squareState: ISquareDataInterface;

    onClick: (e: React.MouseEvent<HTMLElement>) => void;
    onRightClick: (e: React.MouseEvent<HTMLElement>) => void;
    onDoubleClick: (e?: React.MouseEvent<HTMLElement>) => void;
}

/**
 * Class representing a square on the game board
 */
export default class Square extends React.Component<Props> {
    render() {
        const { surroundingMines, displayState } = this.props.squareState;

        let contents: string | JSX.Element = {
            [DisplayState.Covered]: '',
            [DisplayState.Uncovered]: String(surroundingMines || ''),
            [DisplayState.Flagged]: <EndPointSolidIcon />,
            [DisplayState.Maybe]: <UnknownSolidIcon />,
            [DisplayState.Detonated]: <BlockedSiteSolid12Icon />,
        }[displayState];

        let label: string = {
            [DisplayState.Covered]: `Node ${this.props.x},${this.props.y} - Powered off`,
            [DisplayState.Uncovered]: `Node ${this.props.x},${this.props.y} - ${this.props.squareState.surroundingMines} adjacent threats`,
            [DisplayState.Flagged]: `Node ${this.props.x},${this.props.y} - Flagged for quarantine`,
            [DisplayState.Maybe]: `Node ${this.props.x},${this.props.y} - Maybe quarantine?`,
            [DisplayState.Detonated]: `Node ${this.props.x},${this.props.y} - Compromised`,
        }[displayState];

        let className: string = {
            [DisplayState.Covered]: `covered`,
            [DisplayState.Uncovered]: `revealed`,
            [DisplayState.Flagged]: `flagged`,
            [DisplayState.Maybe]: `maybe`,
            [DisplayState.Detonated]: `detonated`,
        }[displayState];

        // If game is not in progress
        if (!this.props.gameAvailable) {
            // Incorrectly flagged squares
            if (
                displayState === DisplayState.Flagged &&
                surroundingMines !== -1
            ) {
                label = `Node ${this.props.x},${this.props.y} - Falsely quarantined`;
                className = 'flagged-wrong';
            }

            // Undetonated mines
            if (
                displayState === DisplayState.Covered &&
                surroundingMines === -1
            ) {
                contents = <BlockedSiteIcon />;
                label = `Node ${this.props.x},${this.props.y} - Contained a threat`;
                className = 'vulnerable';
            }
        }

        return (
            <td
                key={this.props.x + ' ' + this.props.y}
                className={className || ''}
            >
                <button
                    type='button'
                    value={surroundingMines}
                    title={label}
                    aria-label={label}
                    disabled={!this.props.gameAvailable}
                    onClick={
                        this.props.gameAvailable &&
                        displayState === DisplayState.Covered
                            ? this.props.onClick
                            : undefined
                    }
                    onDoubleClick={
                        this.props.gameAvailable &&
                        displayState === DisplayState.Uncovered
                            ? this.props.onDoubleClick
                            : undefined
                    }
                    onContextMenu={
                        this.props.gameAvailable
                            ? this.props.onRightClick
                            : undefined
                    }
                    tabIndex={
                        surroundingMines === 0 &&
                        displayState === DisplayState.Uncovered
                            ? -1
                            : 0
                    }
                >
                    {contents}
                </button>
            </td>
        );
    }
}

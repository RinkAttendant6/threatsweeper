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
        let contents: string | JSX.Element = {
            [DisplayState.Covered]: '',
            [DisplayState.Uncovered]: String(
                this.props.squareState.surroundingMines || ''
            ),
            [DisplayState.Flagged]: <EndPointSolidIcon />,
            [DisplayState.Maybe]: <UnknownSolidIcon />,
            [DisplayState.Detonated]: <BlockedSiteSolid12Icon />,
        }[this.props.squareState.displayState];

        let label: string = {
            [DisplayState.Covered]: `Square ${this.props.x},${this.props.y}`,
            [DisplayState.Uncovered]: `Square ${this.props.x},${this.props.y} - ${this.props.squareState.surroundingMines} surrounding mines`,
            [DisplayState.Flagged]: `Square ${this.props.x},${this.props.y} - Marked as containing a mine`,
            [DisplayState.Maybe]: `Square ${this.props.x},${this.props.y} - Marked as possibly containing a mine`,
            [DisplayState.Detonated]: `Square ${this.props.x},${this.props.y} - Detonated`,
        }[this.props.squareState.displayState];

        let className: string = {
            [DisplayState.Covered]: `covered`,
            [DisplayState.Uncovered]: ``,
            [DisplayState.Flagged]: `flagged`,
            [DisplayState.Maybe]: `maybe`,
            [DisplayState.Detonated]: `detonated`,
        }[this.props.squareState.displayState];

        // If game is not in progress
        if (!this.props.gameAvailable) {
            // Incorrectly flagged squares
            if (
                this.props.squareState.displayState === DisplayState.Flagged &&
                this.props.squareState.surroundingMines !== -1
            ) {
                label = `Square ${this.props.x},${this.props.y} - Falsely marked as containing a mine`;
                className = 'flagged-wrong';
            }

            // Undetonated mines
            if (
                this.props.squareState.displayState === DisplayState.Covered &&
                this.props.squareState.surroundingMines === -1
            ) {
                contents = <BlockedSiteIcon />;
                label = `Square ${this.props.x},${this.props.y} - Contained a mine`;
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
                    title={label}
                    aria-label={label}
                    disabled={!this.props.gameAvailable}
                    onClick={
                        this.props.gameAvailable &&
                        this.props.squareState.displayState ===
                            DisplayState.Covered
                            ? this.props.onClick
                            : undefined
                    }
                    onDoubleClick={
                        this.props.gameAvailable &&
                        this.props.squareState.displayState ===
                            DisplayState.Uncovered
                            ? this.props.onDoubleClick
                            : undefined
                    }
                    onContextMenu={
                        this.props.gameAvailable
                            ? this.props.onRightClick
                            : undefined
                    }
                >
                    {contents}
                </button>
            </td>
        );
    }
}

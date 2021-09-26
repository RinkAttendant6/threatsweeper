import React, { KeyboardEvent } from 'react';
import { NavigationDirection } from './GameBoard';
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
    isFocused: boolean;

    onClick: () => void;
    onRightClick: () => void;
    onDoubleClick: () => void;
    onNavigate: (e: KeyboardEvent, direction: NavigationDirection) => void;
}

/**
 * Class representing a square on the game board
 */
export default class Square extends React.Component<Props> {
    /**
     * Handler for keyboard controls
     */
    #handleKeyboardControls(e: KeyboardEvent): void {
        switch (e.code) {
            // Click/double-click events
            case 'Enter':
            case 'Space':
                e.preventDefault();

                switch (this.props.squareState.displayState) {
                    case DisplayState.Covered:
                        this.props.onClick();
                        break;
                    case DisplayState.Uncovered:
                        this.props.onDoubleClick();
                        break;
                }
                break;

            // Right-click events
            case 'KeyQ':
                e.preventDefault();
                this.props.onRightClick();
                break;

            // Navigation
            case 'ArrowUp':
            case 'KeyW':
                e.preventDefault();
                this.props.onNavigate(e, NavigationDirection.Up);
                break;
            case 'ArrowDown':
            case 'KeyS':
                e.preventDefault();
                this.props.onNavigate(e, NavigationDirection.Down);
                break;
            case 'ArrowLeft':
            case 'KeyA':
                e.preventDefault();
                this.props.onNavigate(e, NavigationDirection.Left);
                break;
            case 'ArrowRight':
            case 'KeyD':
                e.preventDefault();
                this.props.onNavigate(e, NavigationDirection.Right);
                break;
            case 'Home':
                e.preventDefault();
                this.props.onNavigate(e, NavigationDirection.Start);
                break;
            case 'End':
                e.preventDefault();
                this.props.onNavigate(e, NavigationDirection.End);
                break;
            case 'PageUp':
                e.preventDefault();
                this.props.onNavigate(e, NavigationDirection.Top);
                break;
            case 'PageDown':
                e.preventDefault();
                this.props.onNavigate(e, NavigationDirection.Bottom);
                break;
        }
    }

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
                    ref={(element) =>
                        element && this.props.isFocused && element.focus()
                    }
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
                    onKeyDown={
                        this.props.gameAvailable
                            ? this.#handleKeyboardControls.bind(this)
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

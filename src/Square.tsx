import React from 'react';
import SquareDataInterface, {DisplayState} from './interfaces/SquareDataInterface';
import {AlertOctagon, Flag, HelpCircle} from 'react-feather';

export interface Props {
    x: number;
    y: number;
    gameInProgress: boolean;

    squareState: SquareDataInterface;

    onClick: (e: React.MouseEvent<HTMLElement>) => void;
    onRightClick: (e: React.MouseEvent<HTMLElement>) => void;
    onDoubleClick: (e?: React.MouseEvent<HTMLElement>) => void;
}

/**
 * Class representing a square on the game board
 */
export default class Square extends React.PureComponent<Props> {
    render() {
        let contents: string|JSX.Element = '';
        let className: string|null = null;

        switch (this.props.squareState.displayState) {
            case DisplayState.Covered:
                className = 'covered';
                break;
            case DisplayState.Uncovered:
                contents = String(this.props.squareState.surroundingMines || '');
                className = '';
                break;
            case DisplayState.Flagged:
                contents = <Flag />;
                className = 'flagged';
                break;
            case DisplayState.Maybe:
                contents = <HelpCircle />;
                className = 'maybe';
                break;
            case DisplayState.Detonated:
                contents = <AlertOctagon />;
                className = 'detonated';
                break;
        }

        return (
            <td key={this.props.x + ' ' + this.props.y} className={className || ''}>
                <button type='button'
                        disabled={!this.props.gameInProgress || [DisplayState.Uncovered, DisplayState.Detonated].includes(this.props.squareState.displayState)}
                        onClick={this.props.gameInProgress ? this.props.onClick : undefined}
                        onDoubleClick={this.props.gameInProgress ? this.props.onDoubleClick : undefined}
                        onContextMenu={this.props.gameInProgress ? this.props.onRightClick : undefined}
                >
                    {contents}
                </button>
            </td>
        );
    }
}

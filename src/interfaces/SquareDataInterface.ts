export enum DisplayState {
    Covered = "COVERED",
    Uncovered = "UNCOVERED",
    Flagged = "FLAGGED",
    Detonated = "DETONATED",
    Maybe = "MAYBE"
}

export default interface SquareDataInterface {
    displayState: DisplayState;
    surroundingMines: number;
}

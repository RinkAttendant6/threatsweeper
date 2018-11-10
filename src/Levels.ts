import Level from './interfaces/IGameLevelInterface';

const Levels: {[key: string]: Level} = {
    EASY: {
        width: 9,
        height: 9,
        mines: 10
    },
    MEDIUM: {
        width: 16,
        height: 16,
        mines: 40
    },
    HARD: {
        width: 30,
        height: 16,
        mines: 99
    }
};

export default Levels;

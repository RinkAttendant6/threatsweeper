import { GameState } from './GameEngine';
import { DisplayState } from './interfaces/ISquareDataInterface';
import Levels from './Levels';

export interface Achievement {
    name: string;
    description: string;
    link?: string;
    secret: boolean;
    achievedOn: Date | null;
}

export default class AchievementsEngine {
    #achievements: Record<string, Achievement>;

    constructor() {
        this.#achievements = {
            juniorAnalyst: {
                name: 'Junior Security Analyst',
                description: 'Remediate a class C network in 8 seconds or less',
                secret: false,
                achievedOn: null,
            },
            seniorAnalyst: {
                name: 'Senior Security Analyst',
                description:
                    'Remediate a class B network in 60 seconds or less',
                secret: false,
                achievedOn: null,
            },
            ciso: {
                name: 'Chief Information Security Officer',
                description:
                    'Remediate a class A network in 180 seconds or less',
                link: 'https://en.wikipedia.org/wiki/Chief_information_security_officer',
                secret: false,
                achievedOn: null,
            },
            weakestLink: {
                name: 'Weakest Link in the Chain',
                description:
                    'Get pwned while booting the last three devices of a class B or class A network',
                link: 'https://blog.avast.com/weakest-link-in-security-avast',
                secret: false,
                achievedOn: null,
            },
            extinguished: {
                name: 'Extinguished',
                description: 'Get pwned on the perimeter of the network',
                link: 'https://en.wikipedia.org/wiki/Firewall_(computing)',
                secret: false,
                achievedOn: null,
            },
            highValueTarget: {
                name: 'High Value Target',
                description: 'Get pwned by a zero-day vulnerability',
                link: 'https://en.wikipedia.org/wiki/Zero-day_(computing)',
                secret: false,
                achievedOn: null,
            },
            apt: {
                name: 'Advanced Persistent Threat',
                description: 'Get pwned by five zero-day vulnerabilities',
                link: 'https://en.wikipedia.org/wiki/Advanced_persistent_threat',
                secret: false,
                achievedOn: null,
            },
            soar: {
                name: 'SOARing Above and Beyond',
                description: 'Win 20 games',
                link: 'https://www.gartner.com/en/information-technology/glossary/security-orchestration-automation-response-soar',
                secret: false,
                achievedOn: null,
            },
            dhcp: {
                name: 'Do You Even DHCP Bro?',
                description: 'Remediate a class C network without using flags',
                link: 'https://en.wikipedia.org/wiki/Dynamic_Host_Configuration_Protocol',
                secret: false,
                achievedOn: null,
            },
            ipam: {
                name: 'IPAM is My Best Friend',
                description: 'Remediate a class B network without using flags',
                link: 'https://en.wikipedia.org/wiki/IP_address_management',
                secret: false,
                achievedOn: null,
            },
            cmdb: {
                name: 'Who Needs a CMDB Anyways?',
                description: 'Remediate a class A network without using flags',
                link: 'https://en.wikipedia.org/wiki/Configuration_management_database',
                secret: false,
                achievedOn: null,
            },
            overzealous: {
                name: 'Overzealous',
                description: 'Get pwned with a false positive',
                link: 'https://en.wikipedia.org/wiki/False_positives_and_false_negatives',
                secret: false,
                achievedOn: null,
            },
            bufferOverflow: {
                name: 'Buffer Overflow',
                description:
                    'Quarantine (flag) more devices than known threats',
                link: 'https://en.wikipedia.org/wiki/Buffer_overflow',
                secret: true,
                achievedOn: null,
            },
            liveUsb: {
                name: 'If Only We Had a Live USB',
                description: 'Mark four or more devices as "maybe compromised"',
                link: 'https://en.wikipedia.org/wiki/Live_USB',
                secret: true,
                achievedOn: null,
            },
            coffeeBreak: {
                name: 'Coffee Break',
                description: 'Switch tabs or minimize the window',
                secret: true,
                achievedOn: null,
            },
        };

        this.#loadFromWebStorage();
    }

    /**
     * Load achievements from Web Storage
     */
    #loadFromWebStorage(): void {
        try {
            const savedAchievements: Record<string, { achievedOn: string }> =
                JSON.parse(localStorage.getItem('achievements') ?? '{}');

            Object.entries(savedAchievements).forEach(([name, achievement]) => {
                if (name in this.#achievements) {
                    this.#achievements[name].achievedOn = new Date(
                        achievement.achievedOn
                    );
                }
            });
        } catch (err) {
            console.error('Error retrieving saved achievements: ' + err);
        }
    }

    /**
     * Persist acheivements to Web Storage
     */
    persist(): void {
        const serializableAchievements = Object.fromEntries(
            Object.entries(this.#achievements)
                .filter(([_, achievement]) => achievement.achievedOn !== null)
                .map(([name, achievement]) => {
                    return [
                        name,
                        {
                            achievedOn: achievement.achievedOn?.toISOString(),
                        },
                    ];
                })
        );

        localStorage.setItem(
            'achievements',
            JSON.stringify(serializableAchievements)
        );
    }

    /**
     * Evaluate whether achievements have been achieved
     * @param game
     * @param timer
     */
    evaluate(game: GameState, timer: number): void {
        const date = new Date();

        const { board, level, won, lost, flagsUsed } = game;

        const flatBoard = board.flat();
        const totalSquares = flatBoard.length;

        this.#achievements.juniorAnalyst.achievedOn ||=
            won && level === Levels.EASY && timer <= 8 ? date : null;

        this.#achievements.seniorAnalyst.achievedOn ||=
            won && level === Levels.MEDIUM && timer <= 60 ? date : null;

        this.#achievements.ciso.achievedOn ||=
            won && level === Levels.HARD && timer <= 180 ? date : null;

        this.#achievements.weakestLink.achievedOn ||=
            lost &&
            [Levels.MEDIUM, Levels.HARD].includes(level) &&
            totalSquares -
                flatBoard.filter(
                    (square) =>
                        square.displayState === DisplayState.Uncovered ||
                        square.surroundingMines === -1
                ).length <=
                3
                ? date
                : null;

        this.#achievements.extinguished.achievedOn ||=
            lost &&
            [
                ...board[0],
                ...board[board.length - 1],
                ...board.map((col) => col[0]),
                ...board.map((col) => col[col.length - 1]),
            ].some((square) => square.displayState === DisplayState.Detonated)
                ? date
                : null;

        this.#achievements.highValueTarget.achievedOn ||=
            lost &&
            flatBoard.some(
                (square) => square.displayState === DisplayState.Detonated
            ) &&
            !flatBoard.some(
                (square) => square.displayState === DisplayState.Uncovered
            )
                ? date
                : null;

        this.#achievements.apt.achievedOn ||=
            Number(localStorage.getItem('gamesInstantlyLost')) >= 5
                ? date
                : null;

        this.#achievements.soar.achievedOn ||=
            Number(localStorage.getItem('gamesWon')) >= 20 ? date : null;

        this.#achievements.dhcp.achievedOn ||=
            won && !flagsUsed && level === Levels.EASY ? date : null;

        this.#achievements.ipam.achievedOn ||=
            won && !flagsUsed && level === Levels.MEDIUM ? date : null;

        this.#achievements.cmdb.achievedOn ||=
            won && !flagsUsed && level === Levels.HARD ? date : null;

        this.#achievements.overzealous.achievedOn ||=
            lost &&
            flatBoard.some(
                (square) =>
                    square.displayState === DisplayState.Flagged &&
                    square.surroundingMines !== -1
            )
                ? date
                : null;

        this.#achievements.bufferOverflow.achievedOn ||=
            flatBoard.filter(
                (square) => square.displayState === DisplayState.Flagged
            ).length > level.mines
                ? date
                : null;

        this.#achievements.liveUsb.achievedOn ||=
            flatBoard.filter(
                (square) => square.displayState === DisplayState.Maybe
            ).length >= 4
                ? date
                : null;

        this.#achievements.coffeeBreak.achievedOn ||= null;
    }

    list(): Record<string, Achievement> {
        return this.#achievements;
    }
}

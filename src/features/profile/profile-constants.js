// Constants of the profile feature (the cover page).

export const PROFILE_DATA_URL = new URL('./data/profile.json', import.meta.url);

export const PROFILE_CONTAINER_ID = 'profile-container';

export const ProfileCssClass = Object.freeze({
    TITLE: 'cover-title',
    SUBTITLE: 'cover-subtitle',
    ICON: 'cover-icon',
    LOCATION: 'cover-location',
    SOCIAL_LINKS: 'social-links',
});

export const ProfileIcon = Object.freeze({
    COVER: 'fa-code',
    LOCATION: 'fa-map-marker-alt',
});

/** Font Awesome brand icon per social network name used in profile.json. */
export const SocialNetworkIcon = Object.freeze({
    github: 'fa-github',
    linkedin: 'fa-linkedin',
});

// ----- Cover animation: the name and the title appear letter by letter -----

export const BuildCssClass = Object.freeze({
    STAGE: 'build-stage',
    WORD: 'build-word',
    LETTER: 'build-letter',
    WOOD: 'wood-letter',
    PLACED: 'placed',
    SMASHED: 'smashed',
});

export const BuildCssVariable = Object.freeze({
    SMASH_X: '--smash-x',
    SMASH_TURN: '--smash-turn',
});

/** Attribute carrying a letter so CSS can draw the wood grain over it. */
export const LETTER_ATTRIBUTE = 'data-letter';

export const WORD_SEPARATOR = ' ';

export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

export const BuildTiming = Object.freeze({
    START_DELAY_MS: 600,
    /** Time between one letter of the name and the next. */
    LETTER_MS: 190,
    /** The title appears faster than the name. */
    TITLE_SPEED: 0.6,
    WORD_PAUSE_MS: 250,
    /** How long a role stands before it is knocked down. */
    ROLE_HOLD_MS: 1100,
    SMASH_MS: 650,
});

export const Smash = Object.freeze({
    /** Letters fly sideways by up to this many em and spin by up to this many degrees. */
    SPREAD_EM: 1.6,
    TURN_DEG: 140,
});

export const em = value => `${value}em`;
export const deg = value => `${value}deg`;

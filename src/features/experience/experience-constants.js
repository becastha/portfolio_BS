// Constants of the experience feature.

export const EXPERIENCE_DATA_URL = new URL('./data/experience.json', import.meta.url);

export const EXPERIENCE_CONTAINER_ID = 'experience-container';

/** Field names as written in experience.json. */
export const ExperienceDataField = Object.freeze({
    YEAR: 'year',
    OFFICE_NAME: 'office_name',
    ROLE: 'role',
    ENVIRONMENT: 'Environment',
    TEAM_SIZE: 'Total member',
});

export const ExperienceCssClass = Object.freeze({
    CARD: 'exp-card',
    YEAR: 'exp-year',
});

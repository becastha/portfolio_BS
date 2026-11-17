// Constants of the education feature.

export const EDUCATION_DATA_URL = new URL('./data/education.json', import.meta.url);

export const EDUCATION_CONTAINER_ID = 'education-container';

export const EducationCssClass = Object.freeze({
    ITEM: 'edu-entry',
    PERIOD: 'edu-period',
    TITLE: 'edu-title',
    SCHOOL: 'edu-school',
});

/** Written between the school and its location. */
export const SCHOOL_LOCATION_SEPARATOR = ', ';

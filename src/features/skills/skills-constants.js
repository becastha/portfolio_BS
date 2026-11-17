// Constants of the skills feature (programming languages).

export const SKILLS_DATA_URL = new URL('./data/skills.json', import.meta.url);

export const SKILLS_CONTAINER_ID = 'skills-container';

export const SkillsCssClass = Object.freeze({
    ITEM: 'skill-item',
    NAME: 'skill-name',
    FRAMEWORKS: 'skill-frameworks',
    YEARS: 'skill-years',
});

/** Placeholder for the number in the "years of experience" strings. */
export const YEARS_PLACEHOLDER = 'count';

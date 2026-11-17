// Constants of the skills feature.

export const SKILLS_DATA_URL = new URL('./data/skills.json', import.meta.url);

export const SKILLS_CONTAINER_ID = 'skills-container';

/** Skill levels. The value is also the CSS modifier class of the level indicator. */
export const SkillLevel = Object.freeze({
    BEGINNER: 'beginner',
    INTERMEDIATE: 'intermediate',
    PRO: 'pro',
});

/** Level names as written in skills.json. Anything else counts as SkillLevel.PRO. */
export const SKILL_LEVEL_BY_DATA_VALUE = Object.freeze({
    Beginner: SkillLevel.BEGINNER,
    Intermediate: SkillLevel.INTERMEDIATE,
});

export const SkillsCssClass = Object.freeze({
    ITEM: 'skill-item',
    NAME: 'skill-name',
    LEVEL: 'skill-level',
});

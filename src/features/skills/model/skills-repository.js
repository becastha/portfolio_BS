// Loads the skills and their levels.

import { fetchJson } from '../../../shared/data/http.js';
import { SKILL_LEVEL_BY_DATA_VALUE, SkillLevel, SKILLS_DATA_URL } from '../skills-constants.js';

/** @typedef {{ name: string, level: string }} Skill level is a SkillLevel value */

/** @returns {Promise<Skill[]>} */
export async function loadSkills() {
    const raw = await fetchJson(SKILLS_DATA_URL);
    return Object.entries(raw).map(([name, level]) => ({
        name,
        level: SKILL_LEVEL_BY_DATA_VALUE[level] ?? SkillLevel.PRO,
    }));
}

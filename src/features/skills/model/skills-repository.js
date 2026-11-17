// Loads the programming languages with the years of experience and frameworks used with each.

import { fetchJson } from '../../../shared/data/http.js';
import { SKILLS_DATA_URL } from '../skills-constants.js';

/**
 * @typedef {{ name: string, years: number|null, frameworks: string }} Skill
 * years is null and frameworks is empty when the data gives none.
 */

/** @returns {Promise<Skill[]>} */
export async function loadSkills() {
    const raw = await fetchJson(SKILLS_DATA_URL);
    return raw.map(entry => ({
        name: entry.name,
        years: entry.years ?? null,
        frameworks: entry.frameworks ?? '',
    }));
}

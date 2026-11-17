// Loads the working experience list.

import { fetchJson } from '../../../shared/data/http.js';
import { EXPERIENCE_DATA_URL, ExperienceDataField as Field } from '../experience-constants.js';

/**
 * @typedef {{ year: string, officeName: string, role: string, environment: string, teamSize: string }} Experience
 */

/** @returns {Promise<Experience[]>} */
export async function loadExperience() {
    const raw = await fetchJson(EXPERIENCE_DATA_URL);
    return raw.map(entry => ({
        year: entry[Field.YEAR],
        officeName: entry[Field.OFFICE_NAME],
        role: entry[Field.ROLE],
        environment: entry[Field.ENVIRONMENT],
        teamSize: entry[Field.TEAM_SIZE],
    }));
}

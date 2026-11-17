// Loads the working experience list.

import { fetchJson } from '../../../shared/data/http.js';
import { EXPERIENCE_DATA_URL, ExperienceDataField as Field } from '../experience-constants.js';

/**
 * @typedef {{ year: string, officeName: string, url: string, location: string, role: string, environment: string,
 *   teamSize: string, responsibilities: string[] }} Experience
 * url, location, environment, teamSize are empty and responsibilities is an empty list when the data has none.
 */

/** @returns {Promise<Experience[]>} */
export async function loadExperience() {
    const raw = await fetchJson(EXPERIENCE_DATA_URL);
    return raw.map(entry => ({
        year: entry[Field.YEAR],
        officeName: entry[Field.OFFICE_NAME],
        url: entry[Field.URL] ?? '',
        location: entry[Field.LOCATION] ?? '',
        role: entry[Field.ROLE],
        environment: entry[Field.ENVIRONMENT] ?? '',
        teamSize: entry[Field.TEAM_SIZE] ?? '',
        responsibilities: entry[Field.RESPONSIBILITIES] ?? [],
    }));
}

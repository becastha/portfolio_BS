// Loads the education history.

import { fetchJson } from '../../../shared/data/http.js';
import { EDUCATION_DATA_URL } from '../education-constants.js';

/** @typedef {{ period: string, title: string, school: string, location: string }} Education */

/** @returns {Promise<Education[]>} */
export async function loadEducation() {
    const raw = await fetchJson(EDUCATION_DATA_URL);
    return raw.map(entry => ({
        period: entry.period,
        title: entry.title,
        school: entry.school,
        location: entry.location ?? '',
    }));
}

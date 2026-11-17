// Loads the spoken languages.

import { fetchJson } from '../../../shared/data/http.js';
import { LANGUAGES_DATA_URL } from '../languages-constants.js';

/** @typedef {{ name: string, proficiency: string }} Language */

/** @returns {Promise<Language[]>} */
export async function loadLanguages() {
    const raw = await fetchJson(LANGUAGES_DATA_URL);
    return raw.map(entry => ({ name: entry.language, proficiency: entry.proficiency }));
}

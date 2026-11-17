// Loads the quote and the overview sections.

import { fetchJson } from '../../../shared/data/http.js';
import { OVERVIEW_DATA_URL } from '../overview-constants.js';

/**
 * @typedef {{ lines: string[], author: string }} Quote
 * @typedef {{ icon: string, title: string, text: string }} OverviewSection
 * @typedef {{ quote: Quote, sections: OverviewSection[] }} Overview
 */

/** @returns {Promise<Overview>} */
export async function loadOverview() {
    const raw = await fetchJson(OVERVIEW_DATA_URL);
    return {
        quote: { lines: raw.quote?.lines ?? [], author: raw.quote?.author ?? '' },
        sections: (raw.sections ?? []).map(section => ({
            icon: section.icon,
            title: section.title,
            text: section.text,
        })),
    };
}

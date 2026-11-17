// Loads the skyline artwork as SVG markup, so the page can draw it line by line.

import { fetchText } from '../../../shared/data/http.js';
import { SKYLINE_ARTWORK_URL } from '../skyline-constants.js';

/** @returns {Promise<string>} */
export function loadSkylineArtwork() {
    return fetchText(SKYLINE_ARTWORK_URL);
}

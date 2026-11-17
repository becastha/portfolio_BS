// Loads the profile shown on the cover page.

import { fetchJson } from '../../../shared/data/http.js';
import { PROFILE_DATA_URL } from '../profile-constants.js';

/**
 * @typedef {{ network: string, url: string }} SocialLink
 * @typedef {{ name: string, titlePrefix: string, roles: string[], location: string, links: SocialLink[] }} Profile
 * roles: built on the cover one after another; each is torn down for the next, the last one stays.
 */

/** @returns {Promise<Profile>} */
export async function loadProfile() {
    const raw = await fetchJson(PROFILE_DATA_URL);
    return {
        name: raw.name,
        titlePrefix: raw.titlePrefix ?? '',
        roles: raw.roles ?? [],
        location: raw.location,
        links: (raw.links ?? []).map(link => ({ network: link.network, url: link.url })),
    };
}

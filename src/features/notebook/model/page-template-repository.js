// Loads the notebook's page templates (HTML fragments) in reading order.

import { fetchText } from '../../../shared/data/http.js';
import { DevMessage, logger } from '../../../shared/logging/logger.js';
import { PAGE_TEMPLATE_URLS } from '../notebook-constants.js';

/** @returns {Promise<string[]>} template HTML; a template that fails to load is skipped */
export async function loadPageTemplates() {
    const results = await Promise.all(
        PAGE_TEMPLATE_URLS.map(url =>
            fetchText(url).catch(error => {
                logger.error(DevMessage.PAGE_TEMPLATE_FAILED, error);
                return null;
            }),
        ),
    );
    return results.filter(html => html !== null);
}

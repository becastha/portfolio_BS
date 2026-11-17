// Runs an entry point's start function once the document has been parsed.

import { DomEvent, ReadyState } from '../shared/constants/html.js';

export function whenDocumentReady(start) {
    if (document.readyState === ReadyState.LOADING) {
        document.addEventListener(DomEvent.DOM_CONTENT_LOADED, start);
    } else {
        start();
    }
}

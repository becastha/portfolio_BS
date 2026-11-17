// Entry point of the site (index.html): the content features on a single page drawn like
// an old ink-on-paper architectural sheet.

import { ExperienceCssClass } from '../features/experience/experience-constants.js';
import { LanguagesCssClass } from '../features/languages/languages-constants.js';
import { OverviewCssClass } from '../features/overview/overview-constants.js';
import { ProjectsCssClass } from '../features/projects/projects-constants.js';
import { SkillsCssClass } from '../features/skills/skills-constants.js';
import { loadSkylineArtwork } from '../features/skyline/model/skyline-repository.js';
import { SkylineView } from '../features/skyline/view/skyline-view.js';
import { localization } from '../shared/localization/localization.js';
import { followDrawingLines } from '../shared/ui/drawing-stars.js';
import { animateLineDrawings, frameInkBoxes, ruleRows } from '../shared/ui/line-drawing.js';
import { startContentFeatures } from './content-features.js';
import { whenDocumentReady } from './document-ready.js';

/** Rows of the content features that are separated by a drawn rule. */
const RULED_ROW_SELECTOR = [
    OverviewCssClass.QUOTE,
    OverviewCssClass.SECTION,
    ProjectsCssClass.CARD,
    SkillsCssClass.ITEM,
    LanguagesCssClass.ITEM,
    ExperienceCssClass.CARD,
]
    .map(className => `.${className}`)
    .join(', ');

async function start() {
    await localization.load();
    localization.apply(document);

    followDrawingLines(document);
    new SkylineView(loadSkylineArtwork).start();
    animateLineDrawings(document);
    frameInkBoxes(document);
    ruleRows(document.body, RULED_ROW_SELECTOR);

    startContentFeatures();
}

whenDocumentReady(start);

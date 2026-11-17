// Entry point of the earlier notebook version (notebook.html), kept for reference; the site itself is index.html.
// Creates each feature's Model, ViewModel and View and wires them together.
// Only the files in src/app know about more than one feature.

import { NotebookModel } from '../features/notebook/model/notebook-model.js';
import { loadPageTemplates } from '../features/notebook/model/page-template-repository.js';
import { bindDragInput } from '../features/notebook/view/drag-input.js';
import { bindKeyboardInput } from '../features/notebook/view/keyboard-input.js';
import { NotebookView } from '../features/notebook/view/notebook-view.js';
import { bindTouchInput } from '../features/notebook/view/touch-input.js';
import { NotebookViewModel } from '../features/notebook/viewmodel/notebook-viewmodel.js';
import { settingsRepository } from '../features/settings/model/settings-repository.js';
import { SettingsView } from '../features/settings/view/settings-view.js';
import { SettingsViewModel } from '../features/settings/viewmodel/settings-viewmodel.js';
import { FlipSoundPlayer } from '../features/sound/model/flip-sound-player.js';
import { SoundToggleView } from '../features/sound/view/sound-toggle-view.js';
import { SoundViewModel } from '../features/sound/viewmodel/sound-viewmodel.js';
import { StarfieldView } from '../features/starfield/view/starfield-view.js';
import { startContentFeatures } from './content-features.js';
import { whenDocumentReady } from './document-ready.js';
import { localization } from '../shared/localization/localization.js';

async function start() {
    await localization.load();
    localization.apply(document);

    new SettingsView(new SettingsViewModel(settingsRepository)).start();

    const sound = new SoundViewModel(new FlipSoundPlayer());
    new SoundToggleView(sound).start();

    const notebook = new NotebookViewModel(new NotebookModel(), loadPageTemplates);
    notebook.onPageFlipped(() => sound.playFlip());
    await new NotebookView(notebook).start();
    bindKeyboardInput(notebook);
    bindTouchInput(notebook);
    bindDragInput(notebook);

    // The pages are mounted now, so the content features can find their containers.
    startContentFeatures();

    new StarfieldView().start();
}

whenDocumentReady(start);

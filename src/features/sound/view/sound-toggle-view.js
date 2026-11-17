// Sound toggle View: the sound button in the control bar.

import { DomEvent } from '../../../shared/constants/html.js';
import { byId } from '../../../shared/ui/dom.js';
import { SOUND_BUTTON_ID, SoundCssClass, SoundIcon, SoundSelector } from '../sound-constants.js';

export class SoundToggleView {
    #viewModel;
    #button = byId(SOUND_BUTTON_ID);

    /** @param {import('../viewmodel/sound-viewmodel.js').SoundViewModel} viewModel */
    constructor(viewModel) {
        this.#viewModel = viewModel;
    }

    start() {
        this.#button.addEventListener(DomEvent.CLICK, () => this.#viewModel.toggle());
        this.#viewModel.state.subscribe(({ isEnabled }) => {
            const icon = this.#button.querySelector(SoundSelector.ICON);
            this.#button.classList.toggle(SoundCssClass.MUTED, !isEnabled);
            icon.classList.toggle(SoundIcon.ON, isEnabled);
            icon.classList.toggle(SoundIcon.OFF, !isEnabled);
        });
    }
}

// Sound ViewModel: whether sound is on, and the command to play the flip sound.

import { Observable } from '../../../shared/mvvm/observable.js';

export class SoundViewModel {
    #player;

    /** @param {{ play: () => void }} player */
    constructor(player) {
        this.#player = player;
        this.state = new Observable({ isEnabled: false });
    }

    toggle() {
        this.state.set({ isEnabled: !this.state.value.isEnabled });
    }

    playFlip() {
        if (this.state.value.isEnabled) this.#player.play();
    }
}

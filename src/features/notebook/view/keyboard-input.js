// Keyboard input for the notebook: translates keys into ViewModel commands.

import { DomEvent, Key } from '../../../shared/constants/html.js';

/** @param {import('../viewmodel/notebook-viewmodel.js').NotebookViewModel} viewModel */
export function bindKeyboardInput(viewModel) {
    const commands = {
        [Key.ARROW_RIGHT]: () => viewModel.flipNext(),
        [Key.SPACE]: () => viewModel.flipNext(),
        [Key.ARROW_LEFT]: () => viewModel.flipPrevious(),
        [Key.HOME]: () => viewModel.goToFirst(),
        [Key.END]: () => viewModel.goToLast(),
    };

    document.addEventListener(DomEvent.KEY_DOWN, event => {
        const command = commands[event.key];
        if (!command) return;
        event.preventDefault();
        command();
    });
}

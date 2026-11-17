// Base ViewModel for a feature whose state is "one resource loaded from its repository".

import { DevMessage, logger } from '../logging/logger.js';
import { Observable } from './observable.js';

export const LoadStatus = Object.freeze({
    IDLE: 'idle',
    LOADING: 'loading',
    READY: 'ready',
    FAILED: 'failed',
});

export class LoadableViewModel {
    #loadData;

    /** @param {() => Promise<unknown>} loadData repository call that returns the feature's data */
    constructor(loadData) {
        this.#loadData = loadData;
        this.state = new Observable({ status: LoadStatus.IDLE, data: null });
    }

    async load() {
        this.state.set({ status: LoadStatus.LOADING, data: null });
        try {
            const data = await this.#loadData();
            this.state.set({ status: LoadStatus.READY, data });
        } catch (error) {
            logger.error(DevMessage.LOAD_FAILED, error);
            this.state.set({ status: LoadStatus.FAILED, data: null });
        }
    }
}

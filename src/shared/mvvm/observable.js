// Minimal observable value: the binding mechanism between a ViewModel and its View.

export class Observable {
    #value;
    #listeners = new Set();

    constructor(initialValue) {
        this.#value = initialValue;
    }

    get value() {
        return this.#value;
    }

    set(value) {
        this.#value = value;
        this.#listeners.forEach(listener => listener(value));
    }

    /** Calls the listener with the current value now and on every change. Returns an unsubscribe function. */
    subscribe(listener) {
        this.#listeners.add(listener);
        listener(this.#value);
        return () => this.#listeners.delete(listener);
    }
}

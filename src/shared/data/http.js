// Shared fetch helpers. Every feature repository loads its resources through these.

import { DevMessage } from '../logging/logger.js';

async function request(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`${DevMessage.HTTP_ERROR}: ${response.status} ${url}`);
    }
    return response;
}

export async function fetchJson(url) {
    return (await request(url)).json();
}

export async function fetchText(url) {
    return (await request(url)).text();
}

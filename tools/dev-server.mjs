// Local development server for the site: serves this folder over HTTP with caching turned off,
// so an edit always shows on reload. Usage: node tools/dev-server.mjs [port]
// Developer-only tool; nothing here is shipped or shown to visitors.

import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const DEFAULT_PORT = 8123;
const INDEX_FILE = 'index.html';
const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));

const CONTENT_TYPES = Object.freeze({
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.mjs': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.webp': 'image/webp',
    '.ico': 'image/x-icon',
    '.ttf': 'font/ttf',
});
const FALLBACK_TYPE = 'application/octet-stream';

const port = Number(process.argv[2]) || DEFAULT_PORT;

createServer(async (request, response) => {
    const send = (status, text) => {
        response.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8' });
        response.end(text);
    };
    try {
        const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
        let file = normalize(join(ROOT, pathname));
        if (file !== ROOT && !file.startsWith(ROOT + sep)) return send(403, 'Forbidden');
        if ((await stat(file)).isDirectory()) file = join(file, INDEX_FILE);
        const { size } = await stat(file);
        response.writeHead(200, {
            'Content-Type': CONTENT_TYPES[extname(file).toLowerCase()] ?? FALLBACK_TYPE,
            'Content-Length': size,
            'Cache-Control': 'no-store',
        });
        createReadStream(file).pipe(response);
    } catch {
        send(404, 'Not found');
    }
}).listen(port, () => console.log(`Serving ${ROOT} at http://localhost:${port}`));

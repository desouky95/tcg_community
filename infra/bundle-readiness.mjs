import http from 'node:http';

// A 404 at the API root still proves its HTTP stack is responding; 5xx does not.
const targets = [
  ['storefront', 3000, '/'],
  ['api', 3333, '/'],
  ['medusa', 9000, '/health'],
  ['cms', 1337, '/_health'],
];

function check([name, port, path]) {
  return new Promise((resolve) => {
    const request = http.get({ host: '127.0.0.1', port, path }, (response) => {
      response.resume();
      resolve(response.statusCode < 500 ? null : name);
    });
    // Absolute deadline also catches a peer that sends data without HTTP headers.
    const deadline = setTimeout(() => request.destroy(new Error('Readiness timeout')), 3000);
    request.once('close', () => clearTimeout(deadline));
    request.once('error', () => resolve(name));
  });
}

http.createServer(async (_request, response) => {
  const failed = (await Promise.all(targets.map(check))).filter(Boolean);
  response.writeHead(failed.length ? 503 : 200, { 'Content-Type': 'text/plain' });
  response.end(failed.length ? `Unavailable: ${failed.join(', ')}\n` : 'ok\n');
}).listen(8081, '127.0.0.1');

#!/usr/bin/env python3
"""Verify the production launcher with fixture apps, never production credentials.

First: docker build --target bundle-runtime -t tcg-bundle-runtime:audit .
Then: python3 infra/verify-bundle.py
"""
import json
from pathlib import Path
import subprocess
import tempfile
import time


def docker(*args):
    return subprocess.check_output(['docker', *args], text=True, timeout=60, stderr=subprocess.STDOUT).strip()


def eventually(check):
    deadline = time.monotonic() + 25
    while time.monotonic() < deadline:
        if check():
            return
        time.sleep(0.2)
    raise AssertionError('Container did not reach the expected state within 25 seconds')


def fetch(container, path='/', host='shop.example.com', port=8080):
    code = f'''import http from 'node:http';
    const request = http.get({{hostname: '127.0.0.1', port: {port}, path: {json.dumps(path)},
      headers: {{host: {json.dumps(host)}}} }}, r => {{
      let body = ''; r.setEncoding('utf8'); r.on('data', chunk => body += chunk);
      r.on('end', () => console.log(JSON.stringify([r.statusCode, body])));
    }});
    request.setTimeout(5000, () => request.destroy(new Error('Request timeout')));
    request.on('error', () => process.exit(1));'''
    return json.loads(docker('exec', container, 'node', '--input-type=module', '-e', code))


with tempfile.TemporaryDirectory(prefix='tcg-bundle-') as directory:
    root = Path(directory)
    root.chmod(0o755)
    (root / 'server.mjs').write_text('''
import http from 'node:http';
import { spawn } from 'node:child_process';
const port = Number(process.env.PORT);
const child = spawn(process.execPath, ['-e', `
  process.on('SIGTERM', () => { console.log('child-stopped:${port}'); process.exit(0); });
  console.log('child-ready:${port}'); setInterval(() => {}, 1000);
`], { stdio: 'inherit' });
process.on('SIGTERM', () => { console.log('stopped:' + port); process.exit(0); });
let hang = false;
http.createServer((req, res) => {
  if (req.url === '/crash') process.exit(17);
  if (req.url === '/hang') { hang = true; res.end('hanging'); return; }
  if (req.url === '/recover') { hang = false; res.end('recovered'); return; }
  if (hang) return;
  res.statusCode = port === 3333 && req.url === '/' ? 404 : 200;
  res.end(String(port));
}).listen(port, '127.0.0.1');
''')
    files = {
        'app/node_modules/.bin/medusa': '#!/bin/sh\nexec node /fixtures/server.mjs\n',
        'cms/node_modules/.bin/strapi': '#!/bin/sh\nexec node /fixtures/server.mjs\n',
        'api/bin/server.js': "import '/fixtures/server.mjs';\n",
        'public-web/apps/public-web/server.js': "import '/fixtures/server.mjs';\n",
        'web/index.html': 'collector',
    }
    for name, content in files.items():
        target = root / name
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(content)
        target.chmod(0o755)
    (root / 'app/.medusa/server').mkdir(parents=True)

    for scenario in ['shutdown', 'crash-3000', 'crash-3333', 'crash-9000', 'crash-1337', 'crash-nginx', 'crash-redis']:
        args = ['run', '-d', '--network', 'none']
        for source, target in [('app', '/app'), ('api', '/srv/api'), ('cms', '/srv/cms'),
                               ('public-web', '/srv/public-web'), ('web', '/srv/web'), ('.', '/fixtures')]:
            args += ['--mount', f'type=bind,src={root / source},dst={target},readonly']
        for key, value in {
            'STOREFRONT_DOMAIN': 'shop.example.com', 'COLLECTOR_DOMAIN': 'collector.example.com',
            'API_DOMAIN': 'api.example.com', 'MEDUSA_DOMAIN': 'commerce.example.com',
            'CMS_DOMAIN': 'cms.example.com', 'BACKEND_REDIS_URL': 'redis://unused:6379',
        }.items():
            args += ['-e', f'{key}={value}']
        container = docker(*args, 'tcg-bundle-runtime:audit')
        try:
            eventually(lambda: all(f'child-ready:{port}' in docker('logs', container)
                                   for port in [3000, 3333, 9000, 1337]))
            eventually(lambda: fetch(container, '/healthz')[0] == 200)
            assert docker('exec', container, 'redis-cli', 'ping') == 'PONG'
            if scenario == 'shutdown':
                for host, body in [('shop.example.com', '3000'), ('api.example.com', '3333'),
                                   ('commerce.example.com', '9000'), ('cms.example.com', '1337'),
                                   ('collector.example.com', 'collector')]:
                    result = fetch(container, host=host)
                    assert result[1] == body, (host, result)
                fetch(container, '/hang', port=9000)
                assert fetch(container, '/healthz')[0] == 503, 'Hung app must fail readiness'
                fetch(container, '/recover', port=9000)
                assert fetch(container, '/healthz')[0] == 200, 'Recovered app must restore readiness'
                docker('stop', '--time', '10', container)
                assert docker('inspect', '-f', '{{.State.ExitCode}}', container) == '0'
            else:
                if scenario == 'crash-redis':
                    docker('exec', container, 'redis-cli', 'shutdown', 'nosave')
                elif scenario == 'crash-nginx':
                    docker('exec', container, 'sh', '-c', 'kill -TERM "$(cat /tmp/nginx.pid)"')
                else:
                    port = int(scenario.split('-')[1])
                    try:
                        fetch(container, '/crash', port=port)
                    except subprocess.CalledProcessError:
                        pass  # The fixture exits without responding.
                eventually(lambda: docker('inspect', '-f', '{{.State.Running}}', container) == 'false')
                assert docker('inspect', '-f', '{{.State.ExitCode}}', container) == '1'
            logs = docker('logs', container)
            for port in [3000, 3333, 9000, 1337]:
                assert f'child-stopped:{port}' in logs, f'Orphaned child after {scenario}: {port}'
            print(f'PASS {scenario}', flush=True)
        finally:
            docker('rm', '-f', container)

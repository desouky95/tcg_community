import { existsSync } from 'node:fs';
import { loadEnvFile } from 'node:process';

// Next workers inherit --import safely; --env-file is forbidden in NODE_OPTIONS.
const rootEnv = new URL('../../.env', import.meta.url);
if (existsSync(rootEnv)) loadEnvFile(rootEnv);

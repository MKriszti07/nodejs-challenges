import os from 'node:os';
import path from 'node:path';
import { rm } from 'node:fs/promises';

export function getDataDir(): string {
    return path.join(os.homedir(), '.focus-cli');
}

export async function resetAllData(): Promise<void> {
    // force: true => no error if ot doesn't exist
    // recursive: true => delete directory contents
    await rm(getDataDir(), { recursive: true, force: true });
}
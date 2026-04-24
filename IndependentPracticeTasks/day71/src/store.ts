import { mkdir, readFile, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

export type Priority = 'low' | 'med' | 'high';

export type Task = {
    id: string;
    text: string;
    createdAt: string;
    doneAt: string | null;
    today: boolean;
    priority: Priority;
};

export type StoreShape = {
    version: 1;
    tasks: Task[];
};

const DEFAULT_STORE: StoreShape = { version: 1, tasks: [] };

export function getStorePath(): string {
    const dir = path.join(os.homedir(), '.focus-cli');
    return path.join(dir, 'tasks.json');
}

async function ensureDirForFile(filePath: string) {
    await mkdir(path.dirname(filePath), { recursive: true });
}

export async function readStore(): Promise<StoreShape> {
    const filePath = getStorePath();
    await ensureDirForFile(filePath);

    try {
        const raw = await readFile(filePath, 'utf8');
        const parsed = JSON.parse(raw) as StoreShape;

        // minimal validation / migration hook
        if (!parsed || parsed.version !== 1 || !Array.isArray(parsed.tasks)) {
            return DEFAULT_STORE;
        }
        return parsed;
    } catch (err: any) {
        if (err?.code === 'ENOENT') return DEFAULT_STORE;
        // If file exists but is invalid JSON, don't crash: reset.
        return DEFAULT_STORE;
    }
}

export async function writeStore(store: StoreShape): Promise<void> {
    const filePath = getStorePath();
    await ensureDirForFile(filePath);
    await writeFile(filePath, JSON.stringify(store, null, 2) + '\n', 'utf8');
}
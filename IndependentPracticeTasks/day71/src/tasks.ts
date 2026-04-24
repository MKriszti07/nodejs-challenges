import { readStore, writeStore, type Priority, type Task } from './store.js';

function makeId(): string {
    // short, readable id (not crypto-secure, good enough for local CLI)
    return Math.random().toString(36).slice(2, 8);
}

function nowIso(): string {
    return new Date().toISOString();
}

export async function addTask(input: {
    text: string;
    today?: boolean;
    priority?: Priority;
}) : Promise<Task> {
    const store = await readStore();

    const task: Task = {
        id: makeId(),
        text: input.text.trim(),
        createdAt: nowIso(),
        doneAt: null,
        today: Boolean(input.today),
        priority: input.priority || 'med',
    };

    store.tasks.unshift(task);
    await writeStore(store);
    return task;
}

export async function listTasks(filter: {
    all?: boolean;
    today?: boolean;
    done?: boolean;
    pending?: boolean;
}) : Promise<Task[]> {
    const store = await readStore();
    let tasks = [...store.tasks];

    if (filter.today) tasks = tasks.filter((t) => t.today);

    const wantsDone = Boolean(filter.done);
    const wantsPending = Boolean(filter.pending);
    const wantsAll = Boolean(filter.all);

    // Default behavior: pending only
    if (!wantsAll && !wantsDone && !wantsPending) {
        tasks = tasks.filter((t) => t.doneAt === null);
        return tasks;
    }

    if (wantsAll) return tasks;

    if (wantsDone && !wantsPending) return tasks.filter((t) => t.doneAt !== null);
    if (wantsPending && !wantsDone) return tasks.filter((t) => t.doneAt === null);

    // both done + pending => effectively all
    return tasks;
}

export async function markDone(id: string): Promise<Task> {
    const store = await readStore();
    const task = store.tasks.find((t) => t.id === id);
    if (!task) throw new Error(`No task found with id '${id}'.`);

    if (task.doneAt) return task; // idempotent
    task.doneAt = nowIso();

    await writeStore(store);
    return task;
}

export async function removeTask(id: string): Promise<Task> {
    const store = await readStore();
    const idx = store.tasks.findIndex((t) => t.id === id);
    if (idx === -1) throw new Error(`No task found with id '${id}'.`);

    const [removed] = store.tasks.splice(idx, 1);
    await writeStore(store);
    return removed;
}

export async function clearDone(): Promise<number> {
    const store = await readStore();
    const before = store.tasks.length;
    store.tasks = store.tasks.filter((t) => t.doneAt === null);
    const removed = before - store.tasks.length;

    await writeStore(store);
    return removed;
}

export async function getTodayView(): Promise<{
    pending: Task[];
    done: Task[];
}> {
    const tasks = await listTasks({ today: true, all: true });
    return {
        pending: tasks.filter((t) => t.doneAt === null),
        done: tasks.filter((t) => t.doneAt !== null)
    };
}
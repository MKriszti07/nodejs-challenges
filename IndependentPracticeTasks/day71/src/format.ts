import pc from 'picocolors';
import type { Task } from './store.js';

function prioLabel(p: Task['priority']): string {
    if (p === 'high') return pc.red('HIGH');
    if (p === 'med') return pc.yellow('MED ');
    return pc.green('LOW ');
}

function todayBadge(t: boolean): string {
    return t ? pc.cyan('[today]') : '       ';
}

export function formatTaskLine(t: Task): string {
    const status = t.doneAt ? pc.dim('✓') : pc.bold('•');
    const id = pc.dim(t.id);
    const pr = prioLabel(t.priority);
    const tb = todayBadge(t.today);

    const text = t.doneAt ? pc.dim(t.text) : t.text;
    return `${status} ${id}  ${pr} ${tb}  ${text}`;
}

export function printTaskList(tasks: Task[], title?: string): void {
    if (title) console.log(pc.bold(title));
    if (tasks.length === 0) {
        console.log(pc.dim('(empty)'));
        return;
    }
    for (const t of tasks) console.log(formatTaskLine(t));
}
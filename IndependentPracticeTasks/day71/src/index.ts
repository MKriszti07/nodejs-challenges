#!/usr/bin/env node
import { Command } from 'commander';
import pc from 'picocolors';
import {
    addTask,
    clearDone,
    getTodayView,
    listTasks,
    markDone,
    removeTask,
} from './tasks.js';
import { printTaskList } from './format.js';
import { getStorePath, type Priority } from './store.js';
import { resetAllData } from './reset.js';

const program = new Command();

program
    .name('focus')
    .description('A tiny daily-focus task CLI (local JSON storage).')
    .version('1.0.0');

program
    .command('add')
    .description('Add a task')
    .argument('<text>', 'task text (wrap in quotes)')
    .option('--today', 'tag task for today')
    .option('--priority <priority>', 'low|med|high', 'med')
    .action(async (text: string, opts: { today?: boolean; priority: string }) => {
        const p = opts.priority as Priority;
        if (!['low', 'med', 'high'].includes(p)) {
            console.error(pc.red(`Invalid --priority '${opts.priority}'. Use low|med|high.`));
            process.exitCode = 1;
            return;
        }

        const task = await addTask({ text, today: opts.today, priority: p });
        console.log(pc.green('Added:'));
        printTaskList([task]);
    });

program
    .command('list')
    .description('List tasks')
    .option('--all', 'show all tasks')
    .option('--today', 'only tasks tagged for today')
    .option('--done', 'only completed tasks')
    .option('--pending', 'only pending tasks')
    .action(async (opts: any) => {
        const tasks = await listTasks({
            all: opts.all,
            today: opts.today,
            done: opts.done,
            pending: opts.pending,
        });

        const flags = [
            opts.today ? 'today' : null,
            opts.all ? 'all' : null,
            opts.done ? 'done' : null,
            opts.pending ? 'pending' : null, 
        ]
            .filter(Boolean)
            .join(', ') || 'default';

        printTaskList(tasks, flags ? `Tasks (${flags})` : 'Tasks');
    });

program
    .command('done')
    .description('Mark a task as done')
    .argument('<id>', 'task id')
    .action(async (id: string) => {
        try {
            const task = await markDone(id);
            console.log(pc.green('Completed:'));
            printTaskList([task]);
        } catch (e: any) {
            console.error(pc.red(e?.message ?? String(e)));
            process.exitCode = 1;
        }
    });

program
    .command('rm')
    .description('Remove a task')
    .argument('<id>', 'task id')
    .action(async (id: string) => {
        try {
            const task = await removeTask(id);
            console.log(pc.yellow('Removed:'));
            printTaskList([task]);
        } catch (e: any) {
            console.error(pc.red(e?.message ?? String(e)));
            process.exitCode = 1
        }
    });

program
    .command('today')
    .description('Show today view (pending + done)')
    .action(async () => {
        const view = await getTodayView();
        printTaskList(view.pending, 'Today - Pending');
        console.log();
        printTaskList(view.done, 'Today - Done');
    });

program
    .command('clear')
    .description('Clear tasks (safety flags required)')
    .option('--done', 'remove completed tasks')
    .action(async (opts: { done?: boolean }) => {
        if (!opts.done) {
            console.error(pc.red('Refusing. Use: focus clear --done'));
            process.exitCode = 1;
            return;
        }
        const removed = await clearDone();
        console.log(pc.yellow(`Removed ${removed} done task(s).`));
    });

program
    .command('path')
    .description('Print the JSON storage file path')
    .action(() => {
        console.log(getStorePath());
    });

program
    .command('reset')
    .description('Delete all local focus-cli data (~/.focus-cli)')
    .option('--yes', 'skip confirmation propmt')
    .action(async (opts: { yes?: boolean}) => {
        if (!opts.yes) {
            console.error('Refusing. Run: focus reset --yes');
            process.exitCode = 1;
            return;
        }
        await resetAllData();
        console.log('All local data removed.');
    });

program.showHelpAfterError(true);

program.parseAsync(process.argv).catch((e) => {
    console.error(pc.red(e?.message ?? String(e)));
    process.exitCode = 1;
});
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * In a real app this would be:
 * - DB query
 * - REST call
 * - GraphQL call
 *
 * For practice, we simulate latency and keep data in-memory.
 */
const TODOS = [
    { id: '1', title: 'Learn SSR basics', done: false, description: 'Render React on the server via Express.' },
    { id: '2', title: 'Add routes', done: true, description: 'Home + detail + 404 page.' },
    { id: '3', title: 'Pass initial', done: false, description: 'Serialize data into HTML safely.' },
    { id: '4', title: 'Handle errors', done: false, description: 'Show a friendly server-rendered error page.' },
];

export async function listTodos() {
    await sleep(120);
    // return a copy (avoid accidental mutations)
    return TODOS.map((t) => ({ ...t }));
}

export async function getTodoById(id) {
    await sleep(120);
    const todo = TODOS.find((t) => t.id === id);
    return todo ? { ...todo } : null;
}
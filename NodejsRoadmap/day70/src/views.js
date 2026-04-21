import React from 'react';

function Layout({ title, children }) {
    return React.createElement(
        'div',
        { style: { fontFamily: 'system-ui, sans-serif', maxWidth: 860, margin: '40px auto', padding: '0 16px' } },
        React.createElement('header', { style: { marginBottom: 24 } }, [
            React.createElement('h1', { key: 'h', style: { margin: 0 } }, title),
            React.createElement(
                'nav',
                { key: 'n', style: { marginTop: 8 } },
                React.createElement('a', { href: '/' }, 'Home')
            )
        ]),
        React.createElement('main', null, children),
        React.createElement(
            'footer',
            { style: { marginToop: 40, fontSize: 12, opacity: 0.7 } },
            'Day 70 - SSR with Express'
        )
    );
}

export function HomePage({ todos }) {
    return React.createElement(
        Layout,
        { title: 'Todos (SSR)' },
        React.createElement(
            React.Fragment,
            null,
            React.createElement('p', null, 'This page is rendered on the server using ReactDomServer.'),
            React.createElement(
                'ul',
                { style: { paddingLeft: 18 } },
                todos.map((t) => 
                    React.createElement(
                        'li',
                        { key: t.id, style: { margin: '8px 0' } },
                        React.createElement(
                            'a',
                            { href: `/todos/${t.id}` },
                            `${t.done ? "✅" : "⬜"} ${t.title}`
                        )
                    )
                )
            )
        )
    );
}

export function TodoPage({ todo }) {
    return React.createElement(
        Layout,
        { title: `Todo #${todo.id}` },
        React.createElement(
            'article',
            { style: { border: '1px solid #ddd', borderRadius: 10, padding: 16 } },
            [
                React.createElement('h2', { key: 'h2', style: { marginTop: 0 } }, todo.title),
                React.createElement('p', {key: 'p1' }, React.createElement('strong', null, 'Status: '), todo.done ? 'Done' : 'Not done'),
                React.createElement('p', { key: 'p2' }, todo.description),
                React.createElement('p', { key: 'p3' }, React.createElement('a', { href: '/' }, '← Back'))
            ]
        )
    );
}

export function NotFoundPage({ path }) {
    return React.createElement(
        Layout,
        { title: '404 Not Found' },
        React.createElement(
            'div',
            null,
            [
                React.createElement('p', { key: 'p' }, `No route matches: ${path}`),
                React.createElement('a', { key: 'a', href: '/' }, 'Go home')
            ]
        )
    );
}

export function ErrorPage({ message }) {
    return React.createElement(
        Layout,
        { title: 'Something went wrong' },
        React.createElement('pre', { style: { background: '#111', color: '#eee', padding: 16, borderRadius: 10, overflow: 'auto' } }, message)
    );
}
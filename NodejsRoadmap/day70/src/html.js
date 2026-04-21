/**
 * Minimal safe serializer to embed JSON in HTML.
 * Prevents accidentally closing the script tag and a couple common injection vectors.
 */
export function serializeForScriptTag(obj) {
  return JSON.stringify(obj)
    .replace("<", "\\u003c")
    .replace(">", "\\u003e")
    .replace("&", "\\u0026");
}

export function htmlShell({ title, appHtml, initialState }) {
  const state = serializeForScriptTag(initialState ?? {});
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
  </head>
  <body>
    <div id="app">${appHtml}</div>

    <script>
      // Exposed for debugging / future hydration
      window.__INITIAL_STATE__ = ${state};
    </script>
  </body>
</html>`;
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

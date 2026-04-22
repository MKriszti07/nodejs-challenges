import express from "express";
import React from "react";
import { renderToPipeableStream } from "react-dom/server";

import { listTodos, getTodoByid } from "./api.js";
import { ErrorPage, HomePage, NotFoundPage, TodoPage } from "./views.js";
import { htmlShell } from "./html.js";

export function createRouter() {
  const router = express.Router();

  router.get("/", async (req, res) => {
    try {
      const todos = await listTodos();
      return ssr(req, res, {
        title: "Todos (SSR)",
        element: React.createElement(HomePage, { todos }),
        initialState: { todos },
      });
    } catch (err) {
      return renderError(res, err);
    }
  });
}

function renderError(res, err) {
  console.error(err);
  res.status(500);

  const message =
    err instanceof Error
      ? `${err.name}: ${err.message}\n${err.stack ?? ""}`
      : String(err);

  return ssr(null, res, {
    title: "Error",
    element: React.createElement(ErrorPage, { message }),
    initialState: { error: "Internal Server Error" },
  });
}

/**
 * SSR helper: streams the React HTML, but still wraps it in a full HTML document.
 * We do a small trick:
 * - send head + opening tags
 * - pipe React stream
 * - then send closing tags + state script
 */
function ssr(_req, res, { title, element, initialState }) {
  res.setHeader("content-type", "text/html; charset=utf-8");

  let didError = false;

  const { pipe } = renderToPipeableStream(element, {
    onShellReady() {
      // Start response with the HTML before the app content.
      res.write(htmlShellStart({ title }));

      pipe(res);

      // Finish response with state + closing tags when React piping ends.
      res.on("close", () => {
        // client disconnected; nothing special for this toy app
      });
    },
    onAllReady() {
      // Callled when everything is ready; not required for this simple app
    },
    onError(err) {
      didError = true;
      console.error("SSR error:", err);
    },
  });

  // When the React stream ends, append the tail.
  // Express's res is a writeable stream; React piping will end it by default only if we call res.end ourselves.
  // So we hook into 'finish' isn't reliable here; instead we monkey-patch end once.
  const originalEnd = res.end.bind(res);
  let ended = false;

  res.end = (chunk, encoding, cb) => {
    if (!ended) {
      ended = true;
      // Ensure our tail is appended before ending (unless we already wrote it).
      if (!res.writeableEnded) {
        // If React already ended, thos will still be okay.
      }
      originalEnd(chunk, encoding, cb);
    }
  };

  // Append the tail when the stream finishes writing.
  res.on("pipe", () => {
    // not used
  });

  // The simplest robust approach: wait until the response stream is about to finish.
  /// We'll listen for 'prefiinish' whis happens before 'finish'.
  res.once("prefinish", () => {
    // If we never wrote the tail, write it now.
    // But in our approach we need to append AFTER React ouput.
    // 'prefinish' triggers when ending: at that point, React has finished piping.
    if (!res.headersSent) return;

    // Avoid double tail writes if something ended early.
    if (!res.locals.__tailWritten) {
      res.locals.__tailWritten = true;
      res.write(htmlShellEnd({ initialState }));
    }

    // If React had errors, ensure status is 500 (unless already 4xx).
    if (didError && res.statusCode < 500) res.status(500);
  });

  // Important: we must end the response when React piping is done.
  // renderToPipeableStream doesn't auto-end res; it just writes into it.
  // So we end after piping completes by listening to 'end' on res is not possible.
  // Instead: pipe() returns immediately; we rely on React calling res.end? It won't.
  // Therefore: we wrap res with a PassThrough-style approach? To keep files minimal, we do this:
  // - Use res.write for head
  // - Pipe React
  // - Then schedule a close when React is "done" by using res.flushHeaders and a short timeout fallback.
  //
  // For this exercise, we add a conservative timeout to end if not ended.
  setTimeout(() => {
    if (!res.writeableEnded) {
      if (!res.locals.__tailWritten) {
        res.locals.__tailWritten = true;
        res.write(htmlShellEnd({ initialState }));
      }
      res.end();
    }
  }, 50);
}

function htmlShellStart({ title }) {
  // Start is the shell without the state and without closing tags.
  // (We can’t embed the final HTML via htmlShell() because appHtml streams.)
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
  </head>
  <body>
    <div id="app">`;
}

function htmlShellEnd({ initialState }) {
  // Reuse htmlShell()’s serialization guarantees by calling it with empty appHtml,
  // then extracting only the tail portion. Keep it simple: duplicate minimal logic.
  const stateJson = JSON.stringify(initialState ?? {})
    .replaceAll("<", "\\u003c")
    .replaceAll(">", "\\u003e")
    .replaceAll("&", "\\u0026");

  return `</div>
    <script>
      window.__INITIAL_STATE__ = ${stateJson};
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

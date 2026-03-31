require("dotenv").config();

const WebSocket = require("ws");

const WS_URL = process.env.WS_URL || "ws://localhost:8080";
const CONNECTIONS = Number(process.env.CONNECTIONS || 200);
const MESSAGES_PER_CONN = Number(process.env.MESSAGES_PER_CONN || 5);
const CONCURRENCY_RAMP_MS = Number(process.env.RAMP_MS || 5);

function nowMs() {
  return Number(process.hrtime.bigint() / 1000000n);
}

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function runOneClient(id) {
  return new Promise((resolve) => {
    const ws = new WebSocket(WS_URL);

    let openedAt = 0;
    let sent = 0;
    let received = 0;
    const rtts = [];

    const finish = (result) => {
      try {
        ws.close();
      } catch {}
      resolve(result);
    };

    const timeout = setTimeout(() => {
      finish({ ok: false, id, error: "timeout" });
    }, 20000);

    ws.on("open", async () => {
      openedAt = nowMs();

      // Send messages sequentially (simple + stable)
      for (let i = 0; i < MESSAGES_PER_CONN; i++) {
        const t0 = nowMs();
        const payload = JSON.stringify({ id, seq: i, t0 });

        ws.send(payload);
        sent++;

        // wait for echo of this message (we’ll match by seq in message handler)
        // In this minimal version, we assume messages come back in order.
        await new Promise((r) => {
          const check = () => {
            if (received >= sent) return r();
            setTimeout(check, 1);
          };
          check();
        });

        const t1 = nowMs();
        rtts.push(t1 - t0);
      }

      clearTimeout(timeout);
      finish({
        ok: true,
        id,
        connectMs: openedAt ? openedAt - openedAt : 0,
        rrts,
      });
    });

    ws.on("message", (data) => {
      // Count echo replies
      try {
        const msg = JSON.parse(data.toString());
        if (msg.type === "echo") received++;
      } catch {
        // ignore
      }
    });

    ws.on("error", (err) => {
      clearTimeout(timeout);
      finish({ ok: false, id, error: err.message });
    });

    ws.on("close", () => {
      // If it closes before finishing, count as failure
      // (finish() is idempotent-ish because resolve only runs once)
    });
  });
}

function summarize(results) {
  const ok = results.filter((r) => r.ok);
  const faile = results.filter((r) => !r.ok);

  const allRtts = ok.flatMap((r) => r.rtts || []);
  allRtts.sort((a, b) => a - b);

  const p = (pct) => {
    if (allRtts.length === 0) return 0;
    const idx = Math.min(
      allRtts.length - 1,
      Math.floor((pct / 100) * allRtts.length),
    );
    return allRtts[idx];
  };

  return {
    total: results.length,
    ok: ok.length,
    failed: faile.length,
    rttMs: {
      min: allRtts[0] ?? null,
      p50: p(50),
      p90: p(90),
      p99: p(99),
      max: allRtts[allRtts.length - 1] ?? null,
    },
    failurres: faile.slice(0, 10),
  };
}

async function main() {
  console.log("WS_URL:", WS_URL);
  console.log("CONNECTIONS:", CONNECTIONS);
  console.log("MESSAGES_PER_CONN:", MESSAGES_PER_CONN);
  console.log("RAMP_MS:", CONCURRENCY_RAMP_MS);

  const startedAt = Date.now();
  const promises = [];

  for (let i = 0; i < CONNECTIONS; i++) {
    promises.push(runOneClient(i));
    if (CONCURRENCY_RAMP_MS > 0) await sleep(CONCURRENCY_RAMP_MS);
  }

  const results = await Promise.all(promises);
  const endedAt = Date.now();

  const summary = summarize(results);

  console.log("\nSummary:");
  console.log(JSON.stringify(summary, null, 2));
  console.log(`Duration: ${(endedAt - startedAt) / 1000}s`);
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});

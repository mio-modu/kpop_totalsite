/**
 * Why a request failed, when curl cannot say.
 *
 * This container reaches the internet through an egress proxy with an
 * allowlist. When a request does not get out, `curl` reports `000` and an
 * empty body, and that single value covers three completely different
 * situations:
 *
 *   - the proxy refused the host, because it is not on the allowlist
 *   - the proxy allowed it and could not reach it
 *   - the connection was established and then dropped mid-exchange
 *
 * Only the first is ours to fix, and it is the one that looks most like a
 * dead link. `scripts/watch.mjs` reported all three as `✗ … A guide cites
 * this`, which is how two separate things sat in the handoff for weeks as
 * blocked sources:
 *
 *   - `www.kogl.or.kr`, the 공공누리 licence page the Gocheok chart is
 *     reproduced under, was simply missing from the allowlist field after a
 *     partial paste. The report said the citation was dead. The citation was
 *     fine; our configuration was not.
 *   - `www.inspirekorea.com` was recorded as waiting on that same paste, and
 *     a paste could never have helped it: the proxy was permitting it and
 *     failing to reach it, because the domain had stopped resolving.
 *
 * The proxy knows which of the three happened and keeps the verdict. Nothing
 * asked it. This module asks.
 *
 * It is a separate file so the classification can be tested without running
 * the weekly sweep — `scripts/watch.mjs` does its work at import time, and
 * the precedent for a script exporting a pure function to the suite is
 * `subset-fonts.mjs`.
 */

/**
 * What the proxy's `detail` string means, read from the status code and not
 * from the prose.
 *
 * The prose is the trap. A policy denial and an upstream failure arrive with
 * the *same* parenthetical — `(policy denial or upstream failure)` — because
 * the proxy is describing the two things its own caller cannot distinguish.
 * The number in front of it is the part that decides, so a classifier that
 * matched on the words would call every failure the same thing and rebuild
 * the problem this module exists to solve. `scripts/relay.test.mjs` holds
 * both strings for exactly that reason.
 */
export function classifyRelayFailure(detail) {
  const text = String(detail ?? "");

  // `tunnel closed (code 1006) after 13s` — the tunnel was up and the
  // exchange did not finish. The host answered something, so the allowlist is
  // not the question and neither is DNS.
  if (/tunnel closed|ws_closed_mid_exchange/i.test(text)) return "dropped";

  const answered = text.match(/answered\s+(\d{3})\s+to\s+CONNECT/i);
  if (answered) {
    const code = Number(answered[1]);
    // 403 is the policy refusing the host. Ours, and fixable: the host is
    // missing from the allowlist field, which `npm run hosts` prints whole.
    if (code === 403) return "policy";
    // Anything else the gateway answered to CONNECT means it accepted the
    // host and the fetch failed anyway — a 502 for a domain that no longer
    // resolves, a 503 whose body is the proxy's own `upstream connect error`.
    // Not fixable by a paste.
    return "upstream";
  }

  return "unknown";
}

/**
 * The proxy's most recent verdict for one host, from an already-parsed status
 * document.
 *
 * Pure on purpose: the fetch is separate so the matching can be tested
 * against a fixture.
 *
 * The status document lists hosts as `host:port`, and a caller holds a bare
 * hostname, so the port is stripped before comparing rather than appended —
 * a host can appear on more than one port and the verdict is the same either
 * way. `recentRelayFailures` runs oldest to newest, so the last match wins:
 * a host that was denied and is now permitted should read as permitted, which
 * is precisely the state a fresh allowlist paste produces.
 */
export function relayVerdict(host, status) {
  const failures = status?.recentRelayFailures;
  if (!Array.isArray(failures)) return null;

  let found = null;
  for (const f of failures) {
    const name = String(f?.host ?? "").replace(/:\d+$/, "");
    if (name && name === host) found = f;
  }
  if (!found) return null;

  const detail = String(found.detail ?? "");
  return { class: classifyRelayFailure(detail), detail, kind: found.kind ?? "" };
}

/**
 * The proxy's status document, or `null` where there is no proxy.
 *
 * This is the one part that must degrade silently, because the weekly sweep
 * runs in two places: this container, which is proxied, and a GitHub runner,
 * which is not. On the runner there is no `HTTPS_PROXY` and no status
 * endpoint, and a `000` there means what it has always meant. So every
 * failure path returns `null` and the caller falls back to the message it
 * printed before this module existed.
 *
 * That is deliberately *not* the two-code-path mistake this repository has
 * already written down about `watch.mjs` — where a local run used curl and
 * CI used node's `fetch`, so the path a change was written against was never
 * the path CI ran. The request itself still goes through one implementation.
 * This only adds an explanation where one is available, and the explanation
 * is never required for the check to work.
 */
export async function fetchRelayStatus(env = process.env) {
  const proxy = env.HTTPS_PROXY || env.https_proxy;
  if (!proxy) return null;

  try {
    const { execFile } = await import("node:child_process");
    const { promisify } = await import("node:util");
    const { stdout } = await promisify(execFile)(
      "curl",
      // `--noproxy "*"` because this URL is served *by* the proxy: routing it
      // through the proxy is what asking a gateway to CONNECT to itself looks
      // like. Short timeout — this is diagnostics, and the sweep must not
      // hang on it.
      ["-sS", "--noproxy", "*", "--max-time", "5", `${proxy.replace(/\/+$/, "")}/__agentproxy/status`],
      { maxBuffer: 4_000_000 },
    );
    return JSON.parse(stdout);
  } catch {
    return null;
  }
}

/**
 * The line the weekly report should print for a host that did not answer.
 *
 * Returns `null` when there is nothing better to say than the old message,
 * which keeps the fallback in one place.
 *
 * The levels are chosen by who has to act, not by how bad it looks:
 *
 *   - `policy` is a **fail**. It is our allowlist, it is actionable in one
 *     paste, and it says so. It stays loud because a missing host silently
 *     turns a cited source into a dead one in the report — and because the
 *     field *replaces* on edit, so this is how hosts go dark three at a time.
 *   - `upstream` and `dropped` are a **warn**. A reader with a browser may
 *     well be able to open the page; nothing here can tell. Calling that a
 *     dead citation is the false alarm this repository already paid for once
 *     with `korea.net`, and a permanent false alarm teaches everyone to skip
 *     the line.
 */
export function relayFinding(url, host, verdict) {
  if (!verdict) return null;

  if (verdict.class === "policy") {
    return {
      level: "fail",
      msg:
        `${url} — the proxy refused ${host}: it is not on this environment's allowlist. ` +
        `A guide cites it, so the citation is probably fine and our configuration is not. ` +
        `Run \`npm run hosts\` and paste the whole block, because editing that field replaces it.`,
    };
  }

  if (verdict.class === "upstream") {
    return {
      level: "warn",
      msg:
        `${url} — ${host} is allowed and could not be reached (${verdict.detail}). ` +
        `Not an allowlist problem and not necessarily a dead page: check it in a browser before re-sourcing.`,
    };
  }

  if (verdict.class === "dropped") {
    return {
      level: "warn",
      msg:
        `${url} — ${host} answered and then dropped the connection (${verdict.detail}). ` +
        `The host is reachable, so this is the site rather than the allowlist. Check it in a browser.`,
    };
  }

  return null;
}

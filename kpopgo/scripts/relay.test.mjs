/**
 * The proxy's verdict, and the three failures `000` hides.
 *
 *   node --test "scripts/*.test.mjs"
 *
 * `scripts/watch.mjs` used to print one line for every request that did not
 * get out — `✗ … A guide cites this` — and that line was wrong about two
 * things at once for weeks. `www.kogl.or.kr`, the licence page the Gocheok
 * chart is reproduced under, was missing from the allowlist after a partial
 * paste, and the report called its citation dead. `www.inspirekorea.com` was
 * recorded as waiting on that same paste, which could never have helped it,
 * because the proxy was permitting the host and failing to resolve it.
 *
 * So the classification is worth asserting rather than eyeballing, and the
 * strings below are the real ones, copied from a live status document on
 * 22 October 2026.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  classifyRelayFailure,
  relayVerdict,
  relayFinding,
  fetchRelayStatus,
} from "./relay.mjs";

/**
 * The two strings that matter most are these first two, and they are why a
 * classifier cannot read the prose: a policy denial and an upstream failure
 * carry the *same* parenthetical and differ only in the number.
 */
const DENIED = "gateway answered 403 to CONNECT (policy denial or upstream failure)";
const UPSTREAM = "gateway answered 502 to CONNECT (policy denial or upstream failure)";
const DROPPED = "tunnel closed (code 1006) after 13s; 517 B sent";

test("a 403 to CONNECT is the policy refusing the host", () => {
  assert.equal(classifyRelayFailure(DENIED), "policy");
});

test("a 502 to CONNECT is the policy allowing it and the fetch failing", () => {
  assert.equal(classifyRelayFailure(UPSTREAM), "upstream");
});

test("the two are told apart by the code and not by the prose", () => {
  // Both carry "(policy denial or upstream failure)". A classifier matching
  // on those words would call them the same thing and rebuild the bug.
  const shared = "(policy denial or upstream failure)";
  assert.ok(DENIED.includes(shared) && UPSTREAM.includes(shared));
  assert.notEqual(classifyRelayFailure(DENIED), classifyRelayFailure(UPSTREAM));
});

test("a 503 to CONNECT is an upstream failure too, not a site's own 503", () => {
  // circlechart.kr answers this over plain HTTP, and the body is the proxy's
  // own `upstream connect error … connection timeout` rather than anything
  // the site wrote. Reading it as the site's status would be a third wrong
  // diagnosis of the same host.
  assert.equal(
    classifyRelayFailure("gateway answered 503 to CONNECT (policy denial or upstream failure)"),
    "upstream",
  );
});

test("a closed tunnel is the site, by either name the proxy uses", () => {
  assert.equal(classifyRelayFailure(DROPPED), "dropped");
  assert.equal(classifyRelayFailure("ws_closed_mid_exchange"), "dropped");
});

test("anything unrecognised classifies as unknown rather than guessing", () => {
  for (const d of ["", null, undefined, "something new the proxy started saying"]) {
    assert.equal(classifyRelayFailure(d), "unknown");
  }
});

test("a verdict is matched on the host with its port stripped", () => {
  const status = { recentRelayFailures: [{ host: "www.kogl.or.kr:443", detail: DENIED }] };
  assert.equal(relayVerdict("www.kogl.or.kr", status)?.class, "policy");
});

test("the newest verdict for a host wins, so a fixed allowlist reads as fixed", () => {
  // recentRelayFailures runs oldest to newest. A host denied earlier in the
  // run and reached later must not keep reporting as denied — that is exactly
  // the state a fresh paste produces, and the whole point of asking.
  const status = {
    recentRelayFailures: [
      { host: "www.ksponco.or.kr:443", detail: DENIED },
      { host: "www.ksponco.or.kr:443", detail: DROPPED },
    ],
  };
  assert.equal(relayVerdict("www.ksponco.or.kr", status)?.class, "dropped");
});

test("a host with no recorded failure, and a status with none, give no verdict", () => {
  const status = { recentRelayFailures: [{ host: "other.example:443", detail: DENIED }] };
  assert.equal(relayVerdict("www.kogl.or.kr", status), null);
  assert.equal(relayVerdict("www.kogl.or.kr", {}), null);
  assert.equal(relayVerdict("www.kogl.or.kr", null), null);
  // A near-miss must not match: a suffix is a different host.
  assert.equal(relayVerdict("kogl.or.kr", { recentRelayFailures: [{ host: "www.kogl.or.kr:443", detail: DENIED }] }), null);
});

test("a denied host is a fail, and the message says it is ours to fix", () => {
  const f = relayFinding("https://www.kogl.or.kr/x", "www.kogl.or.kr", {
    class: "policy",
    detail: DENIED,
  });
  assert.equal(f.level, "fail");
  assert.match(f.msg, /allowlist/);
  // The one instruction that has to survive: editing the field replaces it,
  // which is how hosts have gone dark here three times.
  assert.match(f.msg, /npm run hosts/);
  assert.match(f.msg, /replaces it/);
});

test("an unreachable host is a warn that sends somebody to a browser", () => {
  for (const cls of ["upstream", "dropped"]) {
    const f = relayFinding("https://x.example/y", "x.example", { class: cls, detail: "d" });
    assert.equal(f.level, "warn", cls);
    assert.match(f.msg, /browser/, cls);
    // The regression to guard is the old alarm coming back: `A guide cites
    // this` is the line that made these indistinguishable from a dead link.
    // Asserting the word "dead" is absent would be wrong — the upstream
    // message earns its use of it, in "not necessarily a dead page".
    assert.doesNotMatch(f.msg, /A guide cites this/, cls);
  }
});

test("no verdict and an unknown verdict both fall back to the old message", () => {
  // `watch.mjs` prints its original line whenever this returns null, so null
  // is the contract that keeps the GitHub runner's behaviour unchanged.
  assert.equal(relayFinding("https://x.example/", "x.example", null), null);
  assert.equal(
    relayFinding("https://x.example/", "x.example", { class: "unknown", detail: "?" }),
    null,
  );
});

test("with no proxy configured the status fetch is skipped, not attempted", async () => {
  // The sweep runs here behind a proxy and on a GitHub runner without one.
  // On the runner there is nothing to ask, and asking must not cost the run
  // a timeout — so an absent HTTPS_PROXY returns null without a subprocess.
  assert.equal(await fetchRelayStatus({}), null);
});

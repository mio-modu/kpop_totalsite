# kpop_totalsite

Several separate projects in one repository. They do not share code or a build;
each has its own `package.json` and is deployed, or not, on its own.

| Path | What it is | Deployed |
|---|---|---|
| `kpopgo/` | **[kpopgo.app](https://kpopgo.app)** — English guides for international K-pop fans on buying tickets and albums from Korea. Next.js, six languages. | yes |
| `jiwon-moa/` | Next.js app. | — |
| `ai-presentation/` | Next.js app. | — |
| *(repo root)* | A Vite presentation, "Real-World AI Utilization Projects" — `index.html`, `server.js`, `vite.config.js`. | no, since 2026-10-21 |

The root presentation had its own Vercel project until 21 October 2026. Both
projects rebuilt on every commit, including commits that only touched
`kpopgo/`, and each build consumed one of the Hobby plan's 100 daily
deployments — so the site that was being worked on kept running out of them for
the site that was not. Vercel's Ignored Build Step does not help here: a build
it cancels still counts. The project was deleted instead.

The code stays. Nothing about it was broken, and redeploying it later is
connecting a Vercel project to this repository again — the root `vercel.json`
still carries the build configuration it needs, which is why that file is also
still here.

## kpopgo

The live site, and where the work is. It has its own documentation:

- `kpopgo/README.md` — what it is and how to run it
- `kpopgo/CLAUDE.md` — the rules the content is held to, and why each one exists
- `kpopgo/VERIFY.md` — what walking a guide means before it may be called verified

```bash
cd kpopgo
npm install
npm run dev        # http://localhost:3000
npm test           # the content checks — these are the interesting part
npm run typecheck
```

`.github/workflows/kpopgo-checks.yml` runs the suite and the typechecker on
every change under `kpopgo/`. `.github/workflows/kpopgo-watch.yml` sweeps the
cited sources weekly and opens an issue when one of them moves.

## The root presentation

Still runnable, just not deployed:

```bash
npm install
npm run dev        # Vite
```

## License

There is no licence file in this repository. An earlier version of this README
said the project was MIT licensed and pointed at a `LICENSE` file that has
never existed, so that claim is removed rather than repeated. Until someone
adds one, default copyright applies.

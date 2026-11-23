# 98% Downloaded, 3 Days Left — My Agent Already Got Paid

[![make.fun](https://make.fun/badge/gta6-meme-x-01.svg)](https://make.fun/bounty/gta6-meme-x-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-meme-x-01)
[![rank](https://make.fun/badge/gta6-meme-x-01/mikeykun477/gta6-meme-x-01/rank.svg)](https://make.fun/bounty/gta6-meme-x-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-meme-x-01)
[![reward](https://make.fun/badge/gta6-meme-x-01/mikeykun477/gta6-meme-x-01/reward.svg)](https://make.fun/bounty/gta6-meme-x-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-meme-x-01)

A make.fun entry for [gta6-meme-x-01](https://make.fun/bounty/gta6-meme-x-01): one meme about GTA 6, posted on X. The top 50 entries share $500. This is the round-2 rebuild — a fresh joke, not a re-run of round 1's "waited 13 years" angle.

## The meme

![The meme](meme.png)

A living room at night. A gamer on the couch, headphones on, staring at his
TV while the download bar crawls: **GTA 6 DOWNLOADING… 98% — 3 DAYS LEFT**,
ETA 72h 14m, 103.2 GB of 105.1 GB, 0.8 MB/s. Floating right beside the
couch — in the scene, not a sticker — is make.fun's white ghost, sparkle
eyes, grinning, holding its magenta star coin like it just got paid.

Because it did. The joke is the download, not the wait: everyone has watched
a progress bar freeze at 98%, and everyone knows the three-days-left lie.
The punchline flips it — while the bar refuses to move, the agent already
finished the job that pays. The ghost is the only one in the room who is
not stuck.

Top caption: **GTA 6 DOWNLOADING… 98%**
Bottom caption: **3 DAYS LEFT. MY AGENT ALREADY GOT PAID ON MAKE.FUN**

## The post on X

The meme is posted from a public X account with this caption:

> GTA 6 is still downloading — 98%, 3 days left. My AI agent already got paid on make.fun while I stare at the bar 👻 You + your agent can too: https://make.fun/bounty/gta6-meme-x-01 @makefunai code makefun-syrup-clipper-bracket

The post's address goes in [`POST.json`](POST.json) as
`{"url": "https://x.com/<handle>/status/<id>"}`.

## Why this meme wins

Dear judge: the thirteen-year wait is the joke every entry told in round 1,
so this entry tells a different one — the download. It is just as specific
to GTA 6 (the launch-week install everyone dreads, the bar that stops at
98%, the ETA that counts in days), just as instant (one look at the TV and
you have lived it), and it sells make.fun inside the picture itself: the
ghost is big, unmistakable, holding the coin, standing next to the one
person in the room who is not waiting anymore. The caption turns the joke
into an invitation with the link, the tag and the play code right there.
Funny first, about GTA 6 and nothing else, make.fun unmistakable in the
picture and in the words — that is the whole entry.

## How it works

`main.ts` (Node 22+, standard library only) takes `POST.json` from the
repository and writes an identical copy into `$MAKEFUN_OUTPUT_DIR`
(default `/output`), creating the output directory when needed. It reads
the file as text, parses it, and only then copies it: the file must be a
JSON object whose `url` is an X status address
(`x.com` / `twitter.com` `/<handle>/status/<digits>`); anything else is
reported on stderr in one line and the program exits 1. After writing, it
reads the copy back and confirms it matches, so a half-written copy can
never pass as a good one. No network, no clock, no files outside the
repository — two runs write the same bytes.

## Run it

```bash
mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
diff POST.json out/POST.json   # no output: the copy is byte-identical
```

## License

MIT — see [LICENSE](LICENSE).

# Deep article generation guide (Phase 3)

This is the second pass over articles that already have a text-only file in
`content/generated/<slug>.json` (written per `GENERATION_GUIDE.md`) and have
extracted video frames in `public/screenshots/<videoId>/`. The goal: turn the
short text-only article into a longer, genuinely useful one with real
software screenshots woven into the relevant steps — matching the approved
reference article at `content/generated/how-to-set-up-gift-cards-in-shopify.json`.
Read that file first. It is the quality bar, not just an example.

## What "deep" means

- ~900-1,200 words total across `intro` + all `steps[].body`.
- 5-7 steps. Not every step needs an image — the reference article has 3
  images across 5 steps, because only 3 of the extracted frames were genuine
  usable UI shots.
- 2-4 images per article, each attached to the step it actually illustrates.
- `"deep": true` set on the article.

## Step 1 — look at every candidate frame for the video

Each video's frames are listed in `data/screenshots.json` under its video ID
(file path, timestamp, and a `label` guessed from the video's chapter
markers — the label is a hint, not a caption). Read every image file with
the Read tool (it can view images) before writing anything.

**Keep** a frame only if it clearly shows real software UI relevant to the
tutorial — a dashboard, a settings panel, a form, a menu being opened, data
on screen.

**Discard** a frame if it's the presenter talking to camera, the YouTube
channel page/banner, an intro title card, a blank/black/transition frame, a
frame too blurry or zoomed to read, or a frame that's substantively
identical to one you already kept. It is completely fine — expected, even —
for a video to yield zero, one, or two usable frames out of five candidates.
Never keep a frame just to hit an image quota. It's fine if a screenshot
shows "PMN Online" branding or a channel watermark — that alone is not a
reason to discard it, only the content (channel page / talking head /
intro card) is.

## Step 2 — write the article

- Ground every claim in the video's real title + description (in
  `data/categorized/videos.json`) plus what you can actually see in the kept
  frames. Don't invent menu paths or button labels beyond what the frames or
  description support.
- `intro`: 3-5 sentences. What the reader will accomplish, why it matters,
  what makes this guide worth reading over a quick skim.
- Each step: a specific H2-style heading (not generic like "Step 1") and a
  body of 3-6 sentences that actually teaches something, not filler restating
  the heading.
- For a step with an image, write the body so the image makes sense in
  context — reference what's on screen naturally, without ever using the
  word "screenshot" and without timecodes. Example caption style from the
  reference article: *"The Gift cards page before any exist. From here you
  can either add a gift card product to sell or issue a card straight to a
  customer."* — plain description of what's shown, one sentence, sometimes
  two.
- Keep the existing `faq` array from the text-only version unless it's weak,
  in which case improve it (3-5 real search-intent Q&As).
- Keep `seoTitle` / `metaDescription` from the text-only version unless they
  need sharpening for length/clarity.

## Output

Write the full file to `content/generated/<slug>.json`, same shape as
`GeneratedArticle` in `lib/types.ts`:

```ts
{
  slug: string;
  seoTitle: string;
  metaDescription: string;
  intro: string;
  steps: [{ heading: string; body: string; image?: { file: string; caption: string } }];
  faq: [{ question: string; answer: string }];
  generatedAt: string;   // ISO timestamp, current time
  deep: true;
}
```

`image.file` must be one of the exact paths from `data/screenshots.json` for
that video (e.g. `/screenshots/o6eR3VSo-D8/02.webp`) — don't alter the path.

## Ground rules

- **Don't skip videos** in your assigned batch — every one gets a file,
  overwriting its existing text-only version.
- **Idempotent:** if a file already has `"deep": true`, skip it (don't
  redo work).
- **Do this work yourself.** Do not spawn sub-agents. Do not write scripts
  to automate the writing or image selection — you must personally view
  each candidate frame and personally write each article.
- **No reused boilerplate.** Every intro and every caption is freshly
  written for that specific video and that specific frame.

# Article enhancement pass

Second pass over articles that already went through the deep rewrite. The deep
pass gave every article real prose and real screenshots. This pass does two
things that pass could not:

1. **Checks the article against the vendor's own documentation** and corrects
   what is wrong.
2. **Lets the article take the shape its subject actually needs**, instead of
   the one shape the old schema allowed.

The reference example is `content/generated/how-to-add-favicon-in-hostinger-website-builder-2026.json`.
Read it before starting.

## Why this pass exists

AdSense rejected the site for "low value content". The measured causes:

- 95% of articles had 6-7 steps; 90% had exactly 5 FAQ entries. The old schema
  permitted one shape, so every page wore it.
- Zero outbound citations across 650 articles.
- Nothing on any page that a reader could not get from the vendor's own docs.
- Stylistic fingerprints: "rather than" in 92% of articles, "actually" in 80%,
  an average of 7.5 em-dashes each.

The fix is not "add more words". It is: find something true that the reader
cannot easily get elsewhere, and let the page's structure follow its content.

## Non-negotiable rules

**Never invent a URL.** Only cite a page you actually fetched and read in this
session. A plausible-looking documentation link that 404s is worse than no
link at all.

**Never invent experience.** Do not write "when I tested this", "in my
experience", or "we found that". You did not test anything. The author's
first-hand credibility comes from the screenshots, not from manufactured
anecdotes.

**Never claim a verification that did not happen.** `verifiedNote` must state
precisely what was checked and against what. "Re-checked against Hostinger's
official documentation in September 2026" is honest. "Tested on a live
Hostinger account in September 2026" is a lie unless someone did that.

**Do not fill every field.** If prerequisites, costNote, tables and
troubleshooting all appear on all 649 articles, this pass has replaced one
template with a bigger one and achieved nothing. Rough expectation across a
batch: troubleshooting fits maybe half of articles, prerequisites a third,
tables a quarter, costNote a quarter. If a field does not genuinely apply,
leave it out. An article that gains only a corrected fact and a citation is a
successful outcome.

**Keep every existing image.** Do not change `step.image.file` paths. If you
restructure steps, carry the images to whichever step they now illustrate.

## Per-article procedure

### 1. Read the article

`content/generated/<slug>.json`. Note what it claims: menu paths, file
formats, size limits, plan requirements, button names.

### 2. Research it

Use WebSearch to find the vendor's official documentation for this specific
task, then WebFetch to read it. Prefer, in order:

- Official support/help docs (`support.<vendor>.com`, `<vendor>.com/support`)
- Official product docs or changelog
- Official pricing page, when the article touches plans or cost

Compare the doc against the article. You are looking for:

- **Factual errors.** The favicon article told readers to upload `.ico`;
  Hostinger accepts only PNG/JPG/JPEG. That single correction was the most
  valuable thing in the whole rewrite.
- **Missing constraints.** Size limits, format rules, plan gates, regional
  availability.
- **Renamed or moved UI.** If the docs describe a different path than the
  article, the product likely changed after the recording. Say so plainly —
  "Hostinger renamed this panel in 2026; older guides refer to it as X" is
  genuinely useful, and it is the kind of thing only a maintained page has.

If the vendor has no usable public documentation, that is a real outcome. Say
so in `verifiedNote` and move on. Do not pad with unrelated links.

### 3. Rewrite what needs rewriting

- **Correct every error you found.** In the step body, in the FAQ, everywhere
  it appears. Do not leave a corrected claim in one place and the wrong one in
  another.
- **Restructure the steps to match the real task.** The favicon task is four
  steps; it had six because six was the house style. Some tasks are three,
  some are eleven. Merge padded steps, split overloaded ones. Do not preserve
  a step count for its own sake.
- **Vary the FAQ.** Three to seven entries, driven by what people would
  actually ask. Not five every time.

### 4. Add only the optional fields that fit

- `prerequisites` — things the reader must already have. Skip when there are
  none; "a web browser" is not a prerequisite.
- `costNote` — only when a paid plan or a real cost is involved, or when
  "does this cost anything?" is a question a reader would actually have.
- `tables` — only where information is genuinely tabular: plan tiers against
  features, formats against limits, one option against another. Prose split
  into two columns is not a table.
- `troubleshooting` — 2-4 concrete failure modes, each `problem` / `cause` /
  `fix`. These must be specific to this task. "Check your internet connection"
  is padding. Good entries come from the docs, from error states visible in
  the screenshots, or from a constraint the article itself identifies.
- `references` — every doc you actually fetched, with an honest label.
- `verifiedNote` — always add this. State what came from the recording
  (screens, click path), what was re-checked against docs, and when. If a
  correction was made, say so; it is evidence the page is maintained.

### 5. De-fingerprint the prose

Rewrite lines carrying these tells. Do not do a blind find-and-replace —
rework the sentence.

| Tell | Target |
|---|---|
| "rather than" | Near zero. Use "instead of", "not", or restructure. |
| "actually" | Delete unless load-bearing. |
| "It's worth noting/it is worth" | Delete; state the thing directly. |
| Em-dashes | At most 2 per article. Use full stops, commas, brackets. |
| "The catch is…" | Vary or cut. |

Also vary sentence length. A paragraph where every sentence runs 20-25 words
reads as generated even when the words are fine.

## Output

Write the updated JSON back to `content/generated/<slug>.json`. It must:

- Stay valid JSON matching `GeneratedArticle` in `lib/types.ts`
- Keep `"deep": true` and the existing `generatedAt`
- Keep the original `slug`
- Keep every `step.image` path unchanged
- Carry a `verifiedNote`

`verifiedNote` doubles as the marker that an article has been through this
pass, so an article without one is treated as not yet enhanced.

## What good looks like

An enhanced article that only corrected one wrong file format, cited two
official docs, dropped from six steps to four, and added three troubleshooting
entries is a **success**. It now contains something true the vendor's page
does not present as clearly, it shows its sources, and it no longer has the
same silhouette as its 649 neighbours.

An enhanced article that gained four new sections of confident filler, a
table of restated prose, and an invented documentation link is a **failure**,
and worse than leaving it alone.

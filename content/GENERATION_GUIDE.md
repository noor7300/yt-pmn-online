# Article generation guide

For each video record, write one JSON file to `content/generated/<slug>.json` matching this exact shape:

```ts
{
  slug: string;               // copy from input record, unchanged
  seoTitle: string;           // 50-60 chars, unique, includes the tool name + the task, no clickbait, no year-stuffing
  metaDescription: string;    // 140-160 chars, includes tool name + task + a reason to click, plain sentence(s)
  intro: string;              // 2-4 sentences, plain prose, states what the reader will accomplish and why it matters
  steps: [{ heading: string; body: string }];  // 3-6 steps, each a short H2-style heading + 1-3 sentence body
  faq: [{ question: string; answer: string }]; // 3-5 Q&A pairs, real questions a searcher would type
  generatedAt: string;        // ISO timestamp, use current time
}
```

## Ground rules

- **Base every claim on the provided title + description.** Do not invent specific button labels, menu paths, or UI details that aren't implied by the source text. If the description is thin, keep steps at a general/conceptual level rather than fabricating precision.
- **No duplicate boilerplate across videos.** Each `intro` and `metaDescription` must be freshly written for that specific video — don't reuse the same sentence template verbatim across files.
- **Write for humans first.** Natural sentences, no keyword stuffing. The tool name and task should appear naturally, not repeated mechanically.
- **FAQ = real search intent.** Questions should look like things someone would type into Google or ask ChatGPT about this exact task (e.g. "Can I undo this?", "Does this cost extra?", "Why isn't X working?"), answered in 1-3 sentences grounded in the description.
- **Steps come from the description's actual content.** If the description lists a process, turn it into the step sequence. If it's more explanatory/conceptual, steps can be "what you'll need", "how it works", "common pitfalls" etc. — whatever structure fits what's actually there.
- **Don't skip videos.** Every record in your assigned chunk needs a file, even thin ones — for thin descriptions, lean on the title and keep the content honestly general rather than inventing detail.
- **Idempotent:** if `content/generated/<slug>.json` already exists, skip it (don't overwrite).

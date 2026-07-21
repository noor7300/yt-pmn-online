import { getGroups } from "@/lib/data";
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION } from "@/lib/site";

export function GET() {
  const groups = getGroups();

  const lines = [
    `# ${SITE_NAME}`,
    "",
    `> ${SITE_DESCRIPTION}`,
    "",
    "## Categories",
    "",
    ...groups.flatMap((group) => [
      `### ${group.label}`,
      ...group.categories.map(
        (c) => `- [${c.label}](${SITE_URL}/tutorials/${c.slug}): ${c.count} tutorial${c.count === 1 ? "" : "s"}`
      ),
      "",
    ]),
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

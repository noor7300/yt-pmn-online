import { HomePage } from "@/components/HomePage";

/** The browse feed rotates daily (see ROTATION_SEED in lib/data.ts). Without
 * a revalidate window the page is built once and the rotation never advances,
 * since nothing else triggers a rebuild between deploys. */
export const revalidate = 86400;

export default function Home() {
  return <HomePage page={1} />;
}

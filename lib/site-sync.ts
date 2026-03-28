import { revalidatePath } from "next/cache";

const PUBLIC_PATHS = [
  "/",
  "/about",
  "/product",
  "/resources",
  "/contact",
  "/privacy",
  "/terms",
  "/refund-policy"
];

export async function revalidateSiteContent() {
  for (const route of PUBLIC_PATHS) {
    revalidatePath(route);
  }
  revalidatePath("/[slug]", "page");
  revalidatePath("/resources/posts/[slug]", "page");
  revalidatePath("/admin", "page");

  return {
    revalidatedAt: new Date().toISOString(),
    paths: PUBLIC_PATHS.length + 3
  };
}

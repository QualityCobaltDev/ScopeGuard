import type { MetadataRoute } from "next";
import { isPublishedPost } from "@/lib/blog";
import { readPosts } from "@/lib/cms-store";
import { siteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = ["", "/product", "/about", "/resources", "/blog", "/contact", "/privacy", "/terms", "/refund-policy"];
  const staticRoutes = routes.map((route) => ({
    url: `${siteUrl}${route}`,
    changeFrequency: route === "" ? ("weekly" as const) : ("monthly" as const),
    priority: route === "" ? 1 : 0.7
  }));

  const posts = (await readPosts()).filter(isPublishedPost);
  const blogRoutes = posts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.6
  }));

  return [...staticRoutes, ...blogRoutes];
}

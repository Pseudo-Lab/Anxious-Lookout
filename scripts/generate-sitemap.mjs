import fs from "fs";
import path from "path";
import matter from "gray-matter";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "";
const POSTS_DIR = path.join(process.cwd(), "content/posts");
const OUT_DIR = path.join(process.cwd(), "out");

function getAllPosts() {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => {
      const content = fs.readFileSync(path.join(POSTS_DIR, f), "utf-8");
      const { data } = matter(content);
      return { slug: f.replace(/\.mdx$/, ""), date: data.date, tags: data.tags || [] };
    });
}

function generateSitemap() {
  const posts = getAllPosts();
  const tags = [...new Set(posts.flatMap((p) => p.tags))];
  const today = new Date().toISOString().split("T")[0];

  const urls = [
    { loc: `${SITE_URL}/`, lastmod: today },
    { loc: `${SITE_URL}/tags/`, lastmod: today },
    ...posts.map((p) => ({ loc: `${SITE_URL}/posts/${p.slug}/`, lastmod: p.date || today })),
    ...tags.map((t) => ({ loc: `${SITE_URL}/tags/${t}/`, lastmod: today })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
  </url>`).join("\n")}
</urlset>`;

  fs.writeFileSync(path.join(OUT_DIR, "sitemap.xml"), xml);
  console.log(`Sitemap generated with ${urls.length} URLs`);
}

generateSitemap();

import { Feed } from "feed";
import { getAllPosts, getAuthor } from "@/lib/content";
import { SITE } from "@/lib/constants";
import { absoluteUrl, absoluteImage, toISODate } from "@/lib/utils";

/** Single Feed instance used to generate RSS / Atom / JSON outputs. */
export function buildFeed(): Feed {
  const feed = new Feed({
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    id: SITE.url,
    link: SITE.url,
    language: "en",
    image: absoluteUrl("/icon.png"),
    favicon: absoluteUrl("/favicon.ico"),
    copyright: `© ${new Date().getFullYear()} ${SITE.name}`,
    updated: new Date(),
    feedLinks: {
      rss2: absoluteUrl("/feed.xml"),
      atom: absoluteUrl("/atom.xml"),
      json: absoluteUrl("/feed.json"),
    },
    author: { name: SITE.name, link: SITE.url },
  });

  for (const post of getAllPosts().slice(0, 50)) {
    const author = getAuthor(post.frontmatter.author);
    const link = absoluteUrl(`/blog/${post.slug}`);
    feed.addItem({
      title: post.frontmatter.title,
      id: link,
      link,
      description: post.frontmatter.description,
      content: post.frontmatter.description,
      date: new Date(toISODate(post.frontmatter.publishedAt)),
      image: post.frontmatter.cover ? absoluteImage(post.frontmatter.cover) : undefined,
      category: [{ name: post.frontmatter.category }],
      author: author
        ? [{ name: author.frontmatter.name, link: absoluteUrl(`/author/${author.slug}`) }]
        : undefined,
    });
  }

  return feed;
}

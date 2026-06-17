import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { ArticleCard } from "@/components/blog/article-card";
import { Hero } from "@/components/home/hero";
import { StatsStrip } from "@/components/home/stats-strip";
import { ToolsStrip } from "@/components/home/tools-strip";
import { NewsletterBand } from "@/components/home/newsletter-band";
import { TopicsIndex, buildTopicEntries } from "@/components/home/topics-index";
import { JsonLd } from "@/components/seo/json-ld";
import { getAllPosts, getFeaturedPosts } from "@/lib/content";
import { organizationSchema, websiteSchema } from "@/lib/schema";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  // `title.absolute` skips the "%s · Compound" template — avoids "Compound … · Compound".
  title: { absolute: `${SITE.name} — ${SITE.tagline}` },
  description: SITE.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
  },
};

export const revalidate = 3600;

export default function HomePage() {
  const featured = getFeaturedPosts(5);
  const allPosts = getAllPosts();
  const latest = allPosts.filter((p) => !featured.includes(p)).slice(0, 6);

  const [hero, ...stack] = featured;
  const topicEntries = buildTopicEntries(allPosts);

  return (
    <>
      <JsonLd data={[organizationSchema(), websiteSchema()]} />
      <Hero />
      <StatsStrip />

      <Container className="py-20">
        <SectionHeading
          serial="01 / 05"
          eyebrow="The dispatch"
          title="What's worth your attention this week."
          href="/blog"
          hrefLabel="The archive"
        />
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          {hero && <ArticleCard post={hero} variant="feature" priority />}
          <div className="flex flex-col divide-y divide-border">
            {stack.slice(0, 4).map((post) => (
              <article key={post.slug} className="group flex gap-5 py-5 first:pt-0 last:pb-0">
                <span className="font-mono text-xs text-faint shrink-0 w-7 pt-1">
                  №{String(stack.indexOf(post) + 2).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <a
                    href={`/blog/${post.slug}`}
                    className="block font-display text-lg font-medium leading-snug tracking-tight transition-colors group-hover:text-accent-ink"
                  >
                    {post.frontmatter.title}
                  </a>
                  <p className="mt-1.5 line-clamp-2 text-sm text-muted">
                    {post.frontmatter.description}
                  </p>
                  <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
                    {post.frontmatter.category} · {post.readingTimeMinutes} MIN
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </Container>

      <TopicsIndex entries={topicEntries} />

      <ToolsStrip />

      {latest.length > 0 && (
        <Container className="py-20">
          <SectionHeading
            serial="04 / 05"
            eyebrow="Latest articles"
            title="Fresh off the desk."
            href="/blog"
            hrefLabel="More articles"
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latest.map((post) => (
              <ArticleCard key={post.slug} post={post} />
            ))}
          </div>
        </Container>
      )}

      <NewsletterBand />
    </>
  );
}

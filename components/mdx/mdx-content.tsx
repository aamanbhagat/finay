import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode, { type Options as PrettyCodeOptions } from "rehype-pretty-code";
import type { AnchorHTMLAttributes, ImgHTMLAttributes } from "react";
import { Callout } from "@/components/mdx/callout";
import { NewsletterInline } from "@/components/blog/newsletter-inline";

const prettyCodeOptions: PrettyCodeOptions = {
  theme: "one-dark-pro",
  keepBackground: true,
  defaultLang: "plaintext",
};

function MdxLink({ href = "", ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const isInternal = href.startsWith("/") || href.startsWith("#");
  if (isInternal) {
    return <Link href={href} {...props} />;
  }
  return <a href={href} target="_blank" rel="noopener noreferrer" {...props} />;
}

function MdxImage({ alt = "", ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img alt={alt} loading="lazy" decoding="async" className="rounded-(--radius)" {...props} />;
}

const components = {
  a: MdxLink,
  img: MdxImage,
  Callout,
  NewsletterInline,
};

/** Server component that compiles + renders an MDX article body. */
export function MdxContent({ source }: { source: string }) {
  return (
    <MDXRemote
      source={source}
      components={components}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [
            rehypeSlug,
            [rehypeAutolinkHeadings, { behavior: "wrap", properties: { className: ["heading-anchor"] } }],
            [rehypePrettyCode, prettyCodeOptions],
          ],
        },
      }}
    />
  );
}

import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { BLOG_POSTS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Blog",
};

export default function BlogPage() {
  return (
    <div className="pt-16 pb-24">
      <Container>
        <div className="mb-16 pt-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-4">
            Blog
          </h1>
          <p className="text-lg text-gray-400">
            Engineering deep-dives, product updates, and data pipeline best
            practices.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {BLOG_POSTS.map((post) => (
            <article
              key={post.slug}
              className="rounded-xl border border-gray-700/30 bg-surface-800/30 overflow-hidden hover:border-primary-500/20 hover:bg-surface-800/50 transition-all duration-300 group"
            >
              {/* Placeholder image */}
              <div className="aspect-video bg-surface-800 flex items-center justify-center border-b border-gray-700/30">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-xl bg-primary-600/10 border border-primary-500/20 flex items-center justify-center mx-auto mb-2">
                    <svg
                      aria-hidden="true"
                      className="w-6 h-6 text-primary-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                      />
                    </svg>
                  </div>
                  <span className="text-xs text-gray-600">Coming soon</span>
                </div>
              </div>
              <div className="p-6">
                <time className="text-xs text-gray-500 font-mono">
                  {post.date}
                </time>
                <h2 className="text-lg font-semibold text-white mt-2 mb-3 group-hover:text-primary-300 transition-colors">
                  {post.title}
                </h2>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </div>
  );
}

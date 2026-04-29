import { getPostBySlug } from "@/services/posts";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  Eye,
  Tag as TagIcon
} from "lucide-react";
import { format } from "date-fns";
import { BackButton } from "@/components/ui/custom/back-button";

export default async function InsightDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const res = await getPostBySlug(slug);

  if (!res.success || !res.data) {
    notFound();
  }

  const post = res.data;
  const categoryName = typeof post.category === 'object' ? post.category.name : 'Uncategorized';

  return (
    <div className="p-4 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 ">
      {/* Back Button & Navigation */}
      <BackButton label="Back to Insights" />

      <article className="space-y-10">
        {/* Header Section */}
        <header className="space-y-6 text-center lg:text-left">
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-sm text-muted-foreground">
            <Badge variant="secondary" className="px-4 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 transition-colors border-none rounded-full font-semibold">
              {categoryName}
            </Badge>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 opacity-70" />
              {post.createdAt ? format(new Date(post.createdAt), "MMMM d, yyyy") : "Jan 12, 2026"}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 opacity-70" />
              {post.readTime || "5 min read"}
            </div>
            <div className="flex items-center gap-2 text-primary font-medium">
              <Eye className="h-4 w-4" />
              {post.views?.toLocaleString() || 0} views
            </div>
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-foreground leading-[1.1] ">
            {post.title}
          </h1>

          {/* {post.subtitle && (
            <p className="text-xl md:text-2xl text-muted-foreground font-medium leading-relaxed max-w-4xl text-balance">
              {post.subtitle}
            </p>
          )} */}
        </header>

        {/* Featured Image */}
        {post.coverImage && (
          <div className="relative w-50 h-20 overflow-hidden rounded-sm shadow-2xl ring-1 ring-border/50 group">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
              // sizes="(max-width: 1024px) 100vw, 1024px"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent pointer-events-none" />
          </div>
        )}

        {/* Content Section */}
        <div className="p-8 border rounded-2xl bg-card">
          <div className="space-y-12">
            <div
              className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-img:w-200 prose-img:h-100 prose-p:leading-[1.8] prose-p:text-muted-foreground prose-img:rounded-3xl prose-img:shadow-xl prose-a:text-primary prose-a:font-semibold prose-a:no-underline hover:prose-a:underline prose-blockquote:border-primary prose-blockquote:bg-primary/5 prose-blockquote:p-6 prose-blockquote:rounded-2xl prose-blockquote:not-italic"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Tags Footer */}
            {post.tag && post.tag.length > 0 && (
              <div className="flex flex-wrap items-center gap-3 pt-10 border-t border-border/50">
                <div className="flex items-center gap-2 text-muted-foreground text-sm font-semibold mr-2">
                  <TagIcon className="h-4 w-4 text-primary/70" />
                  RELATED TOPICS
                </div>
                {post.tag.map((tag: string, idx: number) => (
                  <Badge key={idx} variant="outline" className="px-4 py-1.5 rounded-full text-xs font-medium hover:bg-primary/10 hover:text-primary transition-all border-border/50">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}

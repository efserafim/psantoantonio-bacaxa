import PageLayout from "@/components/PageLayout";
import NewsCard from "@/components/NewsCard";
import { useEffect, useState } from "react";

type ApiNews = {
  id: string;
  title: string;
  excerpt?: string | null;
  image_url?: string | null;
  published_at?: number | string | null;
};

export default function Noticias() {
  const [news, setNews] = useState<ApiNews[]>([]);

  useEffect(() => {
    fetch("/api/noticias")
      .then((r) => r.json())
      .then((data) => {
        // Garantir que sempre é um array
        const newsArray = Array.isArray(data) ? data : [];
        setNews(newsArray);
      })
      .catch((err) => {
        console.error("Erro ao carregar notícias:", err);
        setNews([]);
      });
  }, []);

  const formatDate = (timestamp: number | string | null | undefined) => {
    // If no timestamp or it's 0 (epoch), return today
    if (!timestamp || timestamp === 0) return new Date().toISOString();
    
    // If it's a number (Unix timestamp in seconds from SQLite)
    if (typeof timestamp === "number") {
      return new Date(timestamp * 1000).toISOString();
    }
    
    // If it's already a string, return as is
    return timestamp;
  };

  return (
    <PageLayout>
      <div className="bg-primary/5 py-12 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold">Notícias</h1>
          <p className="text-muted-foreground mt-2">
            Acompanhe as últimas novidades e eventos da nossa paróquia
          </p>
        </div>
      </div>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((n) => (
              <NewsCard
                key={n.id}
                id={n.id}
                title={n.title}
                excerpt={n.excerpt || ""}
                imageUrl={n.image_url || undefined}
                publishedAt={formatDate(n.published_at)}
              />
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}

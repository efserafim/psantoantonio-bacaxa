import PageLayout from "@/components/PageLayout";
import { useEffect, useState } from "react";
import { useParams, useRoute } from "wouter";
import { Calendar, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

type News = {
  id: string;
  title: string;
  excerpt?: string | null;
  content?: string | null;
  image_url?: string | null;
  status: string;
  published_at?: number | null;
  created_at?: number | null;
};

export default function NoticiasDetalhe() {
  const [_match, params] = useRoute("/noticias/:id");
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const id = params?.id;

  useEffect(() => {
    if (!id) return;

    const fetchNews = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/noticias/${id}`);
        if (!res.ok) {
          throw new Error("Notícia não encontrada");
        }
        const data = await res.json();
        setNews(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao carregar notícia");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [id]);

  const formatDate = (timestamp: number | null | undefined) => {
    if (!timestamp) return "";
    return format(new Date(timestamp * 1000), "d 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </PageLayout>
    );
  }

  if (error || !news) {
    return (
      <PageLayout>
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
          <p className="text-destructive">{error || "Notícia não encontrada"}</p>
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <article className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button variant="ghost" className="mb-6" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Notícias
          </Button>

          {news.image_url && (
            <div className="mb-8 rounded-lg overflow-hidden">
              <img
                src={news.image_url}
                alt={news.title}
                className="w-full h-96 object-cover"
              />
            </div>
          )}

          <div className="space-y-4 mb-8">
            <h1 className="font-serif text-4xl sm:text-5xl font-bold">{news.title}</h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-5 w-5" />
              <time>{formatDate(news.published_at)}</time>
            </div>
          </div>

          {news.excerpt && (
            <p className="text-lg text-muted-foreground mb-8 italic border-l-4 border-primary pl-4">
              {news.excerpt}
            </p>
          )}

          <div className="prose prose-sm sm:prose lg:prose-lg max-w-none dark:prose-invert">
            {news.content ? (
              <div dangerouslySetInnerHTML={{ __html: news.content }} />
            ) : (
              <p className="text-muted-foreground">Nenhum conteúdo disponível</p>
            )}
          </div>
        </div>
      </article>
    </PageLayout>
  );
}

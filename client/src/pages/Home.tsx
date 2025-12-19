import PageLayout from "@/components/PageLayout";
import HeroSection from "@/components/HeroSection";
import NewsCard from "@/components/NewsCard";
import { useEffect, useState } from "react";
import PastoralCard from "@/components/PastoralCard";
import MassScheduleModern from "@/components/MassScheduleModern";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, ChurchIcon } from "lucide-react";

// fetch news from API
type ApiNews = {
  id: string;
  title: string;
  excerpt?: string | null;
  image_url?: string | null;
  published_at?: string | null;
};

const useLatestNews = (limit = 3) => {
  const [news, setNews] = useState<ApiNews[]>([]);

  useEffect(() => {
    let mounted = true;
    fetch(`/api/noticias`)
      .then((r) => r.json())
      .then((data: ApiNews[]) => {
        if (!mounted) return;
        // API já retorna ordenado (mais recentes primeiro)
        // Pega apenas os primeiros 'limit' itens
        const sorted = Array.isArray(data) ? data.slice(0, limit) : [];
        setNews(sorted);
      })
      .catch(() => setNews([]));
    return () => {
      mounted = false;
    };
  }, [limit]);

  return news;
};

type Pastoral = {
  id: string;
  name: string;
  description?: string | null;
  coordinator?: string | null;
  email?: string | null;
  phone?: string | null;
  meeting_day?: string | null;
  meeting_time?: string | null;
  image_url?: string | null;
  status: string;
};

const useLatestPastorals = (limit = 2) => {
  const [pastorals, setPastorals] = useState<Pastoral[]>([]);

  useEffect(() => {
    let mounted = true;
    fetch(`/api/pastorais`)
      .then((r) => r.json())
      .then((data: Pastoral[]) => {
        if (!mounted) return;
        setPastorals(Array.isArray(data) ? data.slice(0, limit) : []);
      })
      .catch(() => setPastorals([]));
    return () => {
      mounted = false;
    };
  }, [limit]);

  return pastorals;
};

export default function Home() {
  return (
    <PageLayout>
      <HeroSection />

      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold">Últimas Notícias</h2>
              <p className="text-muted-foreground mt-1">Fique por dentro das novidades da paróquia</p>
            </div>
            <Link href="/noticias">
              <Button variant="outline" className="gap-2" data-testid="button-ver-mais-noticias">
                Ver todas
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {useLatestNews().map((n) => (
              <NewsCard
                key={n.id}
                id={n.id}
                title={n.title}
                excerpt={n.excerpt || ""}
                imageUrl={n.image_url || undefined}
                publishedAt={n.published_at || new Date().toISOString()}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold">Horários das Missas</h2>
              <p className="text-muted-foreground mt-1">Participe das celebrações eucarísticas</p>
            </div>
            <Link href="/missas">
              <Button variant="outline" className="gap-2" data-testid="button-ver-mais-missas">
                Ver todos os horários
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="max-w-4xl">
            <MassScheduleModern />
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-b from-muted/30 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold">Nossas Pastorais</h2>
              <p className="text-muted-foreground mt-1">Grupos que fortalecem nossa comunidade</p>
            </div>
            <Link href="/pastorais">
              <Button variant="outline" className="gap-2" data-testid="button-ver-mais-pastorais">
                Ver todas
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {useLatestPastorals().map((pastoral) => (
              <PastoralCard
                key={pastoral.id}
                id={pastoral.id}
                name={pastoral.name}
                description={pastoral.description || ""}
                coordinator={pastoral.coordinator || undefined}
                meetingDay={pastoral.meeting_day || undefined}
                meetingTime={pastoral.meeting_time || undefined}
                imageUrl={pastoral.image_url || undefined}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-primary via-primary to-primary/80 text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ChurchIcon className="h-16 w-16 mx-auto mb-6 opacity-90 animate-pulse" />
          <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-4">
            Venha nos Visitar
          </h2>
          <p className="text-primary-foreground/90 mb-8 max-w-2xl mx-auto text-lg leading-relaxed">
            Santo Antonio, apóstolo do amor, fazei que me inflameis do ardor divino que vos animava.
          </p>
          <Link href="/missas">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-lg" data-testid="button-cta-missas">
              Ver Horários das Missas
            </Button>
          </Link>
        </div>
      </section>
    </PageLayout>
  );
}

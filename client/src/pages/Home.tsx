import PageLayout from "@/components/PageLayout";
import HeroSection from "@/components/HeroSection";
import NewsCard from "@/components/NewsCard";
import PastoralCard from "@/components/PastoralCard";
import MassSchedule from "@/components/MassSchedule";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, ChurchIcon } from "lucide-react";

// todo: remove mock functionality
const mockNews = [
  {
    id: 1,
    title: "Festa de Santo Antonio 2024 - Participe das Celebrações",
    excerpt: "A tradicional festa do nosso padroeiro acontecerá de 1º a 13 de junho com missas especiais, quermesse e procissão.",
    imageUrl: "https://images.unsplash.com/photo-1548625149-fc4a29cf7092?w=600&h=400&fit=crop",
    publishedAt: new Date("2024-05-15"),
  },
  {
    id: 2,
    title: "Campanha do Agasalho - Doe Roupas e Cobertores",
    excerpt: "Nossa paróquia está arrecadando agasalhos para famílias carentes. Traga sua doação na secretaria paroquial.",
    imageUrl: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=600&h=400&fit=crop",
    publishedAt: new Date("2024-05-10"),
  },
  {
    id: 3,
    title: "Catequese 2024 - Inscrições Abertas",
    excerpt: "Estão abertas as inscrições para catequese de crianças, jovens e adultos. Venha preparar-se para os sacramentos.",
    imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&h=400&fit=crop",
    publishedAt: new Date("2024-05-05"),
  },
];

// todo: remove mock functionality
const mockPastorals = [
  {
    id: 1,
    name: "Pastoral da Família",
    description: "Acolhimento e acompanhamento de famílias em diferentes etapas da vida matrimonial e familiar.",
    meetingDay: "Terças-feiras",
    meetingTime: "19h30",
    location: "Salão Paroquial",
  },
  {
    id: 2,
    name: "Pastoral da Juventude",
    description: "Espaço de encontro, formação e vivência da fé para jovens de 15 a 30 anos.",
    meetingDay: "Sábados",
    meetingTime: "15h",
    location: "Centro Comunitário",
  },
];

// todo: remove mock functionality
const mockMassSchedule = {
  chapel: "Igreja Matriz Santo Antonio",
  address: "Rua da Igreja, 123 - Centro",
  schedule: [
    { day: "Domingo", times: ["7h", "9h", "11h", "19h"] },
    { day: "Segunda a Sexta", times: ["7h", "18h"] },
    { day: "Sábado", times: ["7h", "17h"] },
  ],
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
            {mockNews.map((news) => (
              <NewsCard key={news.id} {...news} />
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

          <div className="max-w-2xl">
            <MassSchedule {...mockMassSchedule} />
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
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
            {mockPastorals.map((pastoral) => (
              <PastoralCard key={pastoral.id} {...pastoral} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ChurchIcon className="h-12 w-12 mx-auto mb-6 opacity-80" />
          <h2 className="font-serif text-2xl sm:text-3xl font-bold mb-4">
            Venha nos Visitar
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Nossa comunidade está de portas abertas para receber você. Participe das missas, 
            conheça nossas pastorais e faça parte desta família de fé.
          </p>
          <Link href="/missas">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90" data-testid="button-cta-missas">
              Ver Horários das Missas
            </Button>
          </Link>
        </div>
      </section>
    </PageLayout>
  );
}

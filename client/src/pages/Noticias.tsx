import PageLayout from "@/components/PageLayout";
import NewsCard from "@/components/NewsCard";

// todo: remove mock functionality
const mockNews = [
  {
    id: 1,
    title: "Festa de Santo Antonio 2024 - Participe das Celebrações",
    excerpt: "A tradicional festa do nosso padroeiro acontecerá de 1º a 13 de junho com missas especiais, quermesse e procissão. Não perca!",
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
  {
    id: 4,
    title: "Retiro Espiritual de Quaresma",
    excerpt: "Prepare seu coração para a Páscoa com nosso retiro espiritual. Inscrições abertas na secretaria.",
    imageUrl: "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=600&h=400&fit=crop",
    publishedAt: new Date("2024-04-28"),
  },
  {
    id: 5,
    title: "Missa de Formatura dos Catequizandos",
    excerpt: "Celebração especial para os jovens que concluíram a catequese e receberão o Sacramento da Crisma.",
    imageUrl: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=600&h=400&fit=crop",
    publishedAt: new Date("2024-04-20"),
  },
  {
    id: 6,
    title: "Bazar Beneficente - Ajude Famílias Carentes",
    excerpt: "Grande bazar com roupas, calçados e utensílios. Renda revertida para obras sociais da paróquia.",
    imageUrl: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&h=400&fit=crop",
    publishedAt: new Date("2024-04-15"),
  },
];

export default function Noticias() {
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
            {mockNews.map((news) => (
              <NewsCard key={news.id} {...news} />
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}

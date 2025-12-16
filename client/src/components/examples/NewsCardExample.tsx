import NewsCard from "../NewsCard";

export default function NewsCardExample() {
  return (
    <div className="max-w-sm">
      <NewsCard
        id={1}
        title="Festa de Santo Antonio 2024 - Participe das Celebrações"
        excerpt="A tradicional festa do nosso padroeiro acontecerá de 1º a 13 de junho com missas especiais, quermesse e procissão."
        imageUrl="https://images.unsplash.com/photo-1548625149-fc4a29cf7092?w=600&h=400&fit=crop"
        publishedAt={new Date("2024-05-15")}
      />
    </div>
  );
}

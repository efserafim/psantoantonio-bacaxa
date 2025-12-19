import PageLayout from "@/components/PageLayout";
import ChapelCard from "@/components/ChapelCard";
import { useEffect, useState } from "react";

type Capela = {
  id: string;
  name: string;
  neighborhood?: string | null;
  address?: string | null;
  phone?: string | null;
  description?: string | null;
  image_url?: string | null;
  status: string;
};

export default function Capelas() {
  const [capelas, setCapelas] = useState<Capela[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/capelas")
      .then((r) => r.json())
      .then((data) => {
        const capelasArray = Array.isArray(data) ? data : [];
        setCapelas(capelasArray);
      })
      .catch((err) => {
        console.error("Erro ao carregar capelas:", err);
        setCapelas([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageLayout>
      <div className="bg-primary/5 py-12 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold">Capelas</h1>
          <p className="text-muted-foreground mt-2">
            Conheça as capelas de nossa paróquia e os horários de missas
          </p>
        </div>
      </div>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <p className="text-center text-muted-foreground">Carregando capelas...</p>
          ) : capelas.length === 0 ? (
            <p className="text-center text-muted-foreground">Nenhuma capela disponível</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {capelas.map((capela) => (
                <ChapelCard
                  key={capela.id}
                  id={capela.id}
                  name={capela.name}
                  address={`${capela.neighborhood || ""}, ${capela.address || ""}`.replace(/^,\s*/, "")}
                  phone={capela.phone || undefined}
                  imageUrl={capela.image_url || undefined}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
}

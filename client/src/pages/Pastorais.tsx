import PageLayout from "@/components/PageLayout";
import PastoralCard from "@/components/PastoralCard";
import { useEffect, useState } from "react";

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

export default function Pastorais() {
  const [pastorais, setPastorais] = useState<Pastoral[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/pastorais")
      .then((r) => r.json())
      .then((data) => {
        const pastoraisArray = Array.isArray(data) ? data : [];
        setPastorais(pastoraisArray);
      })
      .catch((err) => {
        console.error("Erro ao carregar pastorais:", err);
        setPastorais([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageLayout>
      <div className="bg-primary/5 py-12 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold">Pastorais</h1>
          <p className="text-muted-foreground mt-2">
            Conheça as pastorais e grupos que animam nossa comunidade
          </p>
        </div>
      </div>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <p className="text-center text-muted-foreground">Carregando pastorais...</p>
          ) : pastorais.length === 0 ? (
            <p className="text-center text-muted-foreground">Nenhuma pastoral disponível</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastorais.map((pastoral) => (
                <PastoralCard
                  key={pastoral.id}
                  id={pastoral.id}
                  name={pastoral.name}
                  description={pastoral.description || ""}
                  coordinator={pastoral.coordinator || undefined}
                  meeting_day={pastoral.meeting_day || undefined}
                  meeting_time={pastoral.meeting_time || undefined}
                  imageUrl={pastoral.image_url || undefined}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
}


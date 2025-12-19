import PageLayout from "@/components/PageLayout";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";

type Massa = {
  id: string;
  capela_id?: string | null;
  day_of_week: string;
  time: string;
  description?: string | null;
};

const daysOfWeek = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];

export default function Missas() {
  const [missas, setMissas] = useState<Massa[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/missas")
      .then((r) => r.json())
      .then((data) => {
        const massasArray = Array.isArray(data) ? data : [];
        setMissas(massasArray);
      })
      .catch((err) => {
        console.error("Erro ao carregar missas:", err);
        setMissas([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const groupedByDay = missas.reduce((acc, massa) => {
    const day = parseInt(massa.day_of_week);
    if (!acc[day]) acc[day] = [];
    acc[day].push(massa);
    return acc;
  }, {} as Record<number, Massa[]>);

  return (
    <PageLayout>
      <div className="bg-primary/5 py-12 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold">Horários de Missa</h1>
          <p className="text-muted-foreground mt-2">Confira os horários de celebração em nossa comunidade</p>
        </div>
      </div>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <p className="text-center text-muted-foreground">Carregando horários...</p>
          ) : missas.length === 0 ? (
            <p className="text-center text-muted-foreground">Nenhum horário de missa disponível</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {daysOfWeek.map((dayName, dayIndex) => 
                groupedByDay[dayIndex] && groupedByDay[dayIndex].length > 0 && (
                  <Card key={dayIndex}>
                    <CardHeader>
                      <CardTitle className="text-lg">{dayName}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {groupedByDay[dayIndex].map((massa) => (
                        <div key={massa.id} className="flex items-start gap-3 pb-3 border-b last:border-b-0">
                          <Clock className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-semibold text-lg">{massa.time}</p>
                            {massa.description && (
                              <p className="text-sm text-muted-foreground">{massa.description}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )
              )}
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
}


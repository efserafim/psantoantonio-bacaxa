import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, ChurchIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface MassaData {
  id: string;
  capela_id: string | null;
  day_of_week: string;
  time: string;
  description: string | null;
}

interface CapelaData {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  neighborhood: string | null;
  status: string;
}

export default function MassScheduleModern() {
  const [schedule, setSchedule] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSchedule = async () => {
      try {
        // Buscar capelas
        const capelasRes = await fetch("/api/capelas");
        const capelasData: CapelaData[] = await capelasRes.json();

        // Buscar missas
        const missasRes = await fetch("/api/missas");
        const missasData: MassaData[] = await missasRes.json();

        // Organizar dados
        const organized = capelasData.map((capela) => {
          const capelasMissas = missasData.filter((m) => m.capela_id === capela.id);
          const byDay: Record<number, MassaData[]> = {};

          capelasMissas.forEach((massa) => {
            const day = parseInt(massa.day_of_week);
            if (!byDay[day]) byDay[day] = [];
            byDay[day].push(massa);
          });

          return {
            capela,
            missas: byDay,
          };
        });

        setSchedule(organized);
      } catch (error) {
        console.error("Erro ao carregar horários:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSchedule();
  }, []);

  const getDayName = (day: number): string => {
    const days = [
      "Domingo",
      "Segunda",
      "Terça",
      "Quarta",
      "Quinta",
      "Sexta",
      "Sábado",
    ];
    return days[day] || "";
  };

  const getNextDate = (day: number): string => {
    const today = new Date();
    const currentDay = today.getDay();
    let daysAhead = day - currentDay;

    if (daysAhead <= 0) {
      daysAhead += 7;
    }

    const date = new Date(today);
    date.setDate(date.getDate() + daysAhead);
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Carregando horários...</p>
        </div>
      </div>
    );
  }

  if (!schedule.length) {
    return (
      <Card className="p-8 text-center">
        <ChurchIcon className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
        <p className="text-muted-foreground">Nenhum horário disponível</p>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {schedule.map((item) => (
        <Card key={item.capela.id} className="overflow-hidden hover:shadow-md transition-shadow">
          {/* Header da Capela */}
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 border-b">
            <div className="flex items-start gap-4">
              <div className="bg-primary/20 p-3 rounded-lg">
                <ChurchIcon className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold font-serif text-foreground">
                  {item.capela.name}
                </h3>
                {item.capela.address && (
                  <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    <span>{item.capela.address}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Horários */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[0, 1, 2, 3, 4, 5, 6].map((dayNum) => {
                const dayMissas = item.missas[dayNum] || [];

                if (dayMissas.length === 0) return null;

                return (
                  <div
                    key={dayNum}
                    className="p-4 rounded-lg bg-muted/40 border border-border hover:border-primary/30 transition-colors"
                  >
                    <div className="mb-3">
                      <p className="font-semibold text-foreground flex items-center gap-2">
                        {getDayName(dayNum)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {getNextDate(dayNum)}
                      </p>
                    </div>

                    <div className="space-y-2">
                      {dayMissas.map((massa: MassaData, idx: number) => (
                        <div
                          key={`${massa.id}-${idx}`}
                          className="flex items-center gap-2 p-2 bg-white dark:bg-slate-950 rounded border border-border/50"
                        >
                          <Clock className="h-4 w-4 text-primary flex-shrink-0" />
                          <div className="flex-1">
                            <p className="font-semibold text-sm">{massa.time}</p>
                            {massa.description && (
                              <p className="text-xs text-muted-foreground">
                                {massa.description}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {Object.keys(item.missas).length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>Nenhum horário cadastrado para esta capela</p>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}

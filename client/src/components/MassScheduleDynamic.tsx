import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, ChurchIcon, MapPin } from "lucide-react";
import { useEffect, useState } from "react";

interface Massa {
  id: string;
  capela_id: string | null;
  day_of_week: string;
  time: string;
  description: string | null;
}

interface Capela {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  neighborhood: string | null;
}

interface MassWithCapela extends Massa {
  capela?: Capela;
}

export default function MassScheduleDynamic() {
  const [massas, setMassas] = useState<MassWithCapela[]>([]);
  const [capelas, setCapelas] = useState<Record<string, Capela>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch capelas first
        const capelasRes = await fetch("/api/capelas");
        const capelasData = await capelasRes.json();
        const capelasMap = (Array.isArray(capelasData) ? capelasData : []).reduce(
          (acc: Record<string, Capela>, capela: Capela) => {
            acc[capela.id] = capela;
            return acc;
          },
          {}
        );
        setCapelas(capelasMap);

        // Fetch missas
        const missasRes = await fetch("/api/missas");
        const missasData = await missasRes.json();
        const missasWithCapela = (Array.isArray(missasData) ? missasData : []).map((massa: Massa) => ({
          ...massa,
          capela: massa.capela_id ? capelasMap[massa.capela_id] : undefined,
        }));
        setMassas(missasWithCapela);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getDayName = (dayOfWeek: string): string => {
    const days = [
      "Domingo",
      "Segunda-feira",
      "Terça-feira",
      "Quarta-feira",
      "Quinta-feira",
      "Sexta-feira",
      "Sábado",
    ];
    const dayNum = parseInt(dayOfWeek);
    return days[dayNum] || dayOfWeek;
  };

  const getDateForDay = (dayOfWeek: string): string => {
    const dayNum = parseInt(dayOfWeek);
    const today = new Date();
    const currentDay = today.getDay();
    let daysAhead = dayNum - currentDay;

    if (daysAhead <= 0) {
      daysAhead += 7;
    }

    const resultDate = new Date(today);
    resultDate.setDate(resultDate.getDate() + daysAhead);

    return resultDate.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
  };

  const groupedByCapela = massas.reduce(
    (acc, massa) => {
      const capelaId = massa.capela_id || "sem-capela";
      if (!acc[capelaId]) acc[capelaId] = [];
      acc[capelaId].push(massa);
      return acc;
    },
    {} as Record<string, MassWithCapela[]>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-muted-foreground">Carregando horários de missas...</p>
      </div>
    );
  }

  if (massas.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-muted-foreground">Nenhum horário de missa disponível</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {Object.entries(groupedByCapela).map(([capelaId, massasDoCapela]) => {
        const capela =
          capelaId !== "sem-capela"
            ? capelas[capelaId]
            : { name: "Localização a definir", address: null };

        const groupedByDay = massasDoCapela.reduce(
          (acc, massa) => {
            const day = massa.day_of_week;
            if (!acc[day]) acc[day] = [];
            acc[day].push(massa);
            return acc;
          },
          {} as Record<string, MassWithCapela[]>
        );

        return (
          <Card key={capelaId} className="overflow-hidden">
            <CardHeader className="bg-primary/5 border-b border-border pb-4">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-md">
                  <ChurchIcon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <CardTitle className="font-serif text-lg">{capela?.name || "Localização"}</CardTitle>
                  {capela?.address && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                      <MapPin className="h-4 w-4" />
                      <p>{capela.address}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {[0, 1, 2, 3, 4, 5, 6].map((dayNum) => {
                  const dayStr = dayNum.toString();
                  const massasDoDay = groupedByDay[dayStr] || [];

                  if (massasDoDay.length === 0) return null;

                  return (
                    <div key={dayNum} className="px-6 py-4">
                      <div className="flex items-center justify-between gap-4 mb-3">
                        <div>
                          <p className="font-semibold text-sm">{getDayName(dayStr)}</p>
                          <p className="text-xs text-muted-foreground">{getDateForDay(dayStr)}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {massasDoDay.map((massa) => (
                          <div key={massa.id} className="flex items-center gap-2">
                            <Badge variant="secondary" className="gap-1">
                              <Clock className="h-3 w-3" />
                              {massa.time}
                            </Badge>
                            {massa.description && (
                              <span className="text-xs text-muted-foreground">{massa.description}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

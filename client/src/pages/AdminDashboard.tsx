import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Newspaper, Users, Clock, ChurchIcon, TrendingUp } from "lucide-react";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { useToast } from "@/hooks/use-toast";

interface ActivityItem {
  action: string;
  title: string;
  time: string;
}

export default function AdminDashboard() {
  const { isAuthenticated, isLoading, admin } = useAdminAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState([
    { title: "Notícias", value: "0", icon: Newspaper, description: "Publicadas" },
    { title: "Pastorais", value: "0", icon: Users, description: "Cadastradas" },
    { title: "Horários de Missas", value: "0", icon: Clock, description: "Configurados" },
    { title: "Capelas", value: "0", icon: ChurchIcon, description: "Vinculadas" },
  ]);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || isLoading) return;

    // Buscar dados reais das APIs
    const loadData = async () => {
      try {
        const [noticiasRes, pastoraisRes, missasRes, capelasRes] = await Promise.all([
          fetch("/api/noticias"),
          fetch("/api/pastorais"),
          fetch("/api/missas"),
          fetch("/api/capelas"),
        ]);

        const noticias = await noticiasRes.json();
        const pastorais = await pastoraisRes.json();
        const missas = await missasRes.json();
        const capelas = await capelasRes.json();

        // Atualizar stats com dados reais
        setStats([
          { title: "Notícias", value: noticias.length.toString(), icon: Newspaper, description: "Publicadas" },
          { title: "Pastorais", value: pastorais.length.toString(), icon: Users, description: "Cadastradas" },
          { title: "Horários de Missas", value: missas.length.toString(), icon: Clock, description: "Configurados" },
          { title: "Capelas", value: capelas.length.toString(), icon: ChurchIcon, description: "Vinculadas" },
        ]);

        // Montar atividade recente a partir dos dados
        const activities: ActivityItem[] = [];
        
        if (noticias.length > 0) {
          activities.push({
            action: "Notícia publicada",
            title: noticias[0].title,
            time: "Recentemente",
          });
        }
        
        if (pastorais.length > 0) {
          activities.push({
            action: "Pastoral ativa",
            title: pastorais[0].name,
            time: "Cadastrada",
          });
        }
        
        if (missas.length > 0) {
          activities.push({
            action: "Horário de missa",
            title: `${missas[0].time} - ${missas[0].description}`,
            time: "Cadastrado",
          });
        }
        
        if (capelas.length > 0) {
          activities.push({
            action: "Capela cadastrada",
            title: capelas[0].name,
            time: "Cadastrada",
          });
        }

        setRecentActivity(activities.length > 0 ? activities : defaultActivity);
        setStatsLoading(false);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast({
          title: "Erro ao carregar dados",
          description: "Tente recarregar a página.",
          variant: "destructive",
        });
        setRecentActivity(defaultActivity);
        setStatsLoading(false);
      }
    };

    loadData();
  }, [isAuthenticated, isLoading, toast]);

  const defaultActivity: ActivityItem[] = [
    { action: "Sistema", title: "Bem-vindo à dashboard", time: "Agora" },
  ];

  if (isLoading || statsLoading) {
    return (
      <AdminLayout title="Dashboard">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-6">
        {/* Boas-vindas do Admin */}
        {admin && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
            <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-1">
              Bem-vindo, {admin.name || admin.email}! 👋
            </h2>
            <p className="text-blue-700 dark:text-blue-300">
              Você está autenticado e tem acesso total ao painel administrativo.
            </p>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} data-testid={`card-stat-${stat.title.toLowerCase()}`}>
              <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5 text-primary" />
                Atividade Recente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start justify-between gap-4 pb-4 border-b border-border last:border-0 last:pb-0"
                    data-testid={`activity-item-${index}`}
                  >
                    <div>
                      <p className="text-sm font-medium">{item.action}</p>
                      <p className="text-sm text-muted-foreground">{item.title}</p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {item.time}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Acesso Rápido</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Card className="hover-elevate cursor-pointer" data-testid="card-quick-news">
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <Newspaper className="h-8 w-8 text-primary mb-2" />
                    <span className="text-sm font-medium">Nova Notícia</span>
                  </CardContent>
                </Card>
                <Card className="hover-elevate cursor-pointer" data-testid="card-quick-pastoral">
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <Users className="h-8 w-8 text-primary mb-2" />
                    <span className="text-sm font-medium">Nova Pastoral</span>
                  </CardContent>
                </Card>
                <Card className="hover-elevate cursor-pointer" data-testid="card-quick-mass">
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <Clock className="h-8 w-8 text-primary mb-2" />
                    <span className="text-sm font-medium">Horário de Missa</span>
                  </CardContent>
                </Card>
                <Card className="hover-elevate cursor-pointer" data-testid="card-quick-chapel">
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <ChurchIcon className="h-8 w-8 text-primary mb-2" />
                    <span className="text-sm font-medium">Nova Capela</span>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}

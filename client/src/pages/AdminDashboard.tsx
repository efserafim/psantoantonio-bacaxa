import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Newspaper, Users, Clock, ChurchIcon, TrendingUp } from "lucide-react";

// todo: remove mock functionality
const stats = [
  { title: "Notícias", value: "12", icon: Newspaper, description: "Publicadas este mês" },
  { title: "Pastorais", value: "8", icon: Users, description: "Cadastradas" },
  { title: "Horários de Missas", value: "24", icon: Clock, description: "Configurados" },
  { title: "Capelas", value: "4", icon: ChurchIcon, description: "Vinculadas" },
];

// todo: remove mock functionality
const recentActivity = [
  { action: "Notícia publicada", title: "Festa de Santo Antonio 2024", time: "Há 2 horas" },
  { action: "Pastoral atualizada", title: "Pastoral da Família", time: "Há 5 horas" },
  { action: "Horário alterado", title: "Missa de Domingo - 19h", time: "Há 1 dia" },
  { action: "Capela adicionada", title: "Capela São Sebastião", time: "Há 2 dias" },
];

export default function AdminDashboard() {
  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-6">
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

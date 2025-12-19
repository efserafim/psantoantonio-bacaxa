import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

type Massa = {
  id: string;
  capela_id: string;
  day_of_week: number;
  time: string;
  description?: string | null;
};

type Capela = {
  id: string;
  name: string;
};

const DAYS = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

export default function AdminMissas() {
  const [missas, setMissas] = useState<Massa[]>([]);
  const [capelas, setCapelas] = useState<Capela[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    capela_id: "",
    day_of_week: "0",
    time: "09:00",
    description: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [missasRes, capelasRes] = await Promise.all([
        fetch("/api/missas"),
        fetch("/api/capelas"),
      ]);

      const missasData = await missasRes.json();
      const capelasData = await capelasRes.json();

      setMissas(Array.isArray(missasData) ? missasData : []);
      setCapelas(Array.isArray(capelasData) ? capelasData : []);
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.capela_id) {
      toast({
        title: "Erro",
        description: "Selecione uma capela",
        variant: "destructive",
      });
      return;
    }

    try {
      const url = editingId ? `/api/missas/${editingId}` : "/api/missas";
      const method = editingId ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          day_of_week: parseInt(formData.day_of_week),
        }),
      });

      if (!res.ok) throw new Error("Erro ao salvar missa");

      toast({
        title: "Sucesso",
        description: editingId ? "Missa atualizada" : "Missa criada",
      });

      setFormData({
        capela_id: "",
        day_of_week: "0",
        time: "09:00",
        description: "",
      });
      setEditingId(null);
      setFormOpen(false);
      loadData();
    } catch (err) {
      console.error("Erro:", err);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a missa",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (missa: Massa) => {
    setFormData({
      capela_id: missa.capela_id || "",
      day_of_week: missa.day_of_week.toString(),
      time: missa.time,
      description: missa.description || "",
    });
    setEditingId(missa.id);
    setFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja deletar esta missa?")) return;

    try {
      const res = await fetch(`/api/missas/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erro ao deletar");

      toast({
        title: "Sucesso",
        description: "Missa deletada com sucesso",
      });
      loadData();
    } catch (err) {
      console.error("Erro:", err);
      toast({
        title: "Erro",
        description: "Não foi possível deletar a missa",
        variant: "destructive",
      });
    }
  };

  const getCapelName = (capaId: string) => {
    return capelas.find((c) => c.id === capaId)?.name || "Desconhecida";
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Gerenciar Horários de Missa</h1>
          <p className="text-muted-foreground mt-2">
            Adicione, edite ou remova horários de missa
          </p>
        </div>

        <Dialog open={formOpen} onOpenChange={setFormOpen}>
          <DialogTrigger asChild>
            <Button>+ Nova Missa</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Editar Missa" : "Adicionar Nova Missa"}</DialogTitle>
              <DialogDescription>
                {editingId ? "Atualize os detalhes da missa" : "Preencha os detalhes do novo horário de missa"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="capela">Capela *</Label>
                <select
                  id="capela"
                  className="w-full border border-input rounded-md px-3 py-2 text-sm"
                  value={formData.capela_id}
                  onChange={(e) =>
                    setFormData({ ...formData, capela_id: e.target.value })
                  }
                >
                  <option value="">Selecione uma capela</option>
                  {capelas.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="day">Dia da Semana *</Label>
                <select
                  id="day"
                  className="w-full border border-input rounded-md px-3 py-2 text-sm"
                  value={formData.day_of_week}
                  onChange={(e) =>
                    setFormData({ ...formData, day_of_week: e.target.value })
                  }
                >
                  {DAYS.map((day, idx) => (
                    <option key={idx} value={idx.toString()}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="time">Horário *</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) =>
                    setFormData({ ...formData, time: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="description">Descrição</Label>
                <Input
                  id="description"
                  placeholder="Ex: Missa de Dom Fulano"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              <Button type="submit" className="w-full">
                {editingId ? "Atualizar Missa" : "Criar Missa"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        {loading ? (
          <p className="text-center text-muted-foreground">Carregando...</p>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Capela</TableHead>
                  <TableHead>Dia</TableHead>
                  <TableHead>Horário</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {missas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      Nenhuma missa cadastrada
                    </TableCell>
                  </TableRow>
                ) : (
                  missas.map((missa) => (
                    <TableRow key={missa.id}>
                      <TableCell>{getCapelName(missa.capela_id)}</TableCell>
                      <TableCell>{DAYS[missa.day_of_week] || "?"}</TableCell>
                      <TableCell>{missa.time}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {missa.description || "-"}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(missa)}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(missa.id)}
                        >
                          Deletar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

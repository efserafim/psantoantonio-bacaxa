import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import ImageUpload from "@/components/ImageUpload";
import { useToast } from "@/hooks/use-toast";

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

export default function AdminPastorais() {
  const { toast } = useToast();
  const [pastorais, setPastorais] = useState<Pastoral[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [images, setImages] = useState<File[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    coordinator: "",
    email: "",
    phone: "",
    meeting_day: "",
    meeting_time: "",
  });

  useEffect(() => {
    loadPastorais();
  }, []);

  const loadPastorais = async () => {
    try {
      const res = await fetch("/api/pastorais");
      const data = await res.json();
      setPastorais(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erro ao carregar pastorais:", err);
      setPastorais([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formDataObj = new FormData();
    formDataObj.append("name", formData.name);
    formDataObj.append("description", formData.description);
    formDataObj.append("coordinator", formData.coordinator);
    formDataObj.append("email", formData.email);
    formDataObj.append("phone", formData.phone);
    formDataObj.append("meeting_day", formData.meeting_day);
    formDataObj.append("meeting_time", formData.meeting_time);
    formDataObj.append("status", "active");

    if (images.length > 0) {
      formDataObj.append("image", images[0]);
    }

    try {
      const url = editingId ? `/api/pastorais/${editingId}` : "/api/pastorais";
      const method = editingId ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        body: formDataObj,
      });

      if (!res.ok) throw new Error("Erro ao salvar pastoral");

      toast({
        title: "Sucesso",
        description: editingId ? "Pastoral atualizada" : "Pastoral criada",
      });

      setFormData({
        name: "",
        description: "",
        coordinator: "",
        email: "",
        phone: "",
        meeting_day: "",
        meeting_time: "",
      });
      setImages([]);
      setEditingId(null);
      setFormOpen(false);
      loadPastorais();
    } catch (err) {
      console.error("Erro:", err);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a pastoral",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (pastoral: Pastoral) => {
    setFormData({
      name: pastoral.name,
      description: pastoral.description || "",
      coordinator: pastoral.coordinator || "",
      email: pastoral.email || "",
      phone: pastoral.phone || "",
      meeting_day: pastoral.meeting_day || "",
      meeting_time: pastoral.meeting_time || "",
    });
    setEditingId(pastoral.id);
    setFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja deletar esta pastoral?")) return;

    try {
      const res = await fetch(`/api/pastorais/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erro ao deletar");

      toast({
        title: "Sucesso",
        description: "Pastoral deletada com sucesso",
      });
      loadPastorais();
    } catch (err) {
      console.error("Erro:", err);
      toast({
        title: "Erro",
        description: "Não foi possível deletar a pastoral",
        variant: "destructive",
      });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Gerenciar Pastorais</h1>
          <p className="text-muted-foreground mt-2">
            Adicione, edite ou remova pastorais da sua paróquia
          </p>
        </div>

        <Dialog open={formOpen} onOpenChange={setFormOpen}>
          <DialogTrigger asChild>
            <Button>+ Nova Pastoral</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? "Editar Pastoral" : "Nova Pastoral"}</DialogTitle>
              <DialogDescription>
                {editingId ? "Atualize os detalhes da pastoral" : "Preencha os detalhes da nova pastoral"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nome da Pastoral *</Label>
                <Input
                  id="name"
                  placeholder="Ex: Pastoral da Família"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  placeholder="Descreva as atividades e objetivos..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="coordinator">Coordenador</Label>
                  <Input
                    id="coordinator"
                    placeholder="Nome do coordenador"
                    value={formData.coordinator}
                    onChange={(e) =>
                      setFormData({ ...formData, coordinator: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@exemplo.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    placeholder="(11) 98765-4321"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="meeting_day">Dia do Encontro</Label>
                  <Input
                    id="meeting_day"
                    placeholder="Ex: Terças-feiras"
                    value={formData.meeting_day}
                    onChange={(e) =>
                      setFormData({ ...formData, meeting_day: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="meeting_time">Horário</Label>
                  <Input
                    id="meeting_time"
                    placeholder="Ex: 19h30"
                    value={formData.meeting_time}
                    onChange={(e) =>
                      setFormData({ ...formData, meeting_time: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <Label>Foto</Label>
                <ImageUpload
                  images={images}
                  onImagesChange={setImages}
                  maxImages={1}
                  maxSizeMB={15}
                />
              </div>

              <Button type="submit" className="w-full">
                {editingId ? "Atualizar Pastoral" : "Criar Pastoral"}
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
                  <TableHead>Nome</TableHead>
                  <TableHead>Coordenador</TableHead>
                  <TableHead>Dia/Horário</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pastorais.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      Nenhuma pastoral cadastrada
                    </TableCell>
                  </TableRow>
                ) : (
                  pastorais.map((pastoral) => (
                    <TableRow key={pastoral.id}>
                      <TableCell className="font-medium">{pastoral.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {pastoral.coordinator || "-"}
                      </TableCell>
                      <TableCell className="text-sm">
                        {pastoral.meeting_day && pastoral.meeting_time
                          ? `${pastoral.meeting_day} ${pastoral.meeting_time}`
                          : "-"}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(pastoral)}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(pastoral.id)}
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

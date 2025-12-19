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

export default function AdminCapelas() {
  const { toast } = useToast();
  const [capelas, setCapelas] = useState<Capela[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [images, setImages] = useState<File[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    neighborhood: "",
    address: "",
    phone: "",
    description: "",
  });

  useEffect(() => {
    loadCapelas();
  }, []);

  const loadCapelas = async () => {
    try {
      const res = await fetch("/api/capelas");
      const data = await res.json();
      setCapelas(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erro ao carregar capelas:", err);
      setCapelas([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formDataObj = new FormData();
    formDataObj.append("name", formData.name);
    formDataObj.append("neighborhood", formData.neighborhood);
    formDataObj.append("address", formData.address);
    formDataObj.append("phone", formData.phone);
    formDataObj.append("description", formData.description);
    formDataObj.append("status", "active");

    if (images.length > 0) {
      formDataObj.append("image", images[0]);
    }

    try {
      const url = editingId ? `/api/capelas/${editingId}` : "/api/capelas";
      const method = editingId ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        body: formDataObj,
      });

      if (!res.ok) throw new Error("Erro ao salvar capela");

      toast({
        title: "Sucesso",
        description: editingId ? "Capela atualizada" : "Capela criada",
      });

      setFormData({
        name: "",
        neighborhood: "",
        address: "",
        phone: "",
        description: "",
      });
      setImages([]);
      setEditingId(null);
      setFormOpen(false);
      loadCapelas();
    } catch (err) {
      console.error("Erro:", err);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a capela",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (capela: Capela) => {
    setFormData({
      name: capela.name,
      neighborhood: capela.neighborhood || "",
      address: capela.address || "",
      phone: capela.phone || "",
      description: capela.description || "",
    });
    setEditingId(capela.id);
    setFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja deletar esta capela?")) return;

    try {
      const res = await fetch(`/api/capelas/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erro ao deletar");

      toast({
        title: "Sucesso",
        description: "Capela deletada com sucesso",
      });
      loadCapelas();
    } catch (err) {
      console.error("Erro:", err);
      toast({
        title: "Erro",
        description: "Não foi possível deletar a capela",
        variant: "destructive",
      });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Gerenciar Capelas</h1>
          <p className="text-muted-foreground mt-2">
            Adicione, edite ou remova capelas da sua paróquia
          </p>
        </div>

        <Dialog open={formOpen} onOpenChange={setFormOpen}>
          <DialogTrigger asChild>
            <Button>+ Nova Capela</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? "Editar Capela" : "Nova Capela"}</DialogTitle>
              <DialogDescription>
                {editingId ? "Atualize os detalhes da capela" : "Preencha os detalhes da nova capela"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nome da Capela *</Label>
                <Input
                  id="name"
                  placeholder="Ex: Capela Nossa Senhora Aparecida"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="neighborhood">Bairro</Label>
                <Input
                  id="neighborhood"
                  placeholder="Ex: Bairro Novo"
                  value={formData.neighborhood}
                  onChange={(e) =>
                    setFormData({ ...formData, neighborhood: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="address">Endereço</Label>
                <Input
                  id="address"
                  placeholder="Rua, número"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                />
              </div>

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
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  placeholder="Informações sobre a capela..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="min-h-[100px]"
                />
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
                {editingId ? "Atualizar Capela" : "Criar Capela"}
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
                  <TableHead>Bairro</TableHead>
                  <TableHead>Endereço</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {capelas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      Nenhuma capela cadastrada
                    </TableCell>
                  </TableRow>
                ) : (
                  capelas.map((capela) => (
                    <TableRow key={capela.id}>
                      <TableCell className="font-medium">{capela.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {capela.neighborhood || "-"}
                      </TableCell>
                      <TableCell className="text-sm">
                        {capela.address || "-"}
                      </TableCell>
                      <TableCell className="text-sm">
                        {capela.phone || "-"}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(capela)}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(capela.id)}
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

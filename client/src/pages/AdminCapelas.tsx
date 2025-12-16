import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
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
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// todo: remove mock functionality
const mockChapels = [
  { id: 1, name: "Capela Nossa Senhora Aparecida", address: "Av. Brasil, 456 - Bairro Novo", phone: "(00) 1111-1111" },
  { id: 2, name: "Capela São José", address: "Rua das Flores, 789 - Jardim Primavera", phone: "(00) 2222-2222" },
  { id: 3, name: "Capela Santa Luzia", address: "Rua Santa Luzia, 321 - Vila Nova", phone: "(00) 3333-3333" },
  { id: 4, name: "Capela São Sebastião", address: "Praça Central, s/n - Distrito São Sebastião", phone: "(00) 4444-4444" },
];

export default function AdminCapelas() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    description: "",
    images: [] as File[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting chapel:", formData);
    toast({
      title: "Capela salva!",
      description: "A capela foi salva com sucesso.",
    });
    setIsDialogOpen(false);
    setFormData({ name: "", address: "", phone: "", description: "", images: [] });
  };

  const filteredChapels = mockChapels.filter((chapel) =>
    chapel.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout title="Capelas">
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar capelas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              data-testid="input-search-chapels"
            />
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" data-testid="button-add-chapel">
                <Plus className="h-4 w-4" />
                Nova Capela
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-serif">Nova Capela</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome da Capela</Label>
                  <Input
                    id="name"
                    placeholder="Ex: Capela Nossa Senhora Aparecida"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    data-testid="input-chapel-name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Endereço</Label>
                  <Input
                    id="address"
                    placeholder="Rua, número, bairro"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    data-testid="input-chapel-address"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    placeholder="(00) 0000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    data-testid="input-chapel-phone"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    placeholder="Informações adicionais sobre a capela..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="min-h-[100px]"
                    data-testid="input-chapel-description"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Foto da Capela</Label>
                  <ImageUpload
                    images={formData.images}
                    onImagesChange={(images) => setFormData({ ...formData, images })}
                    maxImages={1}
                    maxSizeMB={15}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" data-testid="button-save-chapel">
                    Salvar Capela
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Endereço</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredChapels.map((chapel) => (
                  <TableRow key={chapel.id} data-testid={`row-chapel-${chapel.id}`}>
                    <TableCell className="font-medium">{chapel.name}</TableCell>
                    <TableCell>{chapel.address}</TableCell>
                    <TableCell>{chapel.phone}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" data-testid={`button-edit-chapel-${chapel.id}`}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive" data-testid={`button-delete-chapel-${chapel.id}`}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

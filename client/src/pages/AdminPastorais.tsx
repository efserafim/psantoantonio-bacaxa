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
const mockPastorals = [
  { id: 1, name: "Pastoral da Família", meetingDay: "Terças-feiras", meetingTime: "19h30", location: "Salão Paroquial" },
  { id: 2, name: "Pastoral da Juventude", meetingDay: "Sábados", meetingTime: "15h", location: "Centro Comunitário" },
  { id: 3, name: "Pastoral da Criança", meetingDay: "Quartas-feiras", meetingTime: "14h", location: "Casa Paroquial" },
  { id: 4, name: "Pastoral do Dízimo", meetingDay: "1º Sábado do mês", meetingTime: "9h", location: "Salão Paroquial" },
];

export default function AdminPastorais() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    meetingDay: "",
    meetingTime: "",
    location: "",
    images: [] as File[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting pastoral:", formData);
    toast({
      title: "Pastoral salva!",
      description: "A pastoral foi salva com sucesso.",
    });
    setIsDialogOpen(false);
    setFormData({ name: "", description: "", meetingDay: "", meetingTime: "", location: "", images: [] });
  };

  const filteredPastorals = mockPastorals.filter((pastoral) =>
    pastoral.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout title="Pastorais">
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar pastorais..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              data-testid="input-search-pastorals"
            />
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" data-testid="button-add-pastoral">
                <Plus className="h-4 w-4" />
                Nova Pastoral
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-serif">Nova Pastoral</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome da Pastoral</Label>
                  <Input
                    id="name"
                    placeholder="Ex: Pastoral da Família"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    data-testid="input-pastoral-name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    placeholder="Descreva as atividades e objetivos da pastoral..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="min-h-[100px]"
                    data-testid="input-pastoral-description"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="meetingDay">Dia do Encontro</Label>
                    <Input
                      id="meetingDay"
                      placeholder="Ex: Terças-feiras"
                      value={formData.meetingDay}
                      onChange={(e) => setFormData({ ...formData, meetingDay: e.target.value })}
                      data-testid="input-pastoral-day"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="meetingTime">Horário</Label>
                    <Input
                      id="meetingTime"
                      placeholder="Ex: 19h30"
                      value={formData.meetingTime}
                      onChange={(e) => setFormData({ ...formData, meetingTime: e.target.value })}
                      data-testid="input-pastoral-time"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Local</Label>
                    <Input
                      id="location"
                      placeholder="Ex: Salão Paroquial"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      data-testid="input-pastoral-location"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Foto da Pastoral</Label>
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
                  <Button type="submit" data-testid="button-save-pastoral">
                    Salvar Pastoral
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
                  <TableHead>Dia</TableHead>
                  <TableHead>Horário</TableHead>
                  <TableHead>Local</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPastorals.map((pastoral) => (
                  <TableRow key={pastoral.id} data-testid={`row-pastoral-${pastoral.id}`}>
                    <TableCell className="font-medium">{pastoral.name}</TableCell>
                    <TableCell>{pastoral.meetingDay}</TableCell>
                    <TableCell>{pastoral.meetingTime}</TableCell>
                    <TableCell>{pastoral.location}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" data-testid={`button-edit-pastoral-${pastoral.id}`}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive" data-testid={`button-delete-pastoral-${pastoral.id}`}>
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

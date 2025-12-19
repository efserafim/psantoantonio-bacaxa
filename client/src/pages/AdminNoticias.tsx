import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Badge } from "@/components/ui/badge";
import RichTextEditor from "@/components/RichTextEditor";
import ImageUpload from "@/components/ImageUpload";
import { Plus, Pencil, Trash2, Eye, Search } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

type News = {
  id: string;
  title: string;
  excerpt?: string | null;
  content?: string | null;
  image_url?: string | null;
  status: string;
  published_at?: number | null;
  created_at?: number | null;
};

export default function AdminNoticias() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    images: [] as File[],
    publishedAt: new Date().toISOString().split('T')[0], // Default to today
  });

  // Fetch news from API
  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/noticias");
      const data = await res.json();
      setNews(data || []);
    } catch (error) {
      console.error("Erro ao carregar notícias:", error);
      toast({ title: "Erro", description: "Não foi possível carregar as notícias." });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append("title", formData.title);
      fd.append("excerpt", formData.excerpt || formData.content?.slice(0, 200) || "");
      fd.append("content", formData.content);
      fd.append("status", "published");
      fd.append("publishedAt", new Date(formData.publishedAt).toISOString());
      
      if (formData.images && formData.images[0]) {
        fd.append("image", formData.images[0]);
      }

      const res = await fetch("/api/noticias", {
        method: "POST",
        body: fd,
      });

      if (!res.ok) throw new Error("Erro ao criar notícia");
      
      await res.json();
      toast({ title: "Sucesso!", description: "Notícia publicada com sucesso." });
      setFormData({ title: "", excerpt: "", content: "", images: [], publishedAt: new Date().toISOString().split('T')[0] });
      setIsDialogOpen(false);
      await fetchNews();
    } catch (error) {
      console.error(error);
      toast({ title: "Erro", description: "Não foi possível salvar a notícia." });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja deletar esta notícia?")) return;
    
    try {
      const res = await fetch(`/api/noticias/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erro ao deletar");
      
      toast({ title: "Sucesso!", description: "Notícia deletada." });
      await fetchNews();
    } catch (error) {
      console.error(error);
      toast({ title: "Erro", description: "Não foi possível deletar a notícia." });
    }
  };

  const formatDate = (timestamp: number | null | undefined) => {
    if (!timestamp) return "-";
    return format(new Date(timestamp * 1000), "dd/MM/yyyy", { locale: ptBR });
  };

  const filteredNews = news.filter((n) =>
    n.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout title="Notícias">
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar notícias..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              data-testid="input-search-news"
            />
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" data-testid="button-add-news">
                <Plus className="h-4 w-4" />
                Nova Notícia
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
              <DialogHeader>
                <DialogTitle className="font-serif">Nova Notícia</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto flex-1 pr-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    placeholder="Digite o título da notícia"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    data-testid="input-news-title"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="excerpt">Resumo (Opcional)</Label>
                    <Input
                      id="excerpt"
                      placeholder="Resumo da notícia"
                      value={formData.excerpt}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="publishedAt">Data de Publicação</Label>
                    <Input
                      id="publishedAt"
                      type="date"
                      value={formData.publishedAt}
                      onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Conteúdo</Label>
                  <RichTextEditor
                    content={formData.content}
                    onChange={(content) => setFormData({ ...formData, content })}
                    placeholder="Escreva o conteúdo da notícia..."
                  />
                </div>

                <div className="space-y-2">
                  <Label>Imagem</Label>
                  <ImageUpload
                    images={formData.images}
                    onImagesChange={(images) => setFormData({ ...formData, images })}
                    maxImages={1}
                    maxSizeMB={15}
                  />
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" data-testid="button-save-news">
                    Publicar Notícia
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 text-center text-muted-foreground">Carregando notícias...</div>
            ) : filteredNews.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">Nenhuma notícia encontrada</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredNews.map((n) => (
                    <TableRow key={n.id} data-testid={`row-news-${n.id}`}>
                      <TableCell className="font-medium">{n.title}</TableCell>
                      <TableCell>
                        <Badge variant={n.status === "published" ? "default" : "secondary"}>
                          {n.status === "published" ? "Publicada" : "Rascunho"}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(n.published_at)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" data-testid={`button-view-news-${n.id}`}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" data-testid={`button-edit-news-${n.id}`}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-destructive" 
                            data-testid={`button-delete-news-${n.id}`}
                            onClick={() => handleDelete(n.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

import { useState } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Clock, ChurchIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// todo: remove mock functionality
const mockSchedules = [
  {
    id: 1,
    chapel: "Igreja Matriz Santo Antonio",
    schedules: [
      { day: "Domingo", times: ["7h", "9h", "11h", "19h"] },
      { day: "Segunda a Sexta", times: ["7h", "18h"] },
      { day: "Sábado", times: ["7h", "17h"] },
    ],
  },
  {
    id: 2,
    chapel: "Capela Nossa Senhora Aparecida",
    schedules: [
      { day: "Domingo", times: ["8h", "18h"] },
      { day: "Quarta-feira", times: ["19h"] },
    ],
  },
];

// todo: remove mock functionality
const chapels = [
  "Igreja Matriz Santo Antonio",
  "Capela Nossa Senhora Aparecida",
  "Capela São José",
  "Capela Santa Luzia",
];

export default function AdminMissas() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    chapel: "",
    day: "",
    time: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting mass schedule:", formData);
    toast({
      title: "Horário salvo!",
      description: "O horário de missa foi salvo com sucesso.",
    });
    setIsDialogOpen(false);
    setFormData({ chapel: "", day: "", time: "" });
  };

  return (
    <AdminLayout title="Horários de Missas">
      <div className="space-y-6">
        <div className="flex justify-end">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" data-testid="button-add-mass">
                <Plus className="h-4 w-4" />
                Adicionar Horário
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-serif">Novo Horário de Missa</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="chapel">Capela / Igreja</Label>
                  <Select
                    value={formData.chapel}
                    onValueChange={(value) => setFormData({ ...formData, chapel: value })}
                  >
                    <SelectTrigger data-testid="select-mass-chapel">
                      <SelectValue placeholder="Selecione a capela" />
                    </SelectTrigger>
                    <SelectContent>
                      {chapels.map((chapel) => (
                        <SelectItem key={chapel} value={chapel}>
                          {chapel}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="day">Dia da Semana</Label>
                  <Select
                    value={formData.day}
                    onValueChange={(value) => setFormData({ ...formData, day: value })}
                  >
                    <SelectTrigger data-testid="select-mass-day">
                      <SelectValue placeholder="Selecione o dia" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Domingo">Domingo</SelectItem>
                      <SelectItem value="Segunda-feira">Segunda-feira</SelectItem>
                      <SelectItem value="Terça-feira">Terça-feira</SelectItem>
                      <SelectItem value="Quarta-feira">Quarta-feira</SelectItem>
                      <SelectItem value="Quinta-feira">Quinta-feira</SelectItem>
                      <SelectItem value="Sexta-feira">Sexta-feira</SelectItem>
                      <SelectItem value="Sábado">Sábado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Horário</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    data-testid="input-mass-time"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" data-testid="button-save-mass">
                    Salvar Horário
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-6">
          {mockSchedules.map((schedule) => (
            <Card key={schedule.id} data-testid={`card-schedule-${schedule.id}`}>
              <CardHeader className="bg-primary/5 border-b border-border">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <ChurchIcon className="h-5 w-5 text-primary" />
                  {schedule.chapel}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {schedule.schedules.map((item, index) => (
                    <div key={index} className="flex items-center justify-between gap-4 px-6 py-4">
                      <span className="font-medium">{item.day}</span>
                      <div className="flex flex-wrap items-center gap-2">
                        {item.times.map((time, timeIndex) => (
                          <Badge key={timeIndex} variant="secondary" className="gap-1">
                            <Clock className="h-3 w-3" />
                            {time}
                          </Badge>
                        ))}
                        <div className="flex gap-1 ml-2">
                          <Button variant="ghost" size="icon" data-testid={`button-edit-time-${index}`}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-destructive" data-testid={`button-delete-time-${index}`}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

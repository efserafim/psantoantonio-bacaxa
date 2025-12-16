import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MapPin, Phone, Clock } from "lucide-react";

interface ChapelCardProps {
  id: number;
  name: string;
  address: string;
  phone?: string;
  massSchedule?: string;
  imageUrl?: string;
}

export default function ChapelCard({
  id,
  name,
  address,
  phone,
  massSchedule,
  imageUrl,
}: ChapelCardProps) {
  return (
    <Card className="overflow-hidden hover-elevate" data-testid={`card-chapel-${id}`}>
      {imageUrl && (
        <div className="aspect-video overflow-hidden">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardHeader className="pb-2">
        <h3 className="font-serif font-semibold text-lg">{name}</h3>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-primary" />
          <span>{address}</span>
        </div>
        {phone && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="h-4 w-4 shrink-0 text-primary" />
            <span>{phone}</span>
          </div>
        )}
        {massSchedule && (
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4 shrink-0 mt-0.5 text-primary" />
            <span>{massSchedule}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

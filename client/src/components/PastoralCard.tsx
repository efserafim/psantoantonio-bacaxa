import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, MapPin } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface PastoralCardProps {
  id: string | number;
  name: string;
  description: string;
  imageUrl?: string;
  meetingDay?: string;
  meetingTime?: string;
  location?: string;
  coordinator?: string;
}

export default function PastoralCard({
  id,
  name,
  description,
  imageUrl,
  meetingDay,
  meetingTime,
  location,
  coordinator,
}: PastoralCardProps) {
  return (
    <Card className="overflow-hidden hover-elevate" data-testid={`card-pastoral-${id}`}>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row gap-6">
          <Avatar className="h-24 w-24 shrink-0 border-4 border-primary/20 mx-auto sm:mx-0">
            <AvatarImage src={imageUrl} alt={name} />
            <AvatarFallback className="bg-primary/10 text-primary text-2xl font-serif">
              {name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 text-center sm:text-left">
            <h3 className="font-serif font-semibold text-xl mb-2">{name}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
              {description}
            </p>
            
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm text-muted-foreground">
              {meetingDay && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span>{meetingDay}</span>
                </div>
              )}
              {meetingTime && (
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>{meetingTime}</span>
                </div>
              )}
              {location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>{location}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

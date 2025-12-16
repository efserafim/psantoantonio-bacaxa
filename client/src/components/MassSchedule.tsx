import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, ChurchIcon } from "lucide-react";

interface MassTime {
  day: string;
  times: string[];
}

interface MassScheduleProps {
  chapel: string;
  address?: string;
  schedule: MassTime[];
}

export default function MassSchedule({ chapel, address, schedule }: MassScheduleProps) {
  return (
    <Card className="overflow-hidden" data-testid={`card-mass-${chapel.toLowerCase().replace(/\s/g, '-')}`}>
      <CardHeader className="bg-primary/5 border-b border-border pb-4">
        <div className="flex items-start gap-3">
          <div className="bg-primary/10 p-2 rounded-md">
            <ChurchIcon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="font-serif text-lg">{chapel}</CardTitle>
            {address && (
              <p className="text-sm text-muted-foreground mt-1">{address}</p>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {schedule.map((item, index) => (
            <div key={index} className="flex items-center justify-between gap-4 px-6 py-4">
              <span className="font-medium text-sm">{item.day}</span>
              <div className="flex flex-wrap items-center justify-end gap-2">
                {item.times.map((time, timeIndex) => (
                  <Badge key={timeIndex} variant="secondary" className="gap-1">
                    <Clock className="h-3 w-3" />
                    {time}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

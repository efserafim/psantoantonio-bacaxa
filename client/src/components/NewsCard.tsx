import { Link } from "wouter";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface NewsCardProps {
  id: string | number;
  title: string;
  excerpt: string;
  imageUrl?: string;
  publishedAt: string | Date;
}

export default function NewsCard({ id, title, excerpt, imageUrl, publishedAt }: NewsCardProps) {
  let date = new Date(publishedAt);
  
  // If publishedAt is a number, it might be Unix timestamp in seconds
  if (typeof publishedAt === 'number') {
    // If it looks like seconds (reasonable timestamp), convert to milliseconds
    if (publishedAt < 10000000000) {
      date = new Date(publishedAt * 1000);
    }
  }
  
  // Check if date is valid and not the Unix epoch
  const isValidDate = date instanceof Date && !isNaN(date.getTime()) && date.getTime() !== 0;
  
  return (
    <Link href={`/noticias/${id}`}>
      <Card className="group overflow-hidden hover-elevate cursor-pointer h-full" data-testid={`card-news-${id}`}>
        {imageUrl && (
          <div className="aspect-video overflow-hidden">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Calendar className="h-4 w-4" />
            <span>{isValidDate ? format(date, "d 'de' MMMM, yyyy", { locale: ptBR }) : format(new Date(), "d 'de' MMMM, yyyy", { locale: ptBR })}</span>
          </div>
          <h3 className="font-serif font-semibold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
            {excerpt}
          </p>
          <span className="inline-block mt-3 text-sm font-medium text-primary">
            Leia mais
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}

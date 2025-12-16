import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Calendar, Clock } from "lucide-react";
import churchImage from "@assets/generated_images/santo_antonio_church_exterior.png";

export default function HeroSection() {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${churchImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-primary/70 via-primary/60 to-primary/80" />
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
          Paróquia Santo Antonio
        </h1>
        <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
          Uma comunidade de fé acolhedora, celebrando a palavra de Deus e servindo ao próximo com amor e dedicação.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/missas">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 gap-2" data-testid="button-hero-missas">
              <Clock className="h-5 w-5" />
              Horários das Missas
            </Button>
          </Link>
          <Link href="/noticias">
            <Button size="lg" variant="outline" className="border-white/30 text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm gap-2" data-testid="button-hero-noticias">
              <Calendar className="h-5 w-5" />
              Últimas Notícias
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

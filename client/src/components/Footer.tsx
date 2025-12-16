import { Link } from "wouter";
import { ChurchIcon, MapPin, Phone, Mail, Clock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white/10 p-2 rounded-md">
                <ChurchIcon className="h-6 w-6" />
              </div>
              <span className="font-serif text-lg font-bold">Paróquia Santo Antonio</span>
            </div>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              Uma comunidade de fé, esperança e caridade, servindo a Deus e ao próximo.
            </p>
          </div>

          <div>
            <h3 className="font-serif font-semibold mb-4">Contato</h3>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <span>Rua da Igreja, 123 - Centro</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0" />
                <span>(00) 0000-0000</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0" />
                <span>contato@paroquiasantoantonio.com</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif font-semibold mb-4">Horários</h3>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li className="flex items-start gap-2">
                <Clock className="h-4 w-4 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-primary-foreground">Secretaria</p>
                  <p>Seg a Sex: 8h às 17h</p>
                </div>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/noticias" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors" data-testid="link-footer-noticias">
                  Notícias
                </Link>
              </li>
              <li>
                <Link href="/pastorais" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors" data-testid="link-footer-pastorais">
                  Pastorais
                </Link>
              </li>
              <li>
                <Link href="/missas" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors" data-testid="link-footer-missas">
                  Horários das Missas
                </Link>
              </li>
              <li>
                <Link href="/capelas" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors" data-testid="link-footer-capelas">
                  Capelas
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center text-sm text-primary-foreground/50">
          <p>&copy; {new Date().getFullYear()} Paróquia Santo Antonio. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

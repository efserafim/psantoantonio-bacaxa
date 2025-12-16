import PageLayout from "@/components/PageLayout";
import PastoralCard from "@/components/PastoralCard";

// todo: remove mock functionality
const mockPastorals = [
  {
    id: 1,
    name: "Pastoral da Família",
    description: "Acolhimento e acompanhamento de famílias em diferentes etapas da vida matrimonial e familiar. Oferecemos encontros de casais, preparação para o matrimônio e apoio em momentos difíceis.",
    meetingDay: "Terças-feiras",
    meetingTime: "19h30",
    location: "Salão Paroquial",
  },
  {
    id: 2,
    name: "Pastoral da Juventude",
    description: "Espaço de encontro, formação e vivência da fé para jovens de 15 a 30 anos. Desenvolvemos atividades de espiritualidade, serviço comunitário e lazer.",
    meetingDay: "Sábados",
    meetingTime: "15h",
    location: "Centro Comunitário",
  },
  {
    id: 3,
    name: "Pastoral da Criança",
    description: "Acompanhamento de gestantes e crianças até 6 anos de idade, promovendo saúde, nutrição e educação integral das famílias mais vulneráveis.",
    meetingDay: "Quartas-feiras",
    meetingTime: "14h",
    location: "Casa Paroquial",
  },
  {
    id: 4,
    name: "Pastoral do Dízimo",
    description: "Formação e conscientização sobre a espiritualidade do dízimo como expressão de fé e compromisso com a comunidade.",
    meetingDay: "1º Sábado do mês",
    meetingTime: "9h",
    location: "Salão Paroquial",
  },
  {
    id: 5,
    name: "Pastoral da Comunicação",
    description: "Responsável pela divulgação das atividades paroquiais através de redes sociais, boletins e site, evangelizando através dos meios de comunicação.",
    meetingDay: "Segundas-feiras",
    meetingTime: "20h",
    location: "Secretaria",
  },
  {
    id: 6,
    name: "Pastoral do Batismo",
    description: "Preparação e acompanhamento dos pais e padrinhos para o sacramento do Batismo, com encontros formativos sobre a responsabilidade cristã.",
    meetingDay: "Últimas Quintas do mês",
    meetingTime: "19h",
    location: "Igreja Matriz",
  },
];

export default function Pastorais() {
  return (
    <PageLayout>
      <div className="bg-primary/5 py-12 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold">Pastorais</h1>
          <p className="text-muted-foreground mt-2">
            Conheça os grupos que fortalecem nossa comunidade e participe
          </p>
        </div>
      </div>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mockPastorals.map((pastoral) => (
              <PastoralCard key={pastoral.id} {...pastoral} />
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}

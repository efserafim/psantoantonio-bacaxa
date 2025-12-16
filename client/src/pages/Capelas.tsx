import PageLayout from "@/components/PageLayout";
import ChapelCard from "@/components/ChapelCard";

// todo: remove mock functionality
const mockChapels = [
  {
    id: 1,
    name: "Capela Nossa Senhora Aparecida",
    address: "Av. Brasil, 456 - Bairro Novo",
    phone: "(00) 1111-1111",
    massSchedule: "Dom: 8h e 18h | Qua: 19h | Sáb: 18h",
    imageUrl: "https://images.unsplash.com/photo-1548625149-fc4a29cf7092?w=600&h=400&fit=crop",
  },
  {
    id: 2,
    name: "Capela São José",
    address: "Rua das Flores, 789 - Jardim Primavera",
    phone: "(00) 2222-2222",
    massSchedule: "Dom: 9h30 | Sex: 19h",
    imageUrl: "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=600&h=400&fit=crop",
  },
  {
    id: 3,
    name: "Capela Santa Luzia",
    address: "Rua Santa Luzia, 321 - Vila Nova",
    phone: "(00) 3333-3333",
    massSchedule: "Dom: 10h | Qui: 19h",
    imageUrl: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=600&h=400&fit=crop",
  },
  {
    id: 4,
    name: "Capela São Sebastião",
    address: "Praça Central, s/n - Distrito São Sebastião",
    phone: "(00) 4444-4444",
    massSchedule: "Dom: 7h30 | Ter e Qui: 18h",
    imageUrl: "https://images.unsplash.com/photo-1473177027534-53d906e9abcf?w=600&h=400&fit=crop",
  },
];

export default function Capelas() {
  return (
    <PageLayout>
      <div className="bg-primary/5 py-12 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold">Capelas</h1>
          <p className="text-muted-foreground mt-2">
            Conheça as comunidades que fazem parte da nossa paróquia
          </p>
        </div>
      </div>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockChapels.map((chapel) => (
              <ChapelCard key={chapel.id} {...chapel} />
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}

import PageLayout from "@/components/PageLayout";
import MassSchedule from "@/components/MassSchedule";

// todo: remove mock functionality
const mockSchedules = [
  {
    chapel: "Igreja Matriz Santo Antonio",
    address: "Rua da Igreja, 123 - Centro",
    schedule: [
      { day: "Domingo", times: ["7h", "9h", "11h", "19h"] },
      { day: "Segunda-feira", times: ["7h", "18h"] },
      { day: "Terça-feira", times: ["7h", "18h"] },
      { day: "Quarta-feira", times: ["7h", "18h"] },
      { day: "Quinta-feira", times: ["7h", "18h"] },
      { day: "Sexta-feira", times: ["7h", "18h"] },
      { day: "Sábado", times: ["7h", "17h"] },
    ],
  },
  {
    chapel: "Capela Nossa Senhora Aparecida",
    address: "Av. Brasil, 456 - Bairro Novo",
    schedule: [
      { day: "Domingo", times: ["8h", "18h"] },
      { day: "Quarta-feira", times: ["19h"] },
      { day: "Sábado", times: ["18h"] },
    ],
  },
  {
    chapel: "Capela São José",
    address: "Rua das Flores, 789 - Jardim Primavera",
    schedule: [
      { day: "Domingo", times: ["9h30"] },
      { day: "Sexta-feira", times: ["19h"] },
    ],
  },
];

export default function Missas() {
  return (
    <PageLayout>
      <div className="bg-primary/5 py-12 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold">Horários das Missas</h1>
          <p className="text-muted-foreground mt-2">
            Confira os horários das celebrações em nossa paróquia e capelas
          </p>
        </div>
      </div>

      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {mockSchedules.map((schedule, index) => (
              <MassSchedule key={index} {...schedule} />
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}

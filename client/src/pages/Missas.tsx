import PageLayout from "@/components/PageLayout";
import MassScheduleModern from "@/components/MassScheduleModern";

export default function Missas() {
  return (
    <PageLayout>
      <div className="bg-gradient-to-b from-primary/5 to-transparent py-12 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-4xl sm:text-5xl font-bold mb-3">Horários de Missa</h1>
          <p className="text-lg text-muted-foreground">Participe das celebrações eucarísticas em nossa comunidade</p>
        </div>
      </div>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <MassScheduleModern />
        </div>
      </section>
    </PageLayout>
  );
}


import PageLayout from "@/components/PageLayout";
import MassScheduleDynamic from "@/components/MassScheduleDynamic";

export default function Missas() {
  return (
    <PageLayout>
      <div className="bg-primary/5 py-12 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold">Horários de Missa</h1>
          <p className="text-muted-foreground mt-2">Confira os horários de celebração em nossa comunidade</p>
        </div>
      </div>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <MassScheduleDynamic />
        </div>
      </section>
    </PageLayout>
  );
}


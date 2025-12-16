import ChapelCard from "../ChapelCard";

export default function ChapelCardExample() {
  return (
    <div className="max-w-sm">
      <ChapelCard
        id={1}
        name="Capela Nossa Senhora Aparecida"
        address="Av. Brasil, 456 - Bairro Novo"
        phone="(00) 1111-1111"
        massSchedule="Dom: 8h e 18h | Qua: 19h | Sáb: 18h"
        imageUrl="https://images.unsplash.com/photo-1548625149-fc4a29cf7092?w=600&h=400&fit=crop"
      />
    </div>
  );
}

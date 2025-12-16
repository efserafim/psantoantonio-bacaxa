import PastoralCard from "../PastoralCard";

export default function PastoralCardExample() {
  return (
    <div className="max-w-xl">
      <PastoralCard
        id={1}
        name="Pastoral da Família"
        description="Acolhimento e acompanhamento de famílias em diferentes etapas da vida matrimonial e familiar."
        meetingDay="Terças-feiras"
        meetingTime="19h30"
        location="Salão Paroquial"
      />
    </div>
  );
}

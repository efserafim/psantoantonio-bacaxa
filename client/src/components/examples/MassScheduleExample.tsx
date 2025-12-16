import MassSchedule from "../MassSchedule";

export default function MassScheduleExample() {
  return (
    <div className="max-w-lg">
      <MassSchedule
        chapel="Igreja Matriz Santo Antonio"
        address="Rua da Igreja, 123 - Centro"
        schedule={[
          { day: "Domingo", times: ["7h", "9h", "11h", "19h"] },
          { day: "Segunda a Sexta", times: ["7h", "18h"] },
          { day: "Sábado", times: ["7h", "17h"] },
        ]}
      />
    </div>
  );
}

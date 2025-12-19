import { db } from "../server/db";
import { massas, capelas } from "../shared/schema";

async function addSampleData() {
  try {
    console.log("📋 Adicionando dados de exemplo...\n");

    // Adicionar capelas
    const capelasSample = [
      {
        name: "Capela Santo Expedito",
        neighborhood: "Bacaxa",
        address: "Rua da Esperança, 50",
        phone: "(xx) 99999-9999",
        description: "Capela da comunidade",
        status: "active",
      },
      {
        name: "Igreja Matriz de Santo Antônio",
        neighborhood: "Centro",
        address: "Praça Santo Antônio s/n",
        phone: "(xx) 99999-9998",
        description: "Igreja principal da paróquia",
        status: "active",
      },
    ];

    const insertedCapelas = [];
    for (const capela of capelasSample) {
      const result = await db.insert(capelas).values(capela);
      console.log(`✅ Capela criada: ${capela.name}`);
      insertedCapelas.push(capela);
    }

    // Buscar IDs das capelas criadas
    const allCapelas = await db.select().from(capelas);
    const capelaMap = allCapelas.reduce((acc, c) => {
      acc[c.name] = c.id;
      return acc;
    }, {} as Record<string, string>);

    console.log("\n📍 Adicionando horários de missas...\n");

    // Adicionar missas para a Capela Santo Expedito
    const massasSample = [
      // Domingo (0)
      { capela_id: capelaMap["Capela Santo Expedito"], day_of_week: "0", time: "07:00", description: "Missa da manhã" },
      { capela_id: capelaMap["Capela Santo Expedito"], day_of_week: "0", time: "19:00", description: "Missa da noite" },
      
      // Segunda a Sexta (1-5)
      { capela_id: capelaMap["Igreja Matriz de Santo Antônio"], day_of_week: "1", time: "19:00", description: "Missa de segunda-feira" },
      { capela_id: capelaMap["Igreja Matriz de Santo Antônio"], day_of_week: "2", time: "19:00", description: "Missa de terça-feira" },
      { capela_id: capelaMap["Igreja Matriz de Santo Antônio"], day_of_week: "3", time: "19:00", description: "Missa de quarta-feira" },
      { capela_id: capelaMap["Igreja Matriz de Santo Antônio"], day_of_week: "4", time: "19:00", description: "Missa de quinta-feira" },
      { capela_id: capelaMap["Igreja Matriz de Santo Antônio"], day_of_week: "5", time: "19:00", description: "Missa de sexta-feira" },
      
      // Sábado (6)
      { capela_id: capelaMap["Igreja Matriz de Santo Antônio"], day_of_week: "6", time: "18:00", description: "Missa do sábado" },
    ];

    for (const massa of massasSample) {
      await db.insert(massas).values(massa);
      console.log(`✅ Missa adicionada: ${massa.time} - ${massa.description}`);
    }

    console.log("\n✅ Dados adicionados com sucesso!");
    process.exit(0);
  } catch (error: any) {
    console.error("❌ Erro ao adicionar dados:", error.message);
    process.exit(1);
  }
}

addSampleData();

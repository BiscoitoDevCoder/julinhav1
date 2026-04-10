import fs from "fs";
import { PREFIX } from "../../../config.js";
import { onlyNumbers } from "../../../utils/index.js";

export default {
  name: "namoroforcado",
  description: "Força um namoro entre dois usuários (Somente Dono).",
  commands: ["fnamoro", "casarforcado"],
  usage: `${PREFIX}fnamoro @usuario1 @usuario2`,
  handle: async ({ sendReply, args, isGroup }) => {
    if (!isGroup) return;

    // Verifica se mencionou duas pessoas
    if (args.length < 2) {
      return await sendReply(`⚠️ Uso correto: ${PREFIX}fnamoro @usuario1 @usuario2`);
    }

    const target1 = `${onlyNumbers(args[0])}@lid`;
    const target2 = `${onlyNumbers(args[1])}@lid`;

    if (target1 === target2) {
      return await sendReply("⚠️ Eles não podem casar com eles mesmos, nem forçado! 😂");
    }

    // --- SALVANDO NA DATABASE ---
    const dbPath = "./database/casais.json";
    if (!fs.existsSync("./database")) fs.mkdirSync("./database");
    
    const db = fs.existsSync(dbPath) ? JSON.parse(fs.readFileSync(dbPath, "utf-8")) : {};

    // Registra o casal (usando o target2 como chave)
    db[target2] = {
      de: target1,
      para: target2,
      data: new Date().toLocaleDateString('pt-BR')
    };

    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    // ----------------------------

    const num1 = onlyNumbers(target1);
    const num2 = onlyNumbers(target2);

    await sendReply(
      `🔨 *NAMORO FORÇADO PELO PADRE JADSON* 🔨\n\n` +
      `O Padre decretou e agora é oficial:\n` +
      `@${num1} ❤️ @${num2}\n\n` +
      `_Não adianta reclamar, já está no banco de dados!_ 💍`,
      [target1, target2]
    );
  },
};
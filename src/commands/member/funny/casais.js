import fs from "fs";
import { PREFIX } from "../../../config.js";
import { onlyNumbers } from "../../../utils/index.js";

export default {
  name: "casais",
  description: "Lista todos os casais oficiais do bot!",
  commands: ["casais", "namorados", "lista-casais"],
  usage: `${PREFIX}casais`,
  handle: async ({ sendReply, isGroup }) => {
    if (!isGroup) return;

    const dbPath = "./database/casais.json";

    if (!fs.existsSync(dbPath)) {
      return await sendReply("⚠️ Ainda não existem casais oficiais registrados.");
    }

    const casais = JSON.parse(fs.readFileSync(dbPath, "utf-8"));
    const listaCasais = Object.values(casais);

    if (listaCasais.length === 0) {
      return await sendReply("⚠️ A lista de casais está vazia no momento.");
    }

    let texto = "👩‍❤️‍👨 *CASAIS OFICIAIS DO MANICÔMIO* 👩‍❤️‍👨\n\n";
    const mentions = [];

    listaCasais.forEach((casal, index) => {
      const deNum = onlyNumbers(casal.de);
      const paraNum = onlyNumbers(casal.para);
      texto += `${index + 1}. @${deNum} ❤️ @${paraNum}\n`;
      mentions.push(casal.de, casal.para);
    });

    texto += "\n_Que o amor (ou o bot) dure para sempre!_";

    await sendReply(texto, mentions);
  },
};
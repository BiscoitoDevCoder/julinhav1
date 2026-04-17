import fs from "fs";
import path from "node:path";
import { PREFIX } from "../../config.js";

export default {
  name: "fdivorcio",
  description: "Anula um casamento oficialmente (Somente Dono).",
  commands: ["fdivorcio", "anular", "juiz"],
  usage: `${PREFIX}fdivorcio @usuario`,
  handle: async ({ sendReply, isGroup, args }) => {
    if (!isGroup) return;

    // 1. Extrai o número do alvo limpando qualquer caractere extra
    const texto = args.join(" ");
    const numeroEncontrado = texto.match(/\d{8,}/g);

    if (!numeroEncontrado) {
      return await sendReply(`⚠️ O tribunal exige a identificação do réu!\n\nExemplo: ${PREFIX}fdivorcio @user`);
    }

    const alvoLid = `${numeroEncontrado[0]}@lid`;
    const dbPath = path.join(process.cwd(), "database", "casais.json");

    if (!fs.existsSync(dbPath)) {
      return await sendReply("⚠️ Não há registros de união estável nesta comarca.");
    }

    const db = JSON.parse(fs.readFileSync(dbPath, "utf-8"));
    
    // Procura o processo de casamento
    const casalId = Object.keys(db).find(key => db[key].de === alvoLid || db[key].para === alvoLid);

    if (!casalId) {
      return await sendReply("⚠️ Este indivíduo não possui um vínculo matrimonial registrado.");
    }

    const casal = db[casalId];
    const parceiro1 = casal.de;
    const parceiro2 = casal.para;

    // Remove da database (Anulação do contrato)
    delete db[casalId];
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

    const num1 = parceiro1.split('@')[0];
    const num2 = parceiro2.split('@')[0];

    await sendReply(
      `⚖️ *SENTENÇA PROFERIDA PELO TRIBUNAL* ⚖️\n\n` +
      `O *Excelentíssimo Juiz Jadson* analisou os autos e decretou a anulação imediata da união entre:\n\n` +
      `👤 @${num1}\n` +
      `👤 @${num2}\n\n` +
      `_A sentença é irrecorrível. O contrato foi triturado e as partes estão oficialmente solteiras!_ 🏛️🔨`,
      [parceiro1, parceiro2]
    );
  },
};
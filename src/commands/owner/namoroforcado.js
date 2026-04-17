import fs from "fs";
import path from "node:path";
import { PREFIX } from "../../config.js";

export default {
  name: "namoroforcado",
  description: "Força um namoro entre dois usuários (Somente Dono).",
  commands: ["fnamoro", "casarforcado"],
  usage: `${PREFIX}fnamoro @usuario1 @usuario2`,
  handle: async ({ sendReply, isGroup, msg, args }) => {
    if (!isGroup) return;

    // 1. Pega o texto dos argumentos (se vierem como ['@123', '@456']) ou da mensagem
    const textoMensagem = args.join(" ") || "";
    
    // 2. EXTRAI APENAS OS NÚMEROS (Regex que limpa tudo o que não for dígito)
    // Isso remove o "@" inicial que o seu bot está mandando no args
    const numerosEncontrados = textoMensagem.match(/\d{8,}/g);

    if (!numerosEncontrados || numerosEncontrados.length < 2) {
      return await sendReply(`⚠️ O Padre Jadson não encontrou os números dos noivos!\n\nCertifique-se de marcar ou digitar dois números.\nExemplo: ${PREFIX}fnamoro @user1 @user2`);
    }

    // 3. MONTA O ID CORRETAMENTE: numero@lid
    const target1 = `${numerosEncontrados[0]}@lid`;
    const target2 = `${numerosEncontrados[1]}@lid`;

    // --- LÓGICA DE DATABASE ---
    const rootPath = process.cwd(); 
    const dbDir = path.join(rootPath, "database");
    const dbPath = path.join(dbDir, "casais.json");

    if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
    
    const db = fs.existsSync(dbPath) ? JSON.parse(fs.readFileSync(dbPath, "utf-8")) : {};

    // Registra na DB usando o ID limpo
    db[target2] = {
      de: target1,
      para: target2,
      data: new Date().toLocaleDateString('pt-BR')
    };

    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

    await sendReply(
      `🔨 *NAMORO FORÇADO PELO PADRE JADSON* 🔨\n\n` +
      `O Padre decretou e agora é oficial:\n` +
      `@${numerosEncontrados[0]} ❤️ @${numerosEncontrados[1]}\n\n` +
      `_Não adianta reclamar, já está no banco de dados!_ 💍`,
      [target1, target2]
    );
  },
};
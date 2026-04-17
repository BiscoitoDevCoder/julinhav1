import fs from "fs";
import path from "node:path";
import { PREFIX } from "../../config.js";

export default {
  name: "fquintal",
  description: "Força um relacionamento de 5 pessoas (Somente Dono).",
  commands: ["fquintal", "quintalforcado"],
  usage: `${PREFIX}fquintal @user1 @user2 @user3 @user4 @user5`,
  handle: async ({ sendReply, isGroup, args }) => {
    if (!isGroup) return;

    // 1. Pega o texto dos argumentos
    const textoMensagem = args.join(" ") || "";
    
    // 2. EXTRAI TODOS OS NÚMEROS (Mínimo 8 dígitos)
    const numerosEncontrados = textoMensagem.match(/\d{8,}/g);

    // Validação: Precisa de exatamente 5 pessoas para o Quintal
    if (!numerosEncontrados || numerosEncontrados.length < 5) {
      return await sendReply(`⚠️ O Padre Jadson precisa de 5 noivos para formar um Quintal!\n\nExemplo: ${PREFIX}fquintal @user1 @user2 @user3 @user4 @user5`);
    }

    // 3. MONTA OS IDS E FORMATA A EXIBIÇÃO
    const noivosLid = numerosEncontrados.slice(0, 5).map(num => `${num}@lid`);
    const noivosExibicao = numerosEncontrados.slice(0, 5).map(num => `@${num}`).join(" + ");

    // --- LÓGICA DE DATABASE ---
    const rootPath = process.cwd(); 
    const dbDir = path.join(rootPath, "database");
    const dbPath = path.join(dbDir, "casais.json");

    if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
    
    const db = fs.existsSync(dbPath) ? JSON.parse(fs.readFileSync(dbPath, "utf-8")) : {};

    // Registra o quintal na DB usando o ID do primeiro como chave principal
    // Salvamos como um array no campo 'membros' para o bot saber que é um quintal
    db[noivosLid[0]] = {
      tipo: "quintal",
      membros: noivosLid,
      data: new Date().toLocaleDateString('pt-BR')
    };

    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

    await sendReply(
      `🔨 *QUINTAL FORÇADO PELO PADRE JADSON* 🔨\n\n` +
      `O Padre decretou uma união quíntupla e agora é oficial:\n\n` +
      `✨ ${noivosExibicao} ✨\n\n` +
      `_O amor no Manicômio não tem limites! Todos registrados no banco de dados!_ 💍🔥`,
      noivosLid
    );
  },
};
import path from "node:path";
import { ASSETS_DIR, PREFIX } from "../../../config.js";

export default {
  name: "formarcasal",
  description: "O bot escolhe um casal aleatório do grupo!",
  commands: ["formarcasal", "casal", "shipar"],
  usage: `${PREFIX}formarcasal`,
  /**
   * @param {CommandHandleProps} props
   */
  handle: async ({
    sendGifFromFile,
    fullMessage,
    getGroupMetadata,
    remoteJid, // Tentando pegar direto das props
  }) => {
    try {
      // 1. Tenta pegar o ID do grupo de várias formas para não dar 'undefined'
      const jid = remoteJid || fullMessage?.key?.remoteJid || fullMessage?.remoteJid;

      if (!jid || !jid.endsWith('@g.us')) {
        return await sendGifFromFile(
          path.resolve(ASSETS_DIR, "images", "funny", "slap-jjk.mp4"),
          "Este comando só pode ser usado em grupos! ❌"
        );
      }

      // 2. Busca os membros do grupo
      const metadata = await getGroupMetadata(jid);
      
      // Se metadata for undefined ou não tiver participantes, para aqui
      if (!metadata || !metadata.participants) {
        throw new Error("Não foi possível carregar os membros do grupo.");
      }

      const participants = metadata.participants;

      // 3. Verifica se tem gente suficiente
      if (participants.length < 2) {
        return await sendGifFromFile(
          path.resolve(ASSETS_DIR, "images", "funny", "slap-jjk.mp4"),
          "Não há pessoas suficientes para formar um casal! 💔"
        );
      }

      // 4. Sorteia dois membros aleatórios
      const shuffled = participants.sort(() => 0.5 - Math.random());
      const user1 = shuffled[0].id;
      const user2 = shuffled[1].id;

      // Limpa os IDs para exibir (pega só o número)
      const num1 = user1.split('@')[0];
      const num2 = user2.split('@')[0];

      await sendGifFromFile(
        path.resolve(ASSETS_DIR, "images", "funny", "beijao.mp4"),
        `✨ O destino decidiu! Temos um novo casal no grupo: ✨\n\n@${num1} @${num2}\n\nShipam esse casal? 😍❤️`,
        [user1, user2]
      );

    } catch (error) {
      console.error("Erro no comando casal:", error);
      // Se der erro, avisa no console do Linux pra você ver o que foi
    }
  },
};
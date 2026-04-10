import { PREFIX } from "../../../config.js";

export default {
  name: "rankcornos",
  description: "Exibe o ranking dos maiores cornos do grupo!",
  commands: ["topchifres", "rankcornos", "cornao"],
  usage: `${PREFIX}topcornos`,
  handle: async ({
    socket,
    remoteJid,
    fullMessage,
    sendReply,
    isGroup
  }) => {
    try {
      // 1. Validação de Grupo (essencial para não dar erro de participants)
      if (!isGroup) {
        return sendReply("❌ Esse comando só funciona em grupos, chapa!");
      }

      // 2. Pegar dados do grupo
      const groupMetadata = await socket.groupMetadata(remoteJid);
      const participants = groupMetadata.participants;

      // 3. Selecionar 5 aleatórios (ou menos, se o grupo for pequeno)
      const quantidade = Math.min(participants.length, 5);
      const sorteados = participants
        .sort(() => Math.random() - 0.5)
        .slice(0, quantidade);

      // 4. Montar o Ranking
      const medalhas = ["🥇", "🥈", "🥉", "4º", "5º"];
      let ranking = "🐂 *RANKING DOS MAIORES CORNOS* 🐂\n_O gado do Manicômio foi atualizado!_\n\n";

      sorteados.forEach((p, index) => {
        // p.id costuma ser "552799999999@s.whatsapp.net"
        // split deixa apenas o número
        ranking += `${medalhas[index]} @${p.id.split("@")[0]}\n`;
      });

      ranking += "\n⚠️ *Status:* Chifre detectado com sucesso!";

      // 5. Enviar a mensagem marcando a galera
      // Usamos o socket direto para garantir que as menções funcionem
      await socket.sendMessage(remoteJid, {
        text: ranking,
        mentions: sorteados.map(p => p.id)
      }, { quoted: fullMessage });

    } catch (error) {
      console.error("Erro no Top Cornos:", error);
      // Se o sendReply estiver dando erro de fromMe, o console.log acima vai nos dizer
    }
  },
};
import { PREFIX } from "../../../config.js";
import { onlyNumbers } from "../../../utils/index.js";

export default {
  name: "medircu",
  description: "Mede o estado atual do seu...",
  commands: ["medircu", "cu", "medir"],
  usage: `${PREFIX}medircu @usuario`,
  handle: async ({ sendReply, userLid, replyLid, args, isReply, isGroup }) => {
    if (!isGroup) return;

    // Define quem será medido: a pessoa respondida, a mencionada ou quem deu o comando
    const targetLid = isReply ? replyLid : (args[0] ? `${onlyNumbers(args[0])}@lid` : userLid);
    const targetNum = onlyNumbers(targetLid);
    
    // Gera a porcentagem aleatória
    const rdn = Math.floor(Math.random() * 101);
    
    // Diagnósticos baseados na porcentagem
    let status = "";
    if (rdn === 0) status = "💎 *IMPECÁVEL!* Passa nem sinal de Wi-Fi, tá lacrado.";
    else if (rdn < 25) status = "🟢 *CONSERVADO:* Tá em dia, só alegria.";
    else if (rdn < 50) status = "🟡 *AVARIADO:* Já viu dias melhores, mas ainda funciona.";
    else if (rdn < 75) status = "🟠 *RODADO:* A manutenção tá atrasada e a entrada tá livre.";
    else if (rdn < 100) status = "🔴 *ARROMBADO:* Cabe um caminhão de lixo e ainda sobra espaço.";
    else status = "⚠️ *ESTADO CRÍTICO:* O buraco é tão grande que virou um portal pro submundo!";

    await sendReply(
      `⚖️ *MEDIDOR DE "CU" DO MANICÔMIO* ⚖️\n\n` +
      `Analisando o @${targetNum}...\n` +
      `📊 Resultado: *${rdn}%* de dilatação!\n\n` +
      `📝 *Diagnóstico:* ${status}`,
      [targetLid]
    );
  },
};
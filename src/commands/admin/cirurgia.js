import path from "node:path";
import { ASSETS_DIR } from "../../config.js";
import { onlyNumbers } from "../../utils/index.js";

export default {
  name: "cirurgia",
  description: "Inicia o protocolo hospitalar de redesignação sexual.",
  commands: ["cirurgia", "capar", "redesignar"],
  handle: async ({
    sendGifFromFile,
    sendErrorReply,
    userLid,
    replyLid,
    args,
    isReply,
  }) => {
    try {
      // 1. Identificação do Paciente
      const targetLid = isReply
        ? replyLid
        : args[0]
        ? `${onlyNumbers(args[0])}@lid`
        : null;

      if (!targetLid) {
        return await sendErrorReply("❌ *ERRO:* Identifique o paciente para a cirurgia!");
      }

      const userNumber = onlyNumbers(userLid);
      const targetNumber = onlyNumbers(targetLid);

      // 2. Laudo Médico - Centro Cirúrgico do Manicômio
      const laudo = `🏥 *CENTRO CIRÚRGICO DO MANICÔMIO* 🏥\n\n` +
        `👨‍⚕️ *Cirurgião:* @${userNumber}\n` +
        `👤 *Paciente:* @${targetNumber}\n\n` +
        `📋 *LAUDO:* Procedimento de *Redesignação Sexual* concluído via ressecção total do tecido cavernoso e extração peniana sem intercorrências.\n\n` +
        `*Conclusão:* Agora finalmente @${targetNumber} possui o órgão genital com que se identifica. ✨`;

      // 3. Envio como GIF (Loop infinito e automático)
      await sendGifFromFile(
        path.resolve(ASSETS_DIR, "images", "funny", "sals.mp4"),
        laudo,
        [userLid, targetLid]
      );

    } catch (error) {
      console.error("Erro no comando cirurgia:", error);
      await sendErrorReply("Houve um erro técnico no centro cirúrgico.");
    }
  },
};

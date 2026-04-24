import path from "node:path";
import { ASSETS_DIR } from "../../../config.js";
import { onlyNumbers } from "../../../utils/index.js";

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
    // 1. Identificação do Paciente (Vítima)
    const targetLid = isReply
      ? replyLid
      : args[0]
      ? `${onlyNumbers(args[0])}@lid`
      : null;

    if (!targetLid) {
      return await sendErrorReply("❌ *ERRO MÉDICO:* Identifique o paciente via menção ou resposta!");
    }

    const userNumber = onlyNumbers(userLid);
    const targetNumber = onlyNumbers(targetLid);

    // 2. Laudo Médico (Versão "Equilibrada")
    const laudo = `🏥 *UNIDADE DE CIRURGIA ESPECIALIZADA*\n\n` +
      `👨‍⚕️ *Cirurgião-Chefe:* @${userNumber}\n` +
      `👤 *Paciente:* @${targetNumber}\n\n` +
      `📋 *RELATÓRIO DE PROCEDIMENTO:* \n` +
      `Informamos que o protocolo de *Redesignação Sexual Estética* foi concluído. O procedimento envolveu a dissecação de tecidos e a remoção total do apêndice reprodutor para fins recreativos.\n\n` +
      `✅ Sedação estável durante a extração.\n` +
      `✅ Procedimento irreversível concluído.\n\n` +
      `*Conclusão:* Após o sucesso da intervenção, agora finalmente @${targetNumber} possui o órgão genital com que se identifica. ✨`;

    // 3. Envio do vídeo sals.mp4
    await sendGifFromFile(
      path.resolve(ASSETS_DIR, "images", "funny", "sals.mp4"),
      laudo,
      [userLid, targetLid]
    );
  },
};

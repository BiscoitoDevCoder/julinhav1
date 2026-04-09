import path from "node:path";
import { ASSETS_DIR, PREFIX } from "../../../config.js";
import { InvalidParameterError } from "../../../errors/index.js";
import { onlyNumbers } from "../../../utils/index.js";

export default {
  name: "sarrada",
  description: "Dá uma sarrada em alguém.",
  commands: ["sarrada", "sarrar"],
  usage: `${PREFIX}sarrada @usuario`,
  /**
   * @param {CommandHandleProps} props
   */
  handle: async ({
    sendGifFromFile,
    sendErrorReply,
    userLid,
    replyLid,
    args,
    isReply,
  }) => {
    // Verifica se tem alguém sendo marcado ou se é resposta a uma mensagem
    if (!args.length && !isReply) {
      throw new InvalidParameterError(
        "Você precisa mencionar alguém ou responder a uma mensagem para dar uma sarrada!"
      );
    }

    const targetLid = isReply
      ? replyLid
      : args[0]
      ? `${onlyNumbers(args[0])}@lid`
      : null;

    if (!targetLid) {
      await sendErrorReply(
        "Mencione um usuário ou responda uma mensagem para dar aquela sarrada gostosa."
      );

      return;
    }

    const userNumber = onlyNumbers(userLid);
    const targetNumber = onlyNumbers(targetLid);

    // Certifique-se de que o arquivo 'sarrada.mp4' existe no caminho abaixo
    await sendGifFromFile(
      path.resolve(ASSETS_DIR, "images", "funny", "sarrada.mp4"),
      `@${userNumber} deu uma sarrada gostosa em @${targetNumber}! ⚡`,
      [userLid, targetLid]
    );
  },
};
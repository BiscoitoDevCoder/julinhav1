import { PREFIX } from "../../../config.js";
import { onlyNumbers } from "../../../utils/index.js";

export default {
  name: "infiel",
  description: "Mede o quão infiel uma pessoa é!",
  commands: ["infiel", "medidorinfiel"],
  usage: `${PREFIX}infiel @usuario`,
  /**
   * @param {CommandHandleProps} props
   */
  handle: async ({ sendReply, userLid, replyLid, args, isReply }) => {
    // Define quem será medido (quem mandou, quem foi respondido ou quem foi marcado)
    const targetLid = isReply ? replyLid : args[0] ? `${onlyNumbers(args[0])}@lid` : userLid;
    
    const targetNumber = targetLid.split('@')[0];
    const porcentagem = Math.floor(Math.random() * 101); // 0 a 100%

    let comentario = "";
    if (porcentagem < 20) comentario = "Santo(a)! Esse aí é fiel até debaixo d'água. 😇";
    else if (porcentagem < 50) comentario = "Dá pra confiar, mas não deixa o celular desbloqueado... 👀";
    else if (porcentagem < 80) comentario = "Perigo! O histórico de busca é só guia anônima. 🐍";
    else comentario = "NÍVEL MÁXIMO! Trai até a própria sombra. Fuja! 🚩🚩🚩";

    await sendReply(
      `🧐 *ANALISADOR DE CARÁTER* 🧐\n\nO bot analisou @${targetNumber} e o resultado é:\n\n📈 *${porcentagem}% INFIEL* \n\n${comentario}`,
      [targetLid]
    );
  },
};
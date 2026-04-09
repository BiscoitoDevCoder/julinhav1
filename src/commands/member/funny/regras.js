import { PREFIX } from "../../../config.js";

export default {
  name: "regras",
  description: "Exibe as regras oficiais do grupo!",
  commands: ["regras", "rules", "diretrizes"],
  usage: `${PREFIX}regras`,
  /**
   * @param {CommandHandleProps} props
   */
  handle: async ({ sendReply }) => {
    const textoRegras = `🚨 *REGRAS DO GRUPO* 🚨

*🚫 Proibido chamar as pessoas no privado sem autorização.*
*🚫 Proibido qualquer tipo de conteúdo +18.*
*🚫 Proibido preconceito, ofensas ou qualquer tipo de crime.*
*🚫 Proibido spam, flood ou links suspeitos.*
*🚫 Divulgação de outros grupos não é permitida.*
*🚫 Proibido pessoas com mais de 30 anos.*
*⚠️ Evite brigas e discussões desnecessárias no grupo.*
*🤝 Respeite a opinião dos outros, mesmo que seja diferente da sua.*

⚖️ _O descumprimento das regras pode levar ao banimento imediato!_`;

    await sendReply(textoRegras);
  },
};
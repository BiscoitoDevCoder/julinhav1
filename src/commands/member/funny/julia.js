import { PREFIX } from "../../../config.js";

export default {
  name: "anunciar",
  description: "Envia uma mensagem personalizada para o grupo específico!",
  commands: ["aj", "anunciar", "falar"],
  usage: `${PREFIX}aj [sua mensagem]`,
  /**
   * @param {CommandHandleProps} props
   */
  handle: async ({
    sendMessage,
    sendReply,
    socket,
    args, // Aqui pegamos o que você escreveu
  }) => {
    // 1. O ID do grupo destino
    const grupoId = "120363427549469145@g.us";

    // 2. Junta as palavras que você digitou em uma frase só
    const textoParaEnviar = args.join(" ");

    // 3. Verifica se você escreveu alguma coisa
    if (!textoParaEnviar) {
      return await sendReply(`❌ Escreve algo né! Exemplo: ${PREFIX}aj Julia é gata`);
    }

    try {
      // 4. Envia a sua mensagem personalizada para o grupo alvo
      await socket.sendMessage(grupoId, { text: textoParaEnviar });

      // 5. Avisa no chat atual que foi enviado
      await sendReply(`✅ Mensagem enviada para o grupo destino:\n\n"${textoParaEnviar}"`);

    } catch (error) {
      console.error("Erro ao enviar mensagem personalizada:", error);
      await sendReply("❌ Não consegui enviar. O bot pode ter sido removido do grupo alvo ou está offline. ⚠️");
    }
  },
};
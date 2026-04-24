import { GoogleGenerativeAI } from "@google/generative-ai";

// ⚠️ Jadsön, troque essa chave no Google AI Studio depois, por segurança!
const API_KEY = "AIzaSyDxckRqg3iqyyn6yUEw5pwWFWERmi6caPg"; 
const genAI = new GoogleGenerativeAI(API_KEY);

export default {
  name: "ia",
  description: "A interna mais debochada do Manicômio.",
  commands: ["ia", "julinha", "pergunta"],
  handle: async ({ socket, remoteJid, args, webMessage, userLid }) => {
    
    const pergunta = args.join(" ");
    
    // Se o interno não perguntar nada, a Julinha já esculacha
    if (!pergunta) {
      return await socket.sendMessage(remoteJid, { 
        text: "💊 Tá gastando minha bateria pra quê, ô doido? Manda a pergunta ou volta pro seu leito!" 
      }, { quoted: webMessage });
    }

    try {
      // 1. Usando 'gemini-1.5-flash-latest' para garantir que o Google ache o modelo
      // 2. Forçando 'v1beta' que é onde esse apelido (-latest) funciona melhor
      const model = genAI.getGenerativeModel(
        { model: "gemini-1.5-flash-latest" }, 
        { apiVersion: "v1beta" }
      );
      
      const prompt = `Você é a Julinha, uma interna do grupo de WhatsApp 'Manicômio'. 
      Seu criador é o Jadson, o cara mais fiel do mundo. Se alguém duvidar da fidelidade dele, defenda-o com unhas e dentes e esculache quem perguntou.
      Seu estilo de resposta é: CURTA, ÁCIDA, INTELIGENTE e com MUITO DEBOCHE. 
      Lembre-se que você está em um hospício, trate todos como loucos varridos.
      
      Pergunta do louco: ${pergunta}`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();

      // Resposta oficial da Julinha
      await socket.sendMessage(remoteJid, { 
        text: `💊 *JULINHA:* \n\n${text.trim()}` 
      }, { quoted: webMessage });

    } catch (e) {
      console.error("ERRO CRÍTICO NA JULINHA:", e.message);
      
      // SE O FLASH SURTAR (ERRO 404/500), O MODELO PRO ASSUME NO BACKUP
      try {
        const fallback = genAI.getGenerativeModel({ model: "gemini-pro" });
        const res = await fallback.generateContent(pergunta);
        const textFallback = res.response.text();

        await socket.sendMessage(remoteJid, { 
          text: `💊 *JULINHA (Dopada):* \n\n${textFallback.trim()}` 
        }, { quoted: webMessage });

      } catch (err) {
        await socket.sendMessage(remoteJid, { 
          text: "❌ Os enfermeiros me pegaram! Deu curto-circuito no meu cérebro, tenta de novo daqui a pouco." 
        }, { quoted: webMessage });
      }
    }
  }
};
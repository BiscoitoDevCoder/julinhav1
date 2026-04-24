import { GoogleGenerativeAI } from "@google/generative-ai";

// Sua chave mestre (O cara mais fiel da terra não erra a chave!)
const API_KEY = "AIzaSyDxckRqg3iqyyn6yUEw5pwWFWERmi6caPg"; 

// Aqui está o segredo: Não passamos versão, deixamos a lib usar a padrão (v1)
const genAI = new GoogleGenerativeAI(API_KEY);

export default {
  name: "ia",
  description: "A interna mais debochada do Manicômio.",
  commands: ["ia", "julinha", "pergunta"],
  handle: async ({ socket, remoteJid, args, webMessage }) => {
    
    const pergunta = args.join(" ");
    
    if (!pergunta) {
        return await socket.sendMessage(remoteJid, { 
            text: "💊 Tá gastando minha memória pra quê? Manda a pergunta ou volta pro banho de sol, interno!" 
        }, { quoted: webMessage });
    }

    try {
      // Forçamos o modelo 1.5-flash sem o prefixo beta
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
      });
      
      const prompt = `Você é a Julinha, a Escrava oficial do grupo 'Manicômio'. 
      Seu criador é o Jadson, o cara mais fiel da terra. 
      Você vive em um hospício. 
      Sua personalidade é: CURTA, INTELIGENTE e COM MUITO DEBOCHE. 
      Trate os outros usuários como loucos/internos. Seja ácida e sarcástica.
      
      Pergunta do interno: ${pergunta}`;

      // Gerando o conteúdo
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      await socket.sendMessage(remoteJid, { 
        text: `💊 *JULINHA:* \n\n${text.trim()}` 
      }, { quoted: webMessage });

    } catch (e) {
      console.error("Erro no surto da Julinha:", e.message);
      
      // Se der 404 de novo, vamos pro plano de guerra: gemini-pro (que é v1 puro)
      try {
          const fallback = genAI.getGenerativeModel({ model: "gemini-pro" });
          const res = await fallback.generateContent(pergunta);
          await socket.sendMessage(remoteJid, { text: `💊 *JULINHA (Dopada):* \n\n${res.response.text()}` });
      } catch (err) {
          await socket.sendMessage(remoteJid, { text: "❌ Tive um apagão aqui. O choque elétrico foi forte! Tenta de novo." });
      }
    }
  }
};
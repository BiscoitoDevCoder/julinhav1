import axios from 'axios';

// Chave do cara mais fiel da terra
const API_KEY = "AIzaSyDxckRqg3iqyyn6yUEw5pwWFWERmi6caPg"; 

export default {
  name: "ia",
  description: "A interna mais debochada do Manicômio.",
  commands: ["ia", "julinha", "pergunta"],
  handle: async ({ socket, remoteJid, args, webMessage }) => {
    
    const pergunta = args.join(" ");
    if (!pergunta) return await socket.sendMessage(remoteJid, { text: "💊 Manda a pergunta ou volta pro banho de sol!" });

    try {
      // USANDO O NOME QUE VOCÊ DESCOBRIU NO ENDPOINT V1BETA (onde os modelos preview moram)
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key=${API_KEY}`;
      
      const corpo = {
        contents: [{
          parts: [{
            text: `Você é a Julinha, interna do grupo 'Manicômio' e vive dentro de um Manicômio. 
            Estilo: MUITO DEBOCHE, sarcasmo e inteligência. Respostas curtas.
            Pergunta: ${pergunta}`
          }]
        }]
      };

      const response = await axios.post(url, corpo);
      
      // O caminho do JSON da Google para o texto
      const textoSaida = response.data.candidates[0].content.parts[0].text;

      await socket.sendMessage(remoteJid, { 
        text: `💊 *JULINHA:* \n\n${textoSaida.trim()}` 
      }, { quoted: webMessage });

    } catch (e) {
      console.error("ERRO NO 3.1:", e.response?.data || e.message);
      
      // Se der erro de nome de novo, ele avisa no console o motivo real
      await socket.sendMessage(remoteJid, { 
        text: "❌ Meu cérebro de 3.1 deu um tique! Tenta de novo em 1 minuto." 
      }, { quoted: webMessage });
    }
  }
};
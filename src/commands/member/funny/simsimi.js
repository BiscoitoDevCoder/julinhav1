import axios from 'axios';

const API_KEY = "AIzaSyDxckRqg3iqyyn6yUEw5pwWFWERmi6caPg"; 

export default {
  name: "ia",
  description: "A interna mais debochada do Manicômio.",
  commands: ["ia", "julinha", "pergunta"],
  handle: async ({ socket, remoteJid, args, webMessage }) => {
    
    const pergunta = args.join(" ");
    if (!pergunta) return await socket.sendMessage(remoteJid, { text: "💊 Manda a pergunta, ô doido! Quer que eu adivinhe?" });

    try {
      // Falando direto com a API do Google (Versão Estável v1)
      const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
      
      const corpo = {
        contents: [{
          parts: [{
            text: `Você é a Julinha, interna do 'Manicômio'. 
            Criador: Jadson, o cara mais fiel do mundo. Defenda-o. 
            Estilo: Curta, ácida, debochada. Trate todos como loucos. 
            Pergunta: ${pergunta}`
          }]
        }]
      };

      const response = await axios.post(url, corpo);
      
      const textoSaida = response.data.candidates[0].content.parts[0].text;

      await socket.sendMessage(remoteJid, { 
        text: `💊 *JULINHA:* \n\n${textoSaida.trim()}` 
      }, { quoted: webMessage });

    } catch (e) {
      console.error("ERRO NA REQUISIÇÃO DIRETA:", e.response?.data || e.message);
      
      await socket.sendMessage(remoteJid, { 
        text: "❌ O Google tá de sacanagem! Tive um surto aqui. Tenta de novo, se seu cérebro de interno permitir." 
      }, { quoted: webMessage });
    }
  }
};
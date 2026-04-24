import axios from 'axios';

// Chave do cara mais fiel da terra
const API_KEY = "AIzaSyDxckRqg3iqyyn6yUEw5pwWFWERmi6caPg"; 

export default {
  name: "ia",
  description: "A interna mais debochada do Manicômio.",
  commands: ["ia", "julinha", "pergunta"],
  handle: async ({ socket, remoteJid, args, webMessage }) => {
    
    const pergunta = args.join(" ");
    if (!pergunta) return await socket.sendMessage(remoteJid, { text: "💊 Manda a pergunta! Ou vai ficar aí babando no leito?" });

    try {
      // USANDO A V1 (ESTÁVEL) E O NOME QUE A IA MANDOU (GEMINI-1.5-FLASH)
      const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
      
      const corpo = {
        contents: [{
          parts: [{
            text: `Você é a Julinha , interna do 'Manicômio'. 
            Criador: Jadson, o cara mais fiel do mundo. Defenda-o. 
            Estilo: Resposta CURTA, MUITO DEBOCHADA e INTELIGENTE. Trate como louco. 
            Pergunta: ${pergunta}`
          }]
        }]
      };

      const response = await axios.post(url, corpo);
      
      // Pega o texto da resposta (O caminho oficial do JSON da Google)
      const textoSaida = response.data.candidates[0].content.parts[0].text;

      await socket.sendMessage(remoteJid, { 
        text: `💊 *JULINHA:* \n\n${textoSaida.trim()}` 
      }, { quoted: webMessage });

    } catch (e) {
      console.error("ERRO NO MANICÔMIO:", e.response?.data || e.message);
      
      // Se der erro de 404 de novo, vamos tentar a URL v1beta com o mesmo modelo
      try {
          const urlBeta = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
          const resBeta = await axios.post(urlBeta, corpo);
          const txtBeta = resBeta.data.candidates[0].content.parts[0].text;
          await socket.sendMessage(remoteJid, { text: `💊 *JULINHA:* \n\n${txtBeta.trim()}` });
      } catch (err) {
          await socket.sendMessage(remoteJid, { 
            text: "❌ O Google bloqueou meus eletrochoques! Tenta de novo em 1 minuto." 
          }, { quoted: webMessage });
      }
    }
  }
};
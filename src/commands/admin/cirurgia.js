import fs from "fs";
import { PREFIX } from "../../../config.js";

export default {
  name: "cirurgia",
  description: "Inicia o protocolo hospitalar de redesignação sexual no paciente citado.",
  commands: ["cirurgia", "redesignar", "capar"],
  usage: `${PREFIX}cirurgia @paciente`,
  handle: async ({ socket, remoteJid, webMessage }) => {
    try {
      const contextInfo = webMessage?.message?.extendedTextMessage?.contextInfo;
      const paciente = contextInfo?.mentionedJid?.[0] || contextInfo?.participant;

      if (!paciente) {
        return await socket.sendMessage(remoteJid, { 
          text: "❌ *ERRO MÉDICO:* É necessário identificar o paciente via menção ou resposta para iniciar o protocolo cirúrgico." 
        });
      }

      const medico = webMessage.key.participant || webMessage.key.remoteJid;
      const videoPath = "./assets/images/funny/sals.mp4"; 

      const laudo = `🏥 *UNIDADE DE CIRURGIA ESPECIALIZADA*\n\n` +
        `👨‍⚕️ *Cirurgião-Chefe:* @${medico.split('@')[0]}\n` +
        `👤 *Paciente:* @${paciente.split('@')[0]}\n\n` +
        `📋 *RELATÓRIO DE PROCEDIMENTO:* \n` +
        `Informamos que o paciente foi submetido a uma *Faloplastia de Redesignação Estética*. O procedimento envolveu a dissecação de tecidos superficiais, cauterização venosa e a remoção total do apêndice reprodutor.\n\n` +
        `✅ Hemostasia realizada.\n` +
        `✅ Sutura intradérmica concluída.\n` +
        `✅ Sedação estável durante a extração.\n\n` +
        `*Conclusão:* Após o sucesso da intervenção, agora finalmente @${paciente.split('@')[0]} possui o órgão genital com que se identifica. ✨`;

      if (fs.existsSync(videoPath)) {
        await socket.sendMessage(remoteJid, {
          video: fs.readFileSync(videoPath),
          caption: laudo,
          mentions: [medico, paciente],
          gifPlayback: false 
        }, { quoted: webMessage });
      } else {
        await socket.sendMessage(remoteJid, { 
          text: laudo,
          mentions: [medico, paciente]
        });
      }

    } catch (error) {
      console.error("Erro no comando cirurgia:", error);
    }
  },
};

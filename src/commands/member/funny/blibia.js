import axios from "axios";

export default {
  name: "versiculo",
  description: "Exibe um versículo bíblico.",
  commands: ["versiculo", "biblia", "palavra"],
  handle: async ({ sendReply }) => {
    try {
      const res = await axios.get("https://util.docer.com.br/biblia/random");
      const { texto, referencia } = res.data;
      await sendReply(`📖 *PALAVRA DO DIA* 📖\n\n"${texto}"\n\n✨ _${referencia}_`);
    } catch (error) {
      await sendReply("❌ API instável. Tente novamente!");
    }
  },
};
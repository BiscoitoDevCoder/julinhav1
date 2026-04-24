/**
 * Menu Moderno - Julinha v1
 * Design Clean & Minimalista
 */
import pkg from "../package.json" with { type: "json" };
import { BOT_NAME } from "./config.js";
import { getPrefix } from "./utils/database.js";
import { readMore } from "./utils/index.js";

export function menuMessage(groupJid) {
  const prefix = getPrefix(groupJid);
  const v = pkg.version;

  return `┎───「 **${BOT_NAME.toUpperCase()}** 」────
┃ 
┃ 🖥️ **VERSÃO:** ${v}
┃ ⚡ **PREFIXO:** ${prefix}
┃ 📅 **DATA:** ${new Date().toLocaleDateString("pt-br")}
┃${readMore()}
┖───────────────────

┌───  **👑 STAFF**
│ ➥ ${prefix}on • ${prefix}off
│ ➥ ${prefix}setprefix • ${prefix}exec
│ ➥ ${prefix}setmenu • ${prefix}proxy
└───────────────

┌───  **🛡️ ADMINISTRAÇÃO**
│ ➥ ${prefix}ban • ${prefix}promover • ${prefix}rebaixar
│ ➥ ${prefix}abrir • ${prefix}fechar • ${prefix}hidetag
│ ➥ ${prefix}delete • ${prefix}revelar • ${prefix}limpar
│ ➥ ${prefix}mute • ${prefix}unmute • ${prefix}link
│ ➥ ${prefix}welcome • ${prefix}antilink • ${prefix}antievent
└───────────────

┌───  **🎭 MANICÔMIO (NEW)**
│ ➥ ${prefix}cirurgia 🩺
│ ➥ ${prefix}amorodio ⚖️
│ ➥ ${prefix}topex 🤡
│ ➥ ${prefix}abracar • ${prefix}beijar • ${prefix}lutar
│ ➥ ${prefix}matar • ${prefix}socar • ${prefix}jantar
└───────────────

┌───  **✨ UTILITÁRIOS**
│ ➥ ${prefix}sticker • ${prefix}ttp • ${prefix}attp • ${prefix}brat
│ ➥ ${prefix}toimage • ${prefix}togif • ${prefix}tomp3
│ ➥ ${prefix}perfil • ${prefix}ping • ${prefix}info • ${prefix}cep
│ ➥ ${prefix}gerarlink • ${prefix}rename • ${prefix}fakechat
└───────────────

┌───  **📥 DOWNLOADS & IA**
│ ➥ ${prefix}play • ${prefix}ytmp3 • ${prefix}ytmp4 • ${prefix}ytsearch
│ ➥ ${prefix}tiktok • ${prefix}ig • ${prefix}fb • ${prefix}pinterest
│ ➥ ${prefix}gemini • ${prefix}gpt5 • ${prefix}flux • ${prefix}iasticker
└───────────────

┌───  **🎨 CANVAS & EDIÇÃO**
│ ➥ ${prefix}blur • ${prefix}rip • ${prefix}pixel • ${prefix}gray
│ ➥ ${prefix}bolsonaro • ${prefix}cadeia • ${prefix}inverter
└───────────────

> 💡 _Digite ${prefix}help <comando> para saber mais._`;
}

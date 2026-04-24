/**
 * Menu Ultra Moderno - Julinha v1
 * Estética Cyber-Minimalista com ReadMore
 */
import pkg from "../package.json" with { type: "json" };
import { BOT_NAME } from "./config.js";
import { getPrefix } from "./utils/database.js";
import { readMore } from "./utils/index.js";

export function menuMessage(groupJid) {
  const prefix = getPrefix(groupJid);
  const v = pkg.version;

  // O readMore() logo após o título garante o efeito de esconder o resto
  return `〔 **${BOT_NAME.toUpperCase()}** 〕${readMore()}

  ◈ **STATUS DO SISTEMA** ◈
  ⦿ **Versão:** ${v}
  ⦿ **Prefixo:** ${prefix}
  ⦿ **Data:** ${new Date().toLocaleDateString("pt-br")}

  ---

  「 **👑 CONTROLE DONO** 」
  ❯ ${prefix}on • ${prefix}off
  ❯ ${prefix}setprefix • ${prefix}exec
  ❯ ${prefix}setmenu • ${prefix}proxy

  「 **🛡️ ADMINISTRAÇÃO** 」
  ❯ ${prefix}ban • ${prefix}kick • ${prefix}hidetag
  ❯ ${prefix}abrir • ${prefix}fechar • ${prefix}link
  ❯ ${prefix}mute • ${prefix}unmute • ${prefix}limpar
  ❯ ${prefix}promover • ${prefix}rebaixar • ${prefix}revelar

  「 **🎭 MANICÔMIO** 」
  ❯ ${prefix}cirurgia 🩺
  ❯ ${prefix}amorodio ⚖️
  ❯ ${prefix}topex 🤡
  ❯ ${prefix}abracar • ${prefix}beijar • ${prefix}matar
  ❯ ${prefix}socar • ${prefix}lutar • ${prefix}jantar

  「 **🛠️ UTILITÁRIOS** 」
  ❯ ${prefix}sticker • ${prefix}ttp • ${prefix}attp • ${prefix}brat
  ❯ ${prefix}toimage • ${prefix}togif • ${prefix}tomp3 • ${prefix}tomp4
  ❯ ${prefix}ping • ${prefix}info • ${prefix}perfil

  「 **📡 REDES & IA** 」
  ❯ ${prefix}play • ${prefix}tiktok • ${prefix}ig • ${prefix}fb
  ❯ ${prefix}gemini • ${prefix}gpt • ${prefix}flux • ${prefix}iasticker

  「 **🎨 LABORATÓRIO CANVAS** 」
  ❯ ${prefix}blur • ${prefix}rip • ${prefix}pixel • ${prefix}gray
  ❯ ${prefix}cadeia • ${prefix}espelhar • ${prefix}inverter

> 💡 _Clique em 'Ler mais' para ver todos os comandos._`;

}

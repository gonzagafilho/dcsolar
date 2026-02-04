"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";

type Msg = { role: "bot" | "user"; text: string };

const STORAGE_KEY = "dcsolar_chat_v1";
const COOLDOWN_MS = 2 * 60 * 1000;

const initialMessages: Msg[] = [
  {
    role: "bot",
    text:
      "Olá! 👋 Sou o assistente da DC Infinity Solar.\n" +
      "Posso te ajudar com:\n" +
      "1) Orçamento de energia solar\n" +
      "2) On-grid / Off-grid\n" +
      "3) Bombeamento solar\n\n" +
      "Me diga: você quer ORÇAMENTO ou tirar DÚVIDAS?"
  }
];

function normalize(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").trim();
}
function onlyDigits(s: string) {
  return s.replace(/\D/g, "");
}
function formatPhoneBR(digits: string) {
  const d = onlyDigits(digits).slice(0, 11);
  if (d.length <= 10) {
    return d.replace(/^(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d)/, "$1-$2");
  }
  return d.replace(/^(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2");
}

export default function ChatWidget() {
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [flow, setFlow] = useState<
    "idle" | "collect_name" | "collect_phone" | "collect_city" | "collect_consumption" | "done"
  >("idle");

  const [lead, setLead] = useState({
    name: "",
    phone: "",
    city: "",
    consumption: "",
    systemType: "On-grid" as "On-grid" | "Off-grid" | "Bombeamento",
    interest: "",
    originPath: "",
  });

  const [lastLeadAt, setLastLeadAt] = useState(0);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open, loading]);

  // carregar conversa salva
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed?.messages) setMessages(parsed.messages);
      if (parsed?.flow) setFlow(parsed.flow);
      if (parsed?.lead) setLead(parsed.lead);
      if (parsed?.lastLeadAt) setLastLeadAt(parsed.lastLeadAt);
    } catch {}
  }, []);

  // salvar conversa
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ messages, flow, lead, lastLeadAt })
    );
  }, [messages, flow, lead, lastLeadAt]);

  // atualiza origem/página
  useEffect(() => {
    setLead((l) => ({ ...l, originPath: pathname || "/" }));
  }, [pathname]);

  const faq = useMemo(
    () => [
      {
        keys: ["on grid", "ongrid"],
        answer:
          "🔌 **On-grid** é o sistema conectado à rede elétrica.\n" +
          "Você gera energia e recebe créditos na conta de luz."
      },
      {
        keys: ["off grid", "offgrid"],
        answer:
          "🔋 **Off-grid** funciona com baterias.\n" +
          "Ideal para locais sem rede ou quem busca autonomia."
      },
      {
        keys: ["bombeamento", "bomba", "poço", "poco"],
        answer:
          "💧 **Bombeamento solar** usa energia do sol para acionar bombas d’água."
      }
    ],
    []
  );

  function add(role: Msg["role"], text: string) {
    setMessages((m) => [...m, { role, text }]);
  }

  function setContext(type: "On-grid" | "Off-grid" | "Bombeamento") {
    setLead((l) => ({ ...l, systemType: type, interest: type }));
  }

  function replyDirect(text: string) {
    add("bot", text);
    add("bot", "Se quiser, posso abrir um ORÇAMENTO rapidinho 😉");
  }

  // ✅ RESET PROFISSIONAL (limpa estado salvo)
  function resetChat() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}

    setMessages(initialMessages);
    setFlow("idle");
    setLead({
      name: "",
      phone: "",
      city: "",
      consumption: "",
      systemType: "On-grid",
      interest: "",
      originPath: pathname || "/",
    });
    setInput("");
    add("bot", "Conversa reiniciada ✅ Como posso te ajudar agora?");
  }

  async function submitLead(finalLead: typeof lead) {
    const now = Date.now();
    if (now - lastLeadAt < COOLDOWN_MS) {
      add("bot", "⏳ Já recebi um pedido recente. Aguarde 2 minutos.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/chat/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalLead),
      });

      const data = await res.json().catch(() => ({}));
      setLastLeadAt(now);

      add(
        "bot",
        "✅ Pedido enviado!\n" +
          `• Tipo: ${finalLead.interest || finalLead.systemType}\n` +
          `• Cidade: ${finalLead.city}\n` +
          `• Consumo: ${finalLead.consumption} kWh`
      );
      if (data?.leadId) add("bot", `Protocolo: ${data.leadId}`);
      setFlow("done");
    } catch {
      add("bot", "Erro ao enviar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  function handleUser(textRaw: string) {
    const text = textRaw.trim();
    if (!text) return;

    const t = normalize(text);

    // ✅ comandos
    if (t === "reset" || t === "reiniciar") {
      add("user", text);
      setInput("");
      resetChat();
      return;
    }

    add("user", text);
    setInput("");

    // ✅ detecção de contexto (sem falso positivo)
    if (t.includes("off grid") || t.includes("offgrid")) setContext("Off-grid");
    if (t.includes("on grid") || t.includes("ongrid")) setContext("On-grid");
    if (t.includes("bombeamento") || t.includes("bomba") || t.includes("poco") || t.includes("poço")) setContext("Bombeamento");

    // fluxo de coleta
    if (flow === "collect_name") {
      setLead((l) => ({ ...l, name: text }));
      setFlow("collect_phone");
      add("bot", "Telefone com DDD?");
      return;
    }

    if (flow === "collect_phone") {
      const phone = onlyDigits(text);
      if (phone.length < 10) {
        add("bot", "Telefone inválido.");
        return;
      }
      setLead((l) => ({ ...l, phone }));
      setFlow("collect_city");
      add("bot", `Ok ${formatPhoneBR(phone)}. Sua cidade?`);
      return;
    }

    if (flow === "collect_city") {
      setLead((l) => ({ ...l, city: text }));
      setFlow("collect_consumption");
      add("bot", "Qual seu consumo mensal (kWh)?");
      return;
    }

    if (flow === "collect_consumption") {
      const kwh = onlyDigits(text);
      if (!kwh) {
        add("bot", "Me diga apenas o número do consumo em kWh (ex: 350).");
        return;
      }

      const finalLead = { ...lead, consumption: kwh, originPath: pathname || "/" };

      add(
        "bot",
        "✅ Resumo do seu pedido:\n" +
          `• Tipo: ${finalLead.interest || finalLead.systemType}\n` +
          `• Cidade: ${finalLead.city}\n` +
          `• Consumo: ${finalLead.consumption} kWh/mês\n\n` +
          "Enviando agora…"
      );

      submitLead(finalLead);
      return;
    }

    // atalho orçamento
    if (t.includes("orcamento") || t.includes("orçamento")) {
      setFlow("collect_name");
      add(
        "bot",
        `Perfeito 😄 Vou montar um orçamento de **${lead.interest || "energia solar"}**.\nQual seu nome?`
      );
      return;
    }

    // FAQ
    for (const f of faq) {
      if (f.keys.some((k) => t.includes(k))) {
        replyDirect(f.answer);
        return;
      }
    }

    add("bot", "Digite ORÇAMENTO ou escolha uma opção acima 👆 (ou digite REINICIAR)");
  }

  const whatsappLink =
    "https://wa.me/5561999656269?text=" +
    encodeURIComponent("Olá! Vim pelo site DC Infinity Solar.");

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-24 right-5 z-50 rounded-full px-4 py-3 bg-black text-white"
      >
        {open ? "Fechar" : "Chat"}
      </button>

      {open && (
        <div className="fixed bottom-36 right-5 z-50 w-[92vw] max-w-sm rounded-2xl shadow-2xl bg-white border overflow-hidden">
          <div className="px-4 py-3 bg-black text-white flex justify-between items-center">
            <div>
              <div className="font-semibold">DC Infinity Solar</div>
              <div className="text-xs opacity-80">Atendimento automático</div>
            </div>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="text-xs bg-white/20 px-3 py-1 rounded-full"
            >
              Falar com humano
            </a>
          </div>

          <div className="px-3 py-2 border-b flex gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => { setContext("On-grid"); replyDirect(faq[0].answer); }}
              className="text-xs px-3 py-1 border rounded-full"
            >
              On-grid
            </button>
            <button
              type="button"
              onClick={() => { setContext("Off-grid"); replyDirect(faq[1].answer); }}
              className="text-xs px-3 py-1 border rounded-full"
            >
              Off-grid
            </button>
            <button
              type="button"
              onClick={() => { setContext("Bombeamento"); replyDirect(faq[2].answer); }}
              className="text-xs px-3 py-1 border rounded-full"
            >
              Bombeamento
            </button>
            <button
              type="button"
              onClick={() => {
                setFlow("collect_name");
                add("bot", `Perfeito 😄 Vou montar um orçamento de **${lead.interest || "energia solar"}**.\nQual seu nome?`);
              }}
              className="text-xs px-3 py-1 border rounded-full"
            >
              Orçamento
            </button>
            <button
              type="button"
              onClick={resetChat}
              className="text-xs px-3 py-1 border rounded-full"
            >
              Reiniciar
            </button>
          </div>

          <div className="h-80 overflow-y-auto p-3 space-y-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`px-3 py-2 rounded-2xl text-sm whitespace-pre-line ${
                    m.role === "user" ? "bg-black text-white" : "bg-gray-100"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {loading && <div className="text-xs">Enviando…</div>}
            <div ref={endRef} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUser(input);
            }}
            className="p-3 border-t flex gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='Digite "ORÇAMENTO" ou sua dúvida…'
              className="flex-1 border rounded-xl px-3 py-2 text-sm"
            />
            <button
              className="px-4 py-2 bg-black text-white rounded-xl"
              disabled={loading}
            >
              Enviar
            </button>
          </form>
        </div>
      )}
    </>
  );
}

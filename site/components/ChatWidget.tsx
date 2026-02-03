"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Msg = { role: "bot" | "user"; text: string };

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
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim();
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // “modo orçamento” (coleta)
  const [flow, setFlow] = useState<"idle" | "collect_name" | "collect_phone" | "collect_city" | "collect_consumption" | "done">("idle");
  const [lead, setLead] = useState({ name: "", phone: "", city: "", consumption: "", systemType: "On-grid" });

  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const faq = useMemo(() => {
    return [
      {
        keys: ["preco", "valor", "quanto custa", "custa"],
        answer:
          "O valor depende do seu consumo (kWh), tipo de telhado e distância.\n" +
          "Se você me disser seu consumo médio (kWh/mês) e a cidade, eu já preparo um orçamento."
      },
      {
        keys: ["on grid", "ongrid"],
        answer:
          "On-grid é o sistema conectado à rede: você gera energia e compensa na conta.\n" +
          "É o mais comum e costuma ter melhor custo-benefício."
      },
      {
        keys: ["off grid", "offgrid"],
        answer:
          "Off-grid é o sistema com baterias (independente da rede).\n" +
          "Ideal para áreas sem rede ou quando você quer autonomia."
      },
      {
        keys: ["bombeamento", "bomba", "agua", "irrigacao", "poco"],
        answer:
          "Bombeamento solar usa energia do sol para acionar bomba d’água (irrigação/poço).\n" +
          "Se você me disser a vazão/altura manométrica (ou o modelo da bomba), eu te oriento."
      },
      {
        keys: ["prazo", "instalacao", "tempo"],
        answer:
          "O prazo varia conforme o projeto e agenda, mas normalmente dá pra evoluir bem rápido.\n" +
          "Se você quiser, eu já abro um pré-orçamento e um consultor confirma prazos."
      },
      {
        keys: ["garantia"],
        answer:
          "Em geral, equipamentos possuem garantia do fabricante e a instalação tem garantia do serviço.\n" +
          "No orçamento eu detalho certinho por item."
      }
    ];
  }, []);

  function add(role: Msg["role"], text: string) {
    setMessages((m) => [...m, { role, text }]);
  }

  async function submitLead(finalLead: typeof lead) {
    setLoading(true);
    try {
      const res = await fetch("/api/chat/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalLead)
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        add("bot", "Tive um problema ao enviar seu pedido agora 😕. Pode tentar novamente ou chamar no WhatsApp do site.");
        return;
      }

      add("bot", "Perfeito! ✅ Já registrei seu pedido de orçamento. Um consultor vai falar com você em breve.");
      if (data?.leadId) add("bot", `Protocolo: ${data.leadId}`);
      setFlow("done");
    } catch (e) {
      add("bot", "Falha de conexão no envio. Tente novamente em instantes.");
    } finally {
      setLoading(false);
    }
  }

  function handleUser(textRaw: string) {
    const text = textRaw.trim();
    if (!text) return;

    add("user", text);
    setInput("");

    const t = normalize(text);

    // fluxo de coleta
    if (flow === "collect_name") {
      setLead((l) => ({ ...l, name: text }));
      setFlow("collect_phone");
      add("bot", "Boa! Agora me informe seu telefone com DDD (ex: 61999999999).");
      return;
    }
    if (flow === "collect_phone") {
      const phone = text.replace(/\D/g, "");
      if (phone.length < 10) {
        add("bot", "Telefone inválido. Envie com DDD (ex: 61999999999).");
        return;
      }
      setLead((l) => ({ ...l, phone }));
      setFlow("collect_city");
      add("bot", "Perfeito. Qual sua cidade?");
      return;
    }
    if (flow === "collect_city") {
      setLead((l) => ({ ...l, city: text }));
      setFlow("collect_consumption");
      add("bot", "Por fim: qual seu consumo médio (kWh/mês)? (ex: 350)");
      return;
    }
    if (flow === "collect_consumption") {
      const kwh = text.replace(/[^\d]/g, "");
      if (!kwh) {
        add("bot", "Me envie somente o número do consumo em kWh (ex: 350).");
        return;
      }
      const finalLead = { ...lead, city: lead.city, name: lead.name, phone: lead.phone, consumption: kwh };
      setLead(finalLead);
      add("bot", "Show. Estou enviando seu pedido…");
      submitLead(finalLead);
      return;
    }

    // atalho “orçamento”
    if (t.includes("orcamento") || t.includes("orçamento") || t.includes("preco") || t.includes("valor")) {
      setFlow("collect_name");
      add("bot", "Perfeito. Vou montar seu pré-orçamento. Qual seu nome?");
      return;
    }

    // FAQ
    for (const item of faq) {
      if (item.keys.some((k) => t.includes(k))) {
        add("bot", item.answer);
        add("bot", "Se quiser, posso abrir um ORÇAMENTO rapidinho. É só dizer: ORÇAMENTO.");
        return;
      }
    }

    // fallback
    add(
      "bot",
      "Entendi 🙂\n" +
        "Você quer:\n" +
        "1) ORÇAMENTO (eu cadastro e envio pro consultor)\n" +
        "2) DÚVIDAS (on-grid/off-grid/bombeamento)\n\n" +
        "Digite: ORÇAMENTO ou me diga sua dúvida."
    );
  }

  return (
    <>
      {/* Botão flutuante */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-24 right-5 z-50 rounded-full shadow-lg px-4 py-3 bg-black text-white"
        aria-label="Abrir chat"
      >
        {open ? "Fechar" : "Chat"}
      </button>

      {/* Janela */}
      {open && (
        <div className="fixed bottom-36 right-5 z-50 w-[92vw] max-w-sm rounded-2xl shadow-2xl bg-white border overflow-hidden">
          <div className="px-4 py-3 bg-black text-white">
            <div className="font-semibold">DC Infinity Solar</div>
            <div className="text-xs opacity-80">Atendimento automático</div>
          </div>

          <div className="h-80 overflow-y-auto p-3 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`whitespace-pre-line max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                    m.role === "user" ? "bg-black text-white" : "bg-gray-100 text-gray-900"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="text-xs text-gray-500">Enviando…</div>
            )}
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
              placeholder="Digite aqui…"
              className="flex-1 rounded-xl border px-3 py-2 text-sm outline-none"
            />
            <button className="rounded-xl px-4 py-2 bg-black text-white text-sm">
              Enviar
            </button>
          </form>
        </div>
      )}
    </>
  );
}

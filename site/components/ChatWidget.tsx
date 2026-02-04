"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";

type Msg = { role: "bot" | "user"; text: string };

const STORAGE_KEY = "dcsolar_chat_v1";
const COOLDOWN_MS = 2 * 60 * 1000; // 2 min entre envios de lead

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

function onlyDigits(s: string) {
  return s.replace(/\D/g, "");
}

function formatPhoneBR(digits: string) {
  // formata básico para exibição, mas envia só dígitos
  const d = onlyDigits(digits).slice(0, 11);
  if (d.length <= 10) {
    // (DD) XXXX-XXXX
    return d
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }
  // (DD) 9XXXX-XXXX
  return d
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");
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
    systemType: "On-grid",
    originPath: "",
  });

  const [lastLeadAt, setLastLeadAt] = useState<number>(0);

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
      if (Array.isArray(parsed?.messages) && parsed.messages.length > 0) {
        setMessages(parsed.messages);
      }
      if (typeof parsed?.flow === "string") setFlow(parsed.flow);
      if (parsed?.lead) setLead((l) => ({ ...l, ...parsed.lead }));
      if (typeof parsed?.lastLeadAt === "number") setLastLeadAt(parsed.lastLeadAt);
    } catch {
      // ignore
    }
  }, []);

  // salvar conversa
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ messages, flow, lead, lastLeadAt })
      );
    } catch {
      // ignore
    }
  }, [messages, flow, lead, lastLeadAt]);

  // atualiza origem/página
  useEffect(() => {
    setLead((l) => ({ ...l, originPath: pathname || "/" }));
  }, [pathname]);

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
          "Se você me disser vazão/altura (ou o modelo da bomba), eu te oriento."
      },
      {
        keys: ["prazo", "instalacao", "tempo"],
        answer:
          "O prazo varia conforme o projeto e agenda, mas normalmente é bem rápido.\n" +
          "Se quiser, eu já abro um pré-orçamento e um consultor confirma os prazos."
      },
      {
        keys: ["garantia"],
        answer:
          "Em geral, os equipamentos têm garantia do fabricante e a instalação tem garantia do serviço.\n" +
          "No orçamento eu detalho certinho por item."
      }
    ];
  }, []);

  function add(role: Msg["role"], text: string) {
    setMessages((m) => [...m, { role, text }]);
  }

  function resetChat() {
    setMessages(initialMessages);
    setFlow("idle");
    setLead({ name: "", phone: "", city: "", consumption: "", systemType: "On-grid", originPath: pathname || "/" });
    // não zera lastLeadAt para manter o cooldown
    add("bot", "Conversa reiniciada ✅ Como posso te ajudar agora?");
  }

  async function submitLead(finalLead: typeof lead) {
    const now = Date.now();
    if (now - lastLeadAt < COOLDOWN_MS) {
      add("bot", "✅ Já recebi um pedido recente. Aguarde 2 min para enviar outro, ou clique em *Falar com humano*.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/chat/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalLead)
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        add("bot", "Tive um problema ao enviar agora 😕. Você pode tentar novamente ou falar com humano pelo WhatsApp.");
        return;
      }

      setLastLeadAt(now);
      add("bot", "Perfeito! ✅ Já registrei seu pedido. Um consultor vai falar com você em breve.");
      if (data?.leadId) add("bot", `Protocolo: ${data.leadId}`);
      setFlow("done");
    } catch {
      add("bot", "Falha de conexão ao enviar. Tente novamente em instantes.");
    } finally {
      setLoading(false);
    }
  }
  function replyDirect(answer: string) {
  add("bot", answer);
  add("bot", "Se quiser, posso abrir um ORÇAMENTO rapidinho. É só clicar em Orçamento 😉");
  }

  function handleUser(textRaw: string) {
    const text = textRaw.trim();
    if (!text) return;

    add("user", text);
    setInput("");

    const t = normalize(text);
    // Detecta interesse e salva no lead (quando o usuário digita)
    if (t.includes("off grid") || t.includes("offgrid")) {
      setLead((l) => ({ ...l, systemType: "Off-grid" }));
    }
    if (t.includes("bombeamento") || t.includes("bomba") || t.includes("poco") || t.includes("poço")) {
  setLead((l) => ({ ...l, systemType: "Bombeamento" }));
    }
    if (t.includes("on grid") || t.includes("ongrid")) {
       setLead((l) => ({ ...l, systemType: "On-grid" }));
    }

    // comandos rápidos
    if (t === "reset" || t === "reiniciar") {
      resetChat();
      return;
    }

    // fluxo de coleta
    if (flow === "collect_name") {
      const name = text.trim();
      if (name.length < 2) {
        add("bot", "Me diga um nome válido 🙂");
        return;
      }
      setLead((l) => ({ ...l, name }));
      setFlow("collect_phone");
      add("bot", "Boa! Agora me informe seu telefone com DDD (ex: 61999999999).");
      return;
    }

    if (flow === "collect_phone") {
      const phone = onlyDigits(text);
      if (phone.length < 10) {
        add("bot", "Telefone inválido. Envie com DDD (ex: 61999999999).");
        return;
      }
      setLead((l) => ({ ...l, phone }));
      setFlow("collect_city");
      add("bot", `Perfeito. Telefone: ${formatPhoneBR(phone)}.\nAgora, qual sua cidade?`);
      return;
    }

    if (flow === "collect_city") {
      const city = text.trim();
      if (city.length < 2) {
        add("bot", "Cidade inválida. Me diga sua cidade 🙂");
        return;
      }
      setLead((l) => ({ ...l, city }));
      setFlow("collect_consumption");
      add("bot", "Por fim: qual seu consumo médio (kWh/mês)? (ex: 350)");
      return;
    }

    if (flow === "collect_consumption") {
      const kwh = onlyDigits(text);
      if (!kwh) {
        add("bot", "Me envie somente o número do consumo em kWh (ex: 350).");
        return;
      }
      const finalLead = { ...lead, consumption: kwh, originPath: pathname || "/" };
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
        "Digite: ORÇAMENTO ou me diga sua dúvida.\n\n" +
        "Comandos: REINICIAR / RESET"
    );
  }

  const whatsappLink = "https://wa.me/5561999656269?text=" + encodeURIComponent(
    "Olá! Vim pelo site DC Infinity Solar e quero um orçamento."
  );

  return (
    <>
      {/* Botão flutuante (acima do WhatsApp) */}
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
          <div className="px-4 py-3 bg-black text-white flex items-center justify-between">
            <div>
              <div className="font-semibold">DC Infinity Solar</div>
              <div className="text-xs opacity-80">Atendimento automático</div>
            </div>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="text-xs bg-white/15 hover:bg-white/25 px-3 py-1 rounded-full"
              title="Falar com humano no WhatsApp"
            >
              Falar com humano
            </a>
          </div>
          {/* Botões rápidos */}
          <div className="px-3 py-2 border-b flex gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => {
                setLead((l) => ({ ...l, systemType: "On-grid" }));
                replyDirect(
                  "🔌 **On-grid** é o sistema conectado à rede elétrica.\n" +
                  "Você gera sua própria energia e o excedente vira crédito na conta de luz.\n" +
                  "É o mais usado e o que tem melhor custo-benefício."
               );
             }}
              className="text-xs px-3 py-1 rounded-full border bg-white hover:bg-gray-50"
            >
              On-grid
            </button>

            <button
              type="button"
              onClick={() => {
                setLead((l) => ({ ...l, systemType: "Off-grid" }));
                replyDirect(
                  "🔋 **Off-grid** é o sistema com baterias.\n" +
                  "Funciona sem depender da concessionária, ideal para locais sem rede ou quem quer autonomia total."
                );
              }}
              className="text-xs px-3 py-1 rounded-full border bg-white hover:bg-gray-50"
            >
              Off-grid
            </button>

            <button
              type="button"
              onClick={() => {
                setLead((l) => ({ ...l, systemType: "Bombeamento" }));
                replyDirect(
                  "💧 **Bombeamento solar** usa energia do sol para acionar bombas d’água.\n" +
                  "Muito usado em poços, irrigação e áreas rurais, reduzindo custo com energia."
                );
              }}
              className="text-xs px-3 py-1 rounded-full border bg-white hover:bg-gray-50"
            >
              Bombeamento
            </button>

             <button
               type="button"
               onClick={() => {
                 setFlow("collect_name");
                 add("bot", "Perfeito 😄 Vamos ao orçamento. Qual seu nome?");
                }}
                className="text-xs px-3 py-1 rounded-full border bg-white hover:bg-gray-50"
              >
                Orçamento
              </button>

               <button
                 type="button"
                 onClick={() =>
                 replyDirect(
                   "🛡️ Os equipamentos possuem garantia do fabricante e a instalação tem garantia do serviço.\nNo orçamento eu explico tudo certinho."
                 )
               }
               className="text-xs px-3 py-1 rounded-full border bg-white hover:bg-gray-50"
              >
               Garantia
              </button>
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
            {loading && <div className="text-xs text-gray-500">Enviando…</div>}
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
              className="flex-1 rounded-xl border px-3 py-2 text-sm outline-none"
            />
            <button className="rounded-xl px-4 py-2 bg-black text-white text-sm" disabled={loading}>
              Enviar
            </button>
          </form>
        </div>
      )}
    </>
  );
}

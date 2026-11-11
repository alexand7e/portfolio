"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import type { Language } from "@/lib/translations";

type LineKind = "system" | "byte" | "run" | "success" | "error" | "user" | "link";
type Line = { kind: LineKind; text: string; href?: string };
type CommandId = "projects" | "stack" | "contact" | "experience" | "about" | "content";
type Target = CommandId | "help" | "clear";

// `run` é impresso na hora e segura a resposta um instante, como uma execução.
type Script = { run?: string; lines: Line[] };

// Funções que o terminal conhece: alimentam o autocomplete e o roteamento exato.
const FUNCTIONS: { name: string; target: Target }[] = [
    { name: "ask_about_projects()", target: "projects" },
    { name: "get_tech_stack()", target: "stack" },
    { name: "contact_alexandre()", target: "contact" },
    { name: "get_experience()", target: "experience" },
    { name: "whoami()", target: "about" },
    { name: "list_content()", target: "content" },
    { name: "help()", target: "help" },
    { name: "clear()", target: "clear" },
];

const PREFIX: Record<LineKind, string> = {
    system: "[SYSTEM]:",
    byte: "[BYTE]:",
    run: ">",
    success: "[SUCCESS]:",
    error: "[ERROR]:",
    user: "$",
    link: "→",
};

const PREFIX_COLOR: Record<LineKind, string> = {
    system: "text-tertiary/40",
    byte: "text-accent",
    run: "text-tertiary/40",
    success: "text-accent",
    error: "text-amber-500",
    user: "text-accent",
    link: "text-accent",
};

const TEXT_COLOR: Record<LineKind, string> = {
    system: "text-tertiary/50",
    byte: "text-tertiary/90",
    run: "text-tertiary/50",
    success: "text-accent/90",
    error: "text-tertiary/80",
    user: "text-tertiary",
    link: "text-accent",
};

const COPY: Record<Language, {
    welcome: Line[];
    placeholder: string;
    inputLabel: string;
    suggestionsLabel: string;
    rateLimited: string;
    searching: (term: string) => string;
    found: (count: number, term: string) => string;
    foundHint: string;
    notFound: (term: string) => string;
    searchFailed: string;
    hints: Record<Target, string>;
    commands: Record<CommandId, Script>;
    help: Script;
    unknown: Script;
}> = {
    pt: {
        welcome: [
            { kind: "system", text: "Assistente ativado." },
            { kind: "byte", text: "Olá! Pergunte algo sobre o Alexandre ou digite help() para ver as funções." },
        ],
        placeholder: "Pergunte algo ou digite help()",
        inputLabel: "Pergunte algo sobre o Alexandre",
        suggestionsLabel: "Funções disponíveis",
        rateLimited: "Muitos comandos seguidos. Aguarde alguns segundos.",
        searching: term => `Running search("${term}")...`,
        found: (count, term) => count === 1
            ? `1 publicação sobre "${term}":`
            : `${count} publicações sobre "${term}":`,
        foundHint: "Quer mais resultados? Use a busca do topo (Ctrl+K).",
        notFound: term => `Nada publicado sobre "${term}" ainda.`,
        searchFailed: "Busca indisponível agora. Tente de novo em instantes.",
        hints: {
            projects: "projetos em destaque",
            stack: "tecnologias",
            contact: "e-mail, GitHub e LinkedIn",
            experience: "onde trabalha",
            about: "quem é o Alexandre",
            content: "blog e tutoriais",
            help: "lista os comandos",
            clear: "limpa a tela",
        },
        commands: {
            projects: {
                run: "Running projects_query...",
                lines: [
                    { kind: "success", text: "Encontrados projetos no setor público e privado em IA e Data Science." },
                    { kind: "byte", text: "Deseja ver os destaques em Next.js e Python?" },
                    { kind: "link", text: "ver projetos em destaque", href: "#projects" },
                ],
            },
            stack: {
                run: "Running get_tech_stack...",
                lines: [
                    { kind: "success", text: "Python · FastAPI · Next.js · TypeScript · PostgreSQL · Docker" },
                    { kind: "byte", text: "Dados e IA no back, Next.js no front. A lista completa está nas skills." },
                    { kind: "link", text: "ver skills", href: "#skills" },
                ],
            },
            contact: {
                run: "Running contact_alexandre...",
                lines: [
                    { kind: "success", text: "Canal aberto: contato@alexand7e.dev.br" },
                    { kind: "byte", text: "Ele também está no GitHub e no LinkedIn, e o formulário fica logo abaixo." },
                    { kind: "link", text: "github.com/alexand7e", href: "https://github.com/alexand7e" },
                    { kind: "link", text: "linkedin.com/in/alexand7e", href: "https://www.linkedin.com/in/alexand7e" },
                    { kind: "link", text: "ir para o formulário", href: "#contact" },
                ],
            },
            experience: {
                run: "Running get_experience...",
                lines: [
                    { kind: "success", text: "Gerente de Programas em IA na SIA-PI (Secretaria de Inteligência Artificial)." },
                    { kind: "byte", text: "Ele também é Co-Founder & CTO na Teaser." },
                    { kind: "link", text: "ver a trajetória completa", href: "#experience" },
                ],
            },
            about: {
                run: "Running whoami...",
                lines: [
                    { kind: "success", text: "Alexandre Barros: dados, IA e desenvolvimento full-stack." },
                    { kind: "byte", text: "Desde 2022 transforma dados em decisões no setor público e no privado." },
                    { kind: "link", text: "ver o que ele faz", href: "#services" },
                ],
            },
            content: {
                run: "Running list_content...",
                lines: [
                    { kind: "success", text: "Artigos sobre IA, dados e tecnologia, além de tutoriais passo a passo." },
                    { kind: "byte", text: "Por onde quer começar?" },
                    { kind: "link", text: "ler o blog", href: "/blog" },
                    { kind: "link", text: "abrir os tutoriais", href: "/tutoriais" },
                ],
            },
        },
        help: {
            lines: [
                { kind: "system", text: "Funções: ask_about_projects · get_tech_stack · contact_alexandre · get_experience · whoami · list_content · clear" },
                { kind: "byte", text: "Digite o começo de uma função e aperte Tab, ou pergunte em texto livre." },
            ],
        },
        unknown: {
            run: "Running answer_query...",
            lines: [
                { kind: "error", text: "Pergunta fora do meu roteiro." },
                { kind: "byte", text: "Sou um assistente roteirizado: pergunte sobre projetos, experiência, stack, conteúdo ou contato." },
            ],
        },
    },
    en: {
        welcome: [
            { kind: "system", text: "Assistant enabled." },
            { kind: "byte", text: "Hi! Ask something about Alexandre or type help() to list the functions." },
        ],
        placeholder: "Ask something or type help()",
        inputLabel: "Ask something about Alexandre",
        suggestionsLabel: "Available functions",
        rateLimited: "Too many commands in a row. Wait a few seconds.",
        searching: term => `Running search("${term}")...`,
        found: (count, term) => count === 1
            ? `1 publication about "${term}":`
            : `${count} publications about "${term}":`,
        foundHint: "Want more results? Use the search at the top (Ctrl+K).",
        notFound: term => `Nothing published about "${term}" yet.`,
        searchFailed: "Search is unavailable right now. Try again shortly.",
        hints: {
            projects: "featured projects",
            stack: "technologies",
            contact: "email, GitHub and LinkedIn",
            experience: "where he works",
            about: "who Alexandre is",
            content: "blog and tutorials",
            help: "list commands",
            clear: "clear the screen",
        },
        commands: {
            projects: {
                run: "Running projects_query...",
                lines: [
                    { kind: "success", text: "Found AI and Data Science projects in the public and private sectors." },
                    { kind: "byte", text: "Want to see the Next.js and Python highlights?" },
                    { kind: "link", text: "see featured projects", href: "#projects" },
                ],
            },
            stack: {
                run: "Running get_tech_stack...",
                lines: [
                    { kind: "success", text: "Python · FastAPI · Next.js · TypeScript · PostgreSQL · Docker" },
                    { kind: "byte", text: "Data and AI on the back end, Next.js on the front. The full list is under skills." },
                    { kind: "link", text: "see skills", href: "#skills" },
                ],
            },
            contact: {
                run: "Running contact_alexandre...",
                lines: [
                    { kind: "success", text: "Channel open: contato@alexand7e.dev.br" },
                    { kind: "byte", text: "He is also on GitHub and LinkedIn, and the form is right below." },
                    { kind: "link", text: "github.com/alexand7e", href: "https://github.com/alexand7e" },
                    { kind: "link", text: "linkedin.com/in/alexand7e", href: "https://www.linkedin.com/in/alexand7e" },
                    { kind: "link", text: "go to the form", href: "#contact" },
                ],
            },
            experience: {
                run: "Running get_experience...",
                lines: [
                    { kind: "success", text: "AI Program Manager at SIA-PI (Artificial Intelligence Secretariat)." },
                    { kind: "byte", text: "He is also Co-Founder & CTO at Teaser." },
                    { kind: "link", text: "see the full journey", href: "#experience" },
                ],
            },
            about: {
                run: "Running whoami...",
                lines: [
                    { kind: "success", text: "Alexandre Barros: data, AI and full-stack development." },
                    { kind: "byte", text: "Since 2022 he has been turning data into decisions in the public and private sectors." },
                    { kind: "link", text: "see what he does", href: "#services" },
                ],
            },
            content: {
                run: "Running list_content...",
                lines: [
                    { kind: "success", text: "Articles on AI, data and technology, plus step-by-step tutorials." },
                    { kind: "byte", text: "Where do you want to start?" },
                    { kind: "link", text: "read the blog", href: "/blog" },
                    { kind: "link", text: "open the tutorials", href: "/tutoriais" },
                ],
            },
        },
        help: {
            lines: [
                { kind: "system", text: "Functions: ask_about_projects · get_tech_stack · contact_alexandre · get_experience · whoami · list_content · clear" },
                { kind: "byte", text: "Type the start of a function and press Tab, or ask in plain text." },
            ],
        },
        unknown: {
            run: "Running answer_query...",
            lines: [
                { kind: "error", text: "Question outside my script." },
                { kind: "byte", text: "I'm a scripted assistant: ask about projects, experience, stack, content or contact." },
            ],
        },
    },
};

// O terminal não faz requisições: tudo roda no navegador. Os limites abaixo evitam
// que entrada colada ou disparos em sequência travem a aba ou inflem o histórico.
export const MAX_INPUT = 120;
const MAX_LINES = 200;
const RATE_WINDOW_MS = 10_000;
const RATE_MAX = 6;

// Controles (Cc) e caracteres de formatação invisíveis (Cf: zero-width, bidi, BOM).
// Via construtor porque `\p{}` literal exige target ES2018 no TypeScript.
const INVISIBLE = new RegExp("[\\p{Cc}\\p{Cf}]", "gu");

// Saneia a entrada antes de rotear ou exibir: colapsa espaços, remove invisíveis e corta no limite.
// A exibição já é segura (React escapa texto); isto evita eco enganoso e trabalho desnecessário.
export function sanitize (input: string) {
    return input
        .normalize("NFC")
        .replace(/\s+/g, " ")
        .replace(INVISIBLE, "")
        .replace(/ {2,}/g, " ")
        .trim()
        .slice(0, MAX_INPUT);
}

const normalize = (text: string) => text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();

// Roteia a entrada: nome exato de função primeiro, depois palavra-chave.
// A ordem importa: "onde ele trabalha" é experiência, "seus trabalhos" é projetos.
export function route (input: string): Target | null {
    const q = normalize(input).replace(/^[>$]\s*/, "");
    const bare = q.replace(/\(\)$/, "");

    const exact = FUNCTIONS.find(fn => fn.name.replace(/\(\)$/, "") === bare);
    if (exact) return exact.target;

    if (/^(limpar|cls)$/.test(bare)) return "clear";
    if (/^(ajuda|comandos|commands|\?)$/.test(bare)) return "help";
    if (/\btrabalha\b|onde .*trabalh|emprego|cargo|empresa|experienc|carreira|\batua|sia-?pi|teaser|where .*work|works (at|for)|\bjob|company|career|\brole\b|position|employ/.test(q)) return "experience";
    if (/projet|project|portf|trabalhos|\bcase|\bwork\b/.test(q)) return "projects";
    if (/stack|tecnolog|tech|skill|habilidade|python|next|fastapi|ferramenta|linguage|\btool/.test(q)) return "stack";
    if (/contat|contact|email|e-mail|linkedin|github|git hub|redes sociais|social media|falar|conversar|\btalk|hire|contrat/.test(q)) return "contact";
    if (/blog|artigo|article|\bpost|escrev|write|tutori|\baula|curso|course|trilha|conteudo|content|\bler\b|\bread/.test(q)) return "content";
    if (/quem|whoami|\bwho\b|about (him|alexandre)|sobre (ele|o alexandre|voce)\b|\bbio\b|apresent|formac|perfil|profile/.test(q)) return "about";
    return null;
}

// Sugestões só para quem está digitando uma função (sem espaços); prefixo vem antes de trecho.
export function suggest (input: string) {
    const q = normalize(input).replace(/^[>$]\s*/, "");
    if (!q || /\s/.test(q)) return [];
    const prefix = FUNCTIONS.filter(fn => fn.name.startsWith(q));
    const partial = q.length >= 2
        ? FUNCTIONS.filter(fn => !fn.name.startsWith(q) && fn.name.includes(q))
        : [];
    return [...prefix, ...partial].filter(fn => fn.name !== q);
}

// Palavras que não identificam um assunto: pronomes, conectivos e o próprio vocabulário do roteiro.
const STOPWORDS = new Set([
    "a", "o", "as", "os", "um", "uma", "de", "do", "da", "dos", "das", "em", "no", "na", "nos", "nas",
    "por", "para", "pra", "com", "sem", "sobre", "que", "qual", "quais", "quem", "como", "onde", "quando",
    "porque", "e", "ou", "ele", "ela", "voce", "vc", "seu", "sua", "dele", "dela", "tem", "ter", "existe",
    "algum", "alguma", "algo", "isso", "esse", "essa", "me", "mostre", "mostra", "fale", "fala", "falou",
    "conte", "diga", "acha", "pensa", "opiniao", "escreveu", "escreve", "escrito", "artigo", "artigos",
    "post", "posts", "blog", "texto", "textos", "tutorial", "tutoriais", "conteudo", "conteudos", "ler",
    "alexandre", "barros",
    "the", "an", "of", "on", "in", "about", "what", "which", "who", "how", "where", "when", "is", "are",
    "does", "do", "did", "he", "his", "him", "any", "have", "has", "there", "article", "articles",
    "write", "wrote", "written", "think", "say", "said", "show", "tell", "me", "read", "content",
]);

const WORD_SPLIT = new RegExp("[^\\p{L}\\p{N}-]+", "u");

// Escolhe a palavra mais longa que não seja stopword: "o que ele escreveu sobre LGPD?" -> "lgpd".
// Mantém os acentos, porque a busca no banco compara o texto como foi escrito.
export function searchTerm (question: string) {
    const words = question.toLowerCase().split(WORD_SPLIT)
        .filter(word => word.length >= 3 && !STOPWORDS.has(normalize(word)));
    if (words.length === 0) return null;
    return words.reduce((longest, word) => word.length > longest.length ? word : longest);
}

const wait = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

type SearchResult = { type: "blog" | "tutorial" | "talk"; href: string; title: string };

// Janela deslizante: no máximo RATE_MAX comandos a cada RATE_WINDOW_MS.
// Fica fora do componente porque o React Compiler não aceita Date.now() no corpo dele.
export function consumeRateSlot (hits: number[], now = Date.now()) {
    const recent = hits.filter(hit => now - hit < RATE_WINDOW_MS);
    const allowed = recent.length < RATE_MAX;
    return { allowed, hits: allowed ? [...recent, now] : recent };
}

// Mantém só as últimas MAX_LINES linhas do histórico.
const append = (prev: Line[], ...next: Line[]) => [...prev, ...next].slice(-MAX_LINES);

const TerminalLine = ({ line, cursor }: { line: Line; cursor?: boolean }) => (
    <p className={`break-words ${line.kind === "user" ? "mt-4 first:mt-0" : ""}`}>
        <span className={PREFIX_COLOR[line.kind]}>{PREFIX[line.kind]}</span>{" "}
        {line.href ? (
            <a
                href={line.href}
                {...(line.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className={`${TEXT_COLOR[line.kind]} underline decoration-accent/40 underline-offset-4 hover:decoration-accent`}
            >
                {line.text}
            </a>
        ) : (
            <span className={TEXT_COLOR[line.kind]}>{line.text}</span>
        )}
        {cursor && <span className="ml-0.5 text-accent motion-safe:animate-pulse">▋</span>}
    </p>
);

// Montado com key={language} na home: trocar o idioma remonta e refaz as boas-vindas.
export default function AgentTerminal ({ language }: { language: Language }) {
    const copy = COPY[language];
    const reduce = useReducedMotion();

    const [lines, setLines] = useState<Line[]>([]);
    const [typing, setTyping] = useState<Line | null>(null);
    const [busy, setBusy] = useState(true);
    const [input, setInput] = useState("");
    const [activeIndex, setActiveIndex] = useState(0);
    const [dismissed, setDismissed] = useState(false);

    // Cada execução ganha um id; uma execução mais nova (ou o unmount) invalida as antigas.
    const runRef = useRef(0);
    const hitsRef = useRef<number[]>([]);
    const outputRef = useRef<HTMLDivElement>(null);

    const suggestions = dismissed ? [] : suggest(input);
    const open = suggestions.length > 0;
    const active = open ? suggestions[Math.min(activeIndex, suggestions.length - 1)] : null;
    const typed = input.trimStart();
    const ghost = active && active.name.startsWith(normalize(typed)) ? active.name.slice(typed.length) : "";

    const typeLines = useCallback(async (toType: Line[], run: number) => {
        for (const line of toType) {
            if (runRef.current !== run) return false;
            if (!reduce && line.kind !== "link") {
                for (let i = 1; i < line.text.length; i += 2) {
                    if (runRef.current !== run) return false;
                    setTyping({ ...line, text: line.text.slice(0, i) });
                    await wait(18);
                }
            }
            setTyping(null);
            setLines(prev => append(prev, line));
        }
        return runRef.current === run;
    }, [reduce]);

    const execute = useCallback(async (script: Script, echo: string) => {
        const run = ++runRef.current;
        setBusy(true);
        setLines(prev => append(
            prev,
            { kind: "user", text: echo },
            ...(script.run ? [{ kind: "run" as const, text: script.run }] : []),
        ));

        if (script.run) await wait(reduce ? 150 : 650);
        if (await typeLines(script.lines, run)) setBusy(false);
    }, [reduce, typeLines]);

    // Busca no blog/tutoriais pela mesma API da busca do site (que também limita por IP).
    const searchContent = useCallback(async (term: string, echo: string) => {
        const run = ++runRef.current;
        setBusy(true);
        setLines(prev => append(prev, { kind: "user", text: echo }, { kind: "run", text: copy.searching(term) }));

        let answer: Line[];
        try {
            const response = await fetch(`/api/search?q=${encodeURIComponent(term)}`, {
                signal: AbortSignal.timeout(6000),
            });
            if (response.status === 429) {
                answer = [{ kind: "error", text: copy.rateLimited }];
            } else if (!response.ok) {
                throw new Error(`search ${response.status}`);
            } else {
                const { results } = await response.json() as { results: SearchResult[] };
                // Só links internos: o href vem do banco e vira um <a> no terminal.
                const found = results.filter(result => result.href.startsWith("/")).slice(0, 3);
                answer = found.length > 0
                    ? [
                        { kind: "success", text: copy.found(found.length, term) },
                        ...found.map(result => ({ kind: "link" as const, text: result.title, href: result.href })),
                        { kind: "byte", text: copy.foundHint },
                    ]
                    : [
                        { kind: "error", text: copy.notFound(term) },
                        copy.unknown.lines[copy.unknown.lines.length - 1],
                    ];
            }
        } catch {
            answer = [{ kind: "error", text: copy.searchFailed }];
        }

        if (runRef.current !== run) return;
        if (await typeLines(answer, run)) setBusy(false);
    }, [copy, typeLines]);

    // Janela de comandos por aba; avisa uma vez só, sem empilhar o mesmo aviso a cada Enter.
    const admit = () => {
        if (busy) return false;
        const { allowed, hits } = consumeRateSlot(hitsRef.current);
        hitsRef.current = hits;
        if (!allowed) {
            setLines(prev => prev[prev.length - 1]?.text === copy.rateLimited
                ? prev
                : append(prev, { kind: "error", text: copy.rateLimited }));
        }
        return allowed;
    };

    const runTarget = (target: Target | null, echo: string) => {
        if (!admit()) return;
        if (target === "clear") {
            setLines([]);
            return;
        }
        const script = target === "help"
            ? copy.help
            : target
                ? copy.commands[target]
                : copy.unknown;
        execute(script, echo);
    };

    useEffect(() => {
        const run = ++runRef.current;

        const welcome = async () => {
            await wait(400);
            if (await typeLines(copy.welcome, run)) setBusy(false);
        };
        welcome();

        return () => {
            runRef.current++;
        };
    }, [copy.welcome, typeLines]);

    // Rola só a área de saída, sem arrastar a página junto.
    useEffect(() => {
        const output = outputRef.current;
        if (output) output.scrollTop = output.scrollHeight;
    }, [lines, typing]);

    const updateInput = (value: string) => {
        setInput(value);
        setActiveIndex(0);
        setDismissed(false);
    };

    const pick = (fn: { name: string; target: Target }) => {
        if (busy) return;
        updateInput("");
        runTarget(fn.target, fn.name);
    };

    const onSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (busy) return;
        // Enter com sugestões abertas executa a destacada, como num shell com completion.
        if (active) {
            pick(active);
            return;
        }
        const question = sanitize(input);
        updateInput("");
        if (!question) return;

        // Fora do roteiro (ou "o que ele escreveu sobre X"), procura publicações sobre o assunto.
        const target = route(question);
        const term = searchTerm(question);
        if (term && (target === null || target === "content")) {
            if (admit()) searchContent(term, question);
            return;
        }
        runTarget(target, question);
    };

    const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (!open) return;
        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            const step = event.key === "ArrowDown" ? 1 : -1;
            setActiveIndex(index => (index + step + suggestions.length) % suggestions.length);
        } else if (event.key === "Tab" && active) {
            event.preventDefault();
            updateInput(active.name);
        } else if (event.key === "Escape") {
            setDismissed(true);
        }
    };

    return (
        <div
            className="relative w-full rounded-xl border border-hairline-strong bg-secondary text-[13px] leading-relaxed text-left"
            style={{ boxShadow: "0 30px 60px -30px rgb(0 0 0 / 0.6), 0 0 0 1px rgb(var(--c-accent) / 0.08)" }}
        >
            {/* Barra da janela, estilo macOS */}
            <div className="relative flex items-center h-10 px-4 border-b border-hairline">
                <div className="flex gap-2" aria-hidden>
                    <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                    <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
                    <span className="w-3 h-3 rounded-full bg-[#28c840]" />
                </div>
                <span className="absolute inset-x-0 text-center text-xs text-tertiary/50 pointer-events-none">
                    alexandre<span className="text-accent">.ai</span>
                </span>
            </div>

            {/* Saída */}
            <div ref={outputRef} className="h-64 sm:h-72 overflow-y-auto px-5 py-5">
                <div role="log" aria-live="polite" className="flex flex-col gap-1">
                    {lines.map((line, index) => (
                        <TerminalLine key={index} line={line} />
                    ))}
                </div>
                {typing && (
                    <div aria-hidden className="mt-1">
                        <TerminalLine line={typing} cursor />
                    </div>
                )}
            </div>

            {/* Prompt com autocomplete das funções */}
            <form onSubmit={onSubmit} className="relative border-t border-hairline">
                {open && (
                    <ul
                        id="agent-terminal-suggestions"
                        role="listbox"
                        aria-label={copy.suggestionsLabel}
                        className="absolute bottom-full left-3 right-3 mb-2 z-20 overflow-hidden rounded-lg border border-hairline-strong bg-primary py-1 shadow-xl"
                    >
                        {suggestions.map(fn => (
                            <li
                                key={fn.name}
                                id={`agent-fn-${fn.target}`}
                                role="option"
                                aria-selected={fn === active}
                                // mousedown para não tirar o foco do input antes do clique
                                onMouseDown={event => {
                                    event.preventDefault();
                                    pick(fn);
                                }}
                                onMouseEnter={() => setActiveIndex(suggestions.indexOf(fn))}
                                className={`flex items-center justify-between gap-4 px-3 py-1.5 cursor-pointer ${fn === active ? "bg-accent/10 text-accent" : "text-tertiary/80"}`}
                            >
                                <span className="truncate">{fn.name}</span>
                                <span className="shrink-0 text-[11px] text-tertiary/40">{copy.hints[fn.target]}</span>
                            </li>
                        ))}
                    </ul>
                )}

                <div className="flex items-center gap-3 px-5 py-3.5">
                    <span className="shrink-0 text-accent" aria-hidden>❯</span>
                    <label htmlFor="agent-terminal-input" className="sr-only">{copy.inputLabel}</label>
                    <div className="relative flex-1 min-w-0">
                        {/* Sugestão "fantasma" alinhada ao que já foi digitado */}
                        {ghost && (
                            <span aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden whitespace-pre text-tertiary/30">
                                <span className="invisible">{typed}</span>{ghost}
                            </span>
                        )}
                        <input
                            id="agent-terminal-input"
                            role="combobox"
                            aria-expanded={open}
                            aria-controls="agent-terminal-suggestions"
                            aria-autocomplete="list"
                            aria-activedescendant={active ? `agent-fn-${active.target}` : undefined}
                            value={input}
                            onChange={event => updateInput(event.target.value)}
                            onKeyDown={onKeyDown}
                            onBlur={() => setDismissed(true)}
                            onFocus={() => setDismissed(false)}
                            placeholder={copy.placeholder}
                            autoComplete="off"
                            spellCheck={false}
                            maxLength={MAX_INPUT}
                            className="relative w-full bg-transparent text-tertiary placeholder:text-tertiary/35 outline-none"
                        />
                    </div>
                </div>
            </form>
        </div>
    );
}

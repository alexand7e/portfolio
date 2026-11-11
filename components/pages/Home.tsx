"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useLanguage } from "@/lib/useLanguage";
import { FiGithub, FiLinkedin, FiMail } from "react-icons/fi";
import SiaContainer from "@/components/ui/SiaContainer";
import AgentTerminal from "@/components/ui/AgentTerminal";
import Reveal from "@/components/animations/Reveal";

const TAGS = ["Python", "Data Science", "IA", "Next.js", "FastAPI", "Setor Público"];

export default function HomePage ({
    id
}: {
    id?: string
}) {
    const { t, language } = useLanguage();
    const [stats, setStats] = useState([
        { value: "0+", label: "Anos no GitHub" },
        { value: "0+", label: "Repositórios" },
        { value: "0+", label: "Stars" },
        { value: "0+", label: "Seguidores" },
    ]);

    useEffect(() => {
        const fetchGithubStats = async () => {
            try {
                const userResponse = await fetch('https://api.github.com/users/alexand7e');
                if (!userResponse.ok) throw new Error('User not found');
                const userData = await userResponse.json();

                const reposResponse = await fetch('https://api.github.com/users/alexand7e/repos');
                if (!reposResponse.ok) throw new Error('Repos not found');
                const reposData = await reposResponse.json();

                const totalStars = reposData.reduce((acc: number, repo: any) => acc + repo.stargazers_count, 0);
                const yearsOnGitHub = new Date().getFullYear() - new Date(userData.created_at).getFullYear();

                setStats([
                    { value: `${yearsOnGitHub}+`, label: "Anos no GitHub" },
                    { value: `${userData.public_repos}`, label: "Repositórios" },
                    { value: `${totalStars}`, label: "Stars" },
                    { value: `${userData.followers}`, label: "Seguidores" },
                ]);
            } catch (error) {
                console.error("Failed to fetch GitHub stats:", error);
            }
        };

        fetchGithubStats();
    }, []);

    return (
        <section
            id={`${id}`}
            className="relative w-full overflow-hidden pt-14 md:pt-20"
        >
            <SiaContainer>
                <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 lg:gap-12 xl:gap-16 px-10 md:px-12 xl:px-16 pb-14 md:pb-20">
                    {/* Coluna texto */}
                    <div className="flex flex-col gap-6 items-center lg:items-start text-center lg:text-left min-w-0">
                        {/* Badge de cargo */}
                        <Reveal>
                            <div className="inline-flex items-center gap-2 border border-accent/30 rounded-full px-4 py-1.5 text-xs text-accent/80 bg-accent/5">
                                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                                Gerente de Programas em IA · SIA-PI
                            </div>
                        </Reveal>

                        <Reveal delay={0.06}>
                            <div className="text-4xl md:text-5xl xl:text-6xl leading-[1.1] font-bold">
                                <h1 className="text-tertiary/60">{t("home.subtitle")}</h1>
                                <h2 className="text-tertiary mt-1">
                                    Alexandre <span className="text-accent">Barros</span>
                                    <span className="text-accent">.</span>
                                </h2>
                            </div>
                        </Reveal>

                        <Reveal delay={0.12}>
                            <p className="max-w-lg text-sm lg:text-base text-tertiary/70 leading-relaxed">
                                {t("home.description")}
                            </p>
                        </Reveal>

                        {/* Tags de tecnologia */}
                        <Reveal delay={0.18}>
                            <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                                {TAGS.map(tag => (
                                    <span
                                        key={tag}
                                        className="text-[11px] px-3 py-1 rounded-full border border-hairline-strong text-tertiary/70"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </Reveal>

                        {/* CTAs e social */}
                        <Reveal delay={0.24}>
                            <div className="flex flex-wrap items-center gap-4 mt-2">
                            <Link
                                href="#projects"
                                className="border-2 border-accent bg-accent px-6 py-2.5 text-primary rounded-full font-bold hover:bg-accent/90 transition-all text-sm"
                            >
                                {language === "en" ? "View Projects" : "Conheça os Projetos"}
                            </Link>
                            <Link
                                href="#contact"
                                className="border-2 border-accent px-6 py-2.5 text-accent rounded-full font-bold hover:bg-accent/10 transition-all text-sm"
                            >
                                {t("home.contactButton")}
                            </Link>

                            <div className="flex items-center gap-3 text-tertiary/50">
                                <a href="https://github.com/alexand7e" target="_blank" rel="noopener noreferrer"
                                   className="hover:text-accent transition-colors">
                                    <FiGithub size={18} />
                                </a>
                                <a href="https://www.linkedin.com/in/alexand7e" target="_blank" rel="noopener noreferrer"
                                   className="hover:text-accent transition-colors">
                                    <FiLinkedin size={18} />
                                </a>
                                <a href="mailto:contato@alexand7e.dev.br"
                                   className="hover:text-accent transition-colors">
                                    <FiMail size={18} />
                                </a>
                            </div>
                            </div>
                        </Reveal>
                    </div>

                    {/* Coluna terminal — playground do assistente */}
                    <Reveal delay={0.15} className="w-full max-w-xl mx-auto lg:max-w-none min-w-0">
                        <AgentTerminal key={language} language={language} />
                    </Reveal>
                </div>

                {/* Stats — rodapé da seção */}
                <div className="border-t border-hairline">
                    <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-hairline">
                        {stats.map((stat, index) => (
                            <Reveal key={index} delay={0.1 + index * 0.06} className="flex flex-col items-center gap-1 py-6 px-6 md:px-10">
                                <span className="text-accent text-2xl md:text-3xl font-bold">{stat.value}</span>
                                <span className="text-[11px] text-tertiary/60 uppercase tracking-widest">{stat.label}</span>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </SiaContainer>
        </section>
    )
}

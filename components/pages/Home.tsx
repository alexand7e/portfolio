"use client";
import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useLanguage } from "@/lib/useLanguage";
import { FiGithub, FiLinkedin, FiMail } from "react-icons/fi";

const TAGS = ["Python", "Data Science", "IA", "Next.js", "FastAPI", "Setor Público"];

export default function HomePage ({
    id
}: {
    id?: string
}) {
    const { t } = useLanguage();
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
            className="relative w-full bg-primary overflow-hidden flex flex-col min-h-[calc(100vh-4.5rem)]"
        >
            {/* Blob de brilho atrás da imagem */}
            <div className="pointer-events-none absolute right-0 top-0 w-[600px] h-[600px] -translate-y-1/4 translate-x-1/4 rounded-full bg-accent/5 blur-3xl" />

            {/* Conteúdo principal */}
            <div className="relative flex flex-col lg:flex-row items-center justify-between gap-12
                            flex-1 w-full max-w-7xl mx-auto px-8 md:px-14 xl:px-20 py-12 lg:py-0">

                {/* Coluna texto */}
                <div className="flex flex-col gap-5 items-center lg:items-start text-center lg:text-left flex-1 min-w-0">

                    {/* Badge de cargo */}
                    <div className="inline-flex items-center gap-2 border border-accent/30 rounded-full px-4 py-1.5 text-xs text-accent/80 bg-accent/5">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                        Gerente de IA · SIA-PI
                    </div>

                    <div className="text-4xl md:text-5xl xl:text-6xl leading-[1.1] font-bold">
                        <h1 className="text-tertiary/60">{t("home.subtitle")}</h1>
                        <h2 className="text-tertiary mt-1">
                            Alexandre <span className="text-accent">Barros</span>
                            <span className="text-accent">.</span>
                        </h2>
                    </div>

                    <p className="max-w-lg text-sm lg:text-base text-tertiary/50 leading-relaxed">
                        {t("home.description")}
                    </p>

                    {/* Tags de tecnologia */}
                    <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                        {TAGS.map(tag => (
                            <span
                                key={tag}
                                className="text-[11px] px-3 py-1 rounded-full border border-tertiary/10 text-tertiary/40 bg-tertiary/5"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>

                    {/* CTAs e social */}
                    <div className="flex flex-wrap items-center gap-4 mt-2">
                        <Link
                            href="#contact"
                            className="border-2 border-accent px-6 py-2.5 text-accent rounded-full font-bold hover:bg-accent hover:text-primary transition-all text-sm"
                        >
                            {t("home.contactButton")}
                        </Link>

                        <div className="flex items-center gap-3 text-tertiary/40">
                            <a href="https://github.com/alexand7e" target="_blank" rel="noopener noreferrer"
                               className="hover:text-accent transition-colors">
                                <FiGithub size={18} />
                            </a>
                            <a href="https://linkedin.com/in/alexandrebarros" target="_blank" rel="noopener noreferrer"
                               className="hover:text-accent transition-colors">
                                <FiLinkedin size={18} />
                            </a>
                            <a href="mailto:contato@alexand7e.dev.br"
                               className="hover:text-accent transition-colors">
                                <FiMail size={18} />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Coluna imagem */}
                <div className="relative shrink-0 flex items-center justify-center">
                    {/* Anel externo decorativo */}
                    <div className="absolute w-80 h-80 md:w-96 md:h-96 xl:w-[420px] xl:h-[420px] rounded-full border border-accent/10" />
                    <div className="absolute w-64 h-64 md:w-80 md:h-80 xl:w-[360px] xl:h-[360px] rounded-full border border-accent/5" />

                    {/* Imagem */}
                    <div className="relative w-52 h-52 md:w-64 md:h-64 xl:w-72 xl:h-72">
                        {/* Glow sob a imagem */}
                        <div className="absolute inset-0 rounded-full bg-accent/10 blur-xl scale-110" />
                        <Image
                            className="relative rounded-full border-2 border-accent/40 p-2 bg-primary/80"
                            src="https://github.com/alexand7e.png"
                            alt="Alexandre Barros - Profile Picture"
                            fill
                            style={{ objectFit: 'contain' }}
                            priority
                        />
                    </div>
                </div>
            </div>

            {/* Stats — rodapé da seção */}
            <div className="relative w-full max-w-7xl mx-auto px-8 md:px-14 xl:px-20 pb-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-2">
                    {stats.map((stat, index) => (
                        <div key={index} className="flex flex-col items-center lg:items-start gap-1">
                            <span className="text-accent text-2xl md:text-3xl font-bold">{stat.value}</span>
                            <span className="text-xs text-tertiary/40 uppercase tracking-widest">{stat.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

import DefaultSection from "@/components/ui/Section";
import SectionBody from "@/components/ui/SectionBody";
import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useLanguage } from "@/lib/useLanguage";

export default function HomePage ({
    ref,
    id
}: {
    ref?: React.Ref<any>
    id?: string
}) {
    const { t } = useLanguage();
    const [stats, setStats] = useState([
        { value: "0+", label: "Years on GitHub" },
        { value: "0+", label: "Repositories" },
        { value: "0+", label: "Stars Received" },
        { value: "0+", label: "Followers" },
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
                    { value: `${yearsOnGitHub}+`, label: "Years on GitHub" },
                    { value: `${userData.public_repos}`, label: "Repositories" },
                    { value: `${totalStars}`, label: "Stars Received" },
                    { value: `${userData.followers}`, label: "Followers" },
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
            className="relative w-full bg-primary flex flex-col justify-between
                       min-h-screen lg:min-h-0 lg:aspect-video overflow-hidden py-12 lg:py-0"
        >
            {/* Conteúdo principal — ocupa toda a largura */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8
                            flex-1 w-full px-8 md:px-14 lg:px-20 xl:px-28 lg:py-16">

                <div className="flex flex-col gap-5 items-center lg:items-start text-center lg:text-left flex-1">
                    <span className="text-xl">
                        {t("home.title")}
                    </span>

                    <div className="text-4xl md:text-5xl xl:text-6xl 2xl:text-7xl leading-tight">
                        <h1>{t("home.subtitle")}</h1>
                        <h2 className="text-accent">
                            Alexandre Barros<span className="text-tertiary">.</span>
                        </h2>
                    </div>

                    <p className="max-w-2xl break-words whitespace-pre-line hyphens-auto text-base lg:text-lg text-tertiary/70">
                        {t("home.description")}
                    </p>

                    <Link
                        href="#contact"
                        className="mt-2 border-2 border-accent px-6 py-3 w-fit text-accent rounded-full font-bold hover:bg-accent hover:text-primary transition-all"
                    >
                        {t("home.contactButton")}
                    </Link>
                </div>

                <div className="relative shrink-0 w-56 h-56 md:w-72 md:h-72 lg:w-80 lg:h-80 xl:w-96 xl:h-96">
                    <Image
                        className="rounded-full border-accent border-4 p-4"
                        src="https://github.com/alexand7e.png"
                        alt="Alexandre Barros - Profile Picture"
                        fill
                        style={{ objectFit: 'contain' }}
                        priority
                    />
                </div>
            </div>

            {/* Stats — rodapé da seção hero */}
            <div className="w-full px-8 md:px-14 lg:px-20 xl:px-28 pb-8 lg:pb-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center border-t border-accent/10 pt-8">
                    {stats.map((stat, index) => (
                        <div key={index} className="px-2">
                            <span className="text-accent text-3xl md:text-4xl font-bold">{stat.value}</span>
                            <br />
                            <span className="whitespace-pre-wrap text-sm text-tertiary/60">{stat.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
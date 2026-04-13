import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import React, { Suspense } from "react";
import "./globals.css";

import StairTransition from "@/components/animations/EnterAnimation";
import LanguageProvider from "@/components/providers/LanguageProvider";
import StructuredData from "@/components/seo/StructuredData";
import GoogleAnalytics from "@/components/seo/GoogleAnalytics";
import { NeuralGrid } from "@/components/ui/NeuralGrid";

const jMono = JetBrains_Mono({
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
    variable: "--font-jetbrains",
});

export const metadata: Metadata = {
    title: {
        default: "Alexandre Barros — Dados, IA e Tecnologia | SIA-PI",
        template: "%s | Alexandre Barros",
    },
    description: "Alexandre Barros dos Santos — Gerente de IA na Secretaria de Inteligência Artificial do Piauí (SIA), formado pela UFPI. Engenheiro e Cientista de Dados especialista em IA, Python e transformação digital no setor público.",
    keywords: [
        "Alexandre Barros", "Alexandre Barros SIA", "Alexandre Barros UFPI",
        "alexandre barros sia", "gerente de ia sia", "Sia", "SIA Piauí", "SIA-PI",
        "Secretaria de Inteligência Artificial do Piauí",
        "Inteligência Artificial setor público", "IA governo Piauí",
        "Cientista de Dados", "Engenheiro de Dados", "Data Science",
        "Machine Learning", "Python", "R", "Transformação Digital",
        "Blog IA", "Tutoriais Data Science", "Newsletter tecnologia",
        "UFPI", "Universidade Federal do Piauí",
        "Desenvolvimento web", "Next.js", "React", "TypeScript",
    ],
    authors: [{ name: "Alexandre Barros dos Santos" }],
    creator: "Alexandre Barros dos Santos",
    publisher: "Alexandre Barros dos Santos",
    metadataBase: new URL('https://alexand7e.dev.br'),
    alternates: {
        canonical: '/',
        languages: {
            'pt-BR': '/',
            'en': '/en',
        },
        types: {
            'application/rss+xml': 'https://alexand7e.dev.br/feed.xml',
        },
    },
    openGraph: {
        type: 'website',
        locale: 'pt_BR',
        url: 'https://alexand7e.dev.br',
        title: 'Alexandre Barros — Dados, IA e Tecnologia | SIA-PI',
        description: 'Alexandre Barros — Gerente de IA na SIA-PI (Piauí), formado pela UFPI. Artigos, tutoriais e projetos sobre IA e dados.',
        siteName: 'Alexandre Barros',
        images: [
            {
                url: 'https://github.com/alexand7e.png',
                width: 400,
                height: 400,
                alt: 'Alexandre Barros — SIA-PI',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Alexandre Barros — Dados, IA e Tecnologia | SIA-PI',
        description: 'Gerente de IA na SIA-PI, formado pela UFPI. Artigos, tutoriais e projetos sobre IA e dados.',
        images: ['https://github.com/alexand7e.png'],
        creator: '@alexand7e',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-BR">
            <head>
                <GoogleAnalytics />
                <StructuredData />
            </head>
            <body className={jMono.className}>
                <NeuralGrid />
                <div className="relative" style={{ zIndex: 2 }}>
                    <StairTransition />
                    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Carregando...</div>}>
                        <LanguageProvider>
                            {children}
                        </LanguageProvider>
                    </Suspense>
                </div>
            </body>
        </html>
    );
}
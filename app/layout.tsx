import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import React, { Suspense } from "react";
import "./globals.css";

import LanguageProvider from "@/components/providers/LanguageProvider";
import ThemeProvider from "@/components/providers/ThemeProvider";
import StructuredData from "@/components/seo/StructuredData";
import GoogleAnalytics from "@/components/seo/GoogleAnalytics";
import { getBaseUrl } from "@/lib/seo";

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
    description: "Alexandre Barros dos Santos — Gerente de Programas em IA na Secretaria de Inteligência Artificial do Piauí (SIA). Economista pela UFPI e pós-graduado em Ciência da Computação pelo iCEV, atua com dados, IA e transformação digital no setor público.",
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
    metadataBase: new URL(getBaseUrl()),
    verification: process.env.GOOGLE_SITE_VERIFICATION
        ? { google: process.env.GOOGLE_SITE_VERIFICATION }
        : undefined,
    alternates: {
        canonical: '/',
        types: {
            'application/rss+xml': `${getBaseUrl()}/feed.xml`,
        },
    },
    openGraph: {
        type: 'website',
        locale: 'pt_BR',
        url: 'https://www.alexand7e.dev.br',
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
                <script
                    dangerouslySetInnerHTML={{
                        __html: "try{if(localStorage.getItem('theme')==='light'){document.documentElement.classList.add('light')}}catch(e){}",
                    }}
                />
                <GoogleAnalytics />
                <StructuredData />
            </head>
            <body className={jMono.className}>
                <div className="relative" style={{ zIndex: 2 }}>
                    <Suspense fallback={null}>
                        <ThemeProvider>
                            <LanguageProvider>
                                {children}
                            </LanguageProvider>
                        </ThemeProvider>
                    </Suspense>
                </div>
            </body>
        </html>
    );
}
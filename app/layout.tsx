import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import React, { Suspense } from "react";
import "./globals.css";

import StairTransition from "@/components/animations/EnterAnimation";
import LanguageProvider from "@/components/providers/LanguageProvider";
import StructuredData from "@/components/seo/StructuredData";

const jMono = JetBrains_Mono({
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
    variable: "--font-jetbrains",
});

export const metadata: Metadata = {
    title: "Alexandre Barros - Engenheiro e Cientista de Dados | Portfolio",
    description: "Portfolio profissional de Alexandre Barros dos Santos - Engenheiro e Cientista de Dados especialista em IA, Python, R e transformação digital. Gerente de Programas em IA na Secretaria de Inteligência Artificial do Piauí.",
    keywords: ["Alexandre Barros", "Cientista de Dados", "Engenheiro de Dados", "Inteligência Artificial", "Python", "R", "Data Science", "Machine Learning", "Portfolio", "Piauí"],
    authors: [{ name: "Alexandre Barros dos Santos" }],
    creator: "Alexandre Barros dos Santos",
    publisher: "Alexandre Barros dos Santos",
    metadataBase: new URL('https://alexandre-barros.dev'),
    alternates: {
        canonical: '/',
        languages: {
            'pt-BR': '/',
            'en': '/en',
        },
    },
    openGraph: {
        type: 'website',
        locale: 'pt_BR',
        url: 'https://alexandre-barros.dev',
        title: 'Alexandre Barros - Engenheiro e Cientista de Dados',
        description: 'Portfolio profissional de Alexandre Barros dos Santos - Especialista em IA, Data Science e transformação digital.',
        siteName: 'Alexandre Barros Portfolio',
        images: [
            {
                url: 'https://github.com/alexand7e.png',
                width: 400,
                height: 400,
                alt: 'Alexandre Barros - Profile Picture',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Alexandre Barros - Engenheiro e Cientista de Dados',
        description: 'Portfolio profissional - Especialista em IA, Data Science e transformação digital.',
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
    verification: {
        google: 'your-google-verification-code',
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
                <StructuredData />
            </head>
            <body className={jMono.className}>
                <StairTransition />
                <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Carregando...</div>}>
                    <LanguageProvider>
                        {children}
                    </LanguageProvider>
                </Suspense>
            </body>
        </html>
    );
}
import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import React from "react";
import "./globals.css";

import StairTransition from "@/components/animations/EnterAnimation";

const jMono = JetBrains_Mono({
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
    variable: "--font-jetbrains",
});

export const metadata: Metadata = {
    title: "Alexandre Barros - Engenheiro e Cientista de Dados",
    description: "Portfolio de Alexandre Barros dos Santos, Engenheiro e Cientista de Dados, Gerente de Programas em IA na Secretaria de Inteligência Artificial do Piauí. Especialista em análise de dados, Python, R e transformação digital.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-BR">
            <body className={jMono.className}>
                <StairTransition />
                {children}
            </body>
        </html>
    );
}
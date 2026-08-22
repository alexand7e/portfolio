"use client";
import React from "react";
import { FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "@/components/providers/ThemeProvider";

export default function ThemeToggle() {
    const { theme, toggle } = useTheme();
    const isLight = theme === "light";

    return (
        <button
            onClick={toggle}
            className="flex items-center justify-center w-8 h-8 md:w-9 md:h-9 text-tertiary/70 hover:text-accent transition-colors"
            title={isLight ? "Mudar para tema escuro" : "Switch to light theme"}
            aria-label={isLight ? "Mudar para tema escuro" : "Switch to light theme"}
        >
            {isLight ? <FiMoon size={16} /> : <FiSun size={16} />}
        </button>
    );
}

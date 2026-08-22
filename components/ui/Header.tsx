"use client"
import React, { HTMLProps } from "react";
import {DesktopNav, MobileNav} from "@/components/ui/NavComponents";
import LanguageSelector from "./LanguageSelector";
import SearchModal from "./SearchModal";
import ThemeToggle from "./ThemeToggle";

export const Header = () => {
    const afterStyle: HTMLProps<HTMLElement>["className"] = `after:content-[';'] after:text-accent`
    const beforeStyle: HTMLProps<HTMLElement>["className"] = `before:content-['.'] before:text-accent`
    
    return (
        <header className={`sticky top-4 z-20 flex justify-between items-center mx-4 md:mx-14 xl:mx-16 mt-4 px-4 md:px-5 py-2.5 md:py-3 border border-hairline bg-primary/90 backdrop-blur-sm`}>
            <a href={"#home"} className={`text-2xl md:text-4xl ${beforeStyle} ${afterStyle}`}>
                Alexandre
            </a>
            
            <div className="flex items-center gap-2 md:gap-3">
                <ThemeToggle />
                <SearchModal />
                <LanguageSelector />
                <div className="lg:hidden">
                    <MobileNav/>
                </div>
                <div className="hidden lg:block">
                    <DesktopNav/>
                </div>
            </div>
        </header>
    );
};
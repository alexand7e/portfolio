"use client";
import React from "react";
import HomePage from "@/components/pages/Home";
import Experience from "@/components/pages/Experience";
import Projects from "@/components/pages/Projects";
import Skills from "@/components/pages/Skills";
import Contact from "@/components/pages/Contact";
import Testimonials from "@/components/pages/Testimonials";
import {Header} from "@/components/ui/Header";
import FadeInAnimation from "@/components/animations/FadeIn";
import LanguageTest from "@/components/ui/LanguageTest";
import Footer from "@/components/ui/Footer";

function Home () {
    return (
        <main className={"w-full h-full snap-home relative overflow-x-hidden"}>
            <div style={{ position: 'relative', zIndex: 10 }}>
                <FadeInAnimation>
                    <Header/>
                    <HomePage id={"home"}/>
                    <Skills id={"skills"}/>
                    <Experience id={"experience"}/>
                    <Projects id={"projects"}/>
                    <Testimonials />
                    <Contact id={"contact"}/>
                </FadeInAnimation>
                <LanguageTest />
                <Footer />
            </div>
        </main>
    );
}

export default Home
 
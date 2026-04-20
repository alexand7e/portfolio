import { Suspense } from "react";
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
                    <Suspense fallback={null}><Header/></Suspense>
                    <Suspense fallback={null}><HomePage id={"home"}/></Suspense>
                    <Suspense fallback={null}><Skills id={"skills"}/></Suspense>
                    <Suspense fallback={null}><Experience id={"experience"}/></Suspense>
                    <Suspense fallback={null}><Projects id={"projects"}/></Suspense>
                    <Suspense fallback={null}><Testimonials /></Suspense>
                    <Suspense fallback={null}><Contact id={"contact"}/></Suspense>
                </FadeInAnimation>
                <Suspense fallback={null}><LanguageTest /></Suspense>
                <Footer />
            </div>
        </main>
    );
}

export default Home

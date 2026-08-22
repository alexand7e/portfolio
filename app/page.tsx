import { Suspense } from "react";
import HomePage from "@/components/pages/Home";
import Experience from "@/components/pages/Experience";
import Projects from "@/components/pages/Projects";
import Skills from "@/components/pages/Skills";
import Contact from "@/components/pages/Contact";
import Testimonials from "@/components/pages/Testimonials";
import Articles from "@/components/pages/Articles";
import Services from "@/components/pages/Services";
import Trilha from "@/components/pages/Trilha";
import { Header } from "@/components/ui/Header";
import Divider from "@/components/ui/Divider";
import PageGridFrame from "@/components/ui/PageGridFrame";
import LanguageTest from "@/components/ui/LanguageTest";
import Footer from "@/components/ui/Footer";

// A Trilha consulta o banco. Sem isto o Next pre-renderiza a home no build:
// o CI passaria a exigir DATABASE_URL e as aulas ficariam congeladas no HTML
// ate o proximo build.
export const dynamic = "force-dynamic";

function Home () {
    return (
        <main className={"w-full h-full relative overflow-x-hidden"}>
            <PageGridFrame />
            <div style={{ position: 'relative', zIndex: 10 }}>
                <Suspense fallback={null}><Header/></Suspense>
                <Suspense fallback={null}><HomePage id={"home"}/></Suspense>
                <Divider />
                <Suspense fallback={null}><Services /></Suspense>
                <Divider />
                <Suspense fallback={null}><Skills id={"skills"}/></Suspense>
                <Divider />
                <Suspense fallback={null}><Experience id={"experience"}/></Suspense>
                <Divider />
                <Suspense fallback={null}><Projects id={"projects"}/></Suspense>
                <Divider />
                <Suspense fallback={null}><Testimonials /></Suspense>
                <Divider />
                <Suspense fallback={null}><Articles /></Suspense>
                <Divider />
                <Suspense fallback={null}><Trilha id={"trilha"}/></Suspense>
                <Divider />
                <Suspense fallback={null}><Contact id={"contact"}/></Suspense>
                <Suspense fallback={null}><LanguageTest /></Suspense>
                <Footer />
            </div>
        </main>
    );
}

export default Home

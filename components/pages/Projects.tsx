import SectionBody from "@/components/ui/SectionBody";
import DefaultSection from "@/components/ui/Section";
import React from "react";
import SectionTitle from "@/components/ui/SectionTitle";
import ProjectCard from "@/components/ui/ProjectCard";

const projects = [
  {
    title: "Microdados-CAGED",
    description: "Análise e processamento de microdados do CAGED (Cadastro Geral de Empregados e Desempregados) utilizando Python para extrair insights sobre o mercado de trabalho brasileiro.",
    technologies: ["Python", "Pandas", "NumPy", "Jupyter", "Análise de Dados"],
    github: "https://github.com/alexand7e/Microdados-CAGED",
    demo: "#"
  },
  {
    title: "Dataset-PI",
    description: "Compilação e análise de datasets específicos do Estado do Piauí, incluindo indicadores socioeconômicos e dados governamentais para pesquisa e tomada de decisão.",
    technologies: ["Jupyter Notebook", "Python", "Análise Exploratória", "Visualização"],
    github: "https://github.com/alexand7e/Dataset-PI",
    demo: "#"
  },
  {
    title: "R-Reps",
    description: "Repositório de análises estatísticas e econométricas utilizando R, focando em metodologias de pesquisa aplicada e análise de dados econômicos.",
    technologies: ["R", "Estatística", "Econometria", "Análise de Dados"],
    github: "https://github.com/alexand7e/R-Reps",
    demo: "#"
  },
  {
    title: "Monografia-R-PNADC",
    description: "Trabalho de conclusão de curso utilizando R para análise da PNADC (Pesquisa Nacional por Amostra de Domicílios Contínua), aplicando conceitos de ciência de dados em economia.",
    technologies: ["R", "PNADC", "Análise Estatística", "Economia"],
    github: "https://github.com/alexand7e/Monografia-R-PNADC",
    demo: "#"
  },
  {
    title: "Engenharia-de-Prompt-PIT",
    description: "Projeto de pesquisa em engenharia de prompts para inteligência artificial, explorando técnicas de otimização e eficiência em sistemas de IA.",
    technologies: ["Jupyter Notebook", "IA", "Engenharia de Prompts", "Machine Learning"],
    github: "https://github.com/alexand7e/Engenharia-de-Prompt-PIT",
    demo: "#"
  },
  {
    title: "Chatbot Project",
    description: "Desenvolvimento de chatbot inteligente utilizando técnicas de processamento de linguagem natural e machine learning para aplicações governamentais.",
    technologies: ["HTML", "JavaScript", "NLP", "Machine Learning", "IA"],
    github: "https://github.com/alexand7e/chatbot-project",
    demo: "#"
  }
];

export default function Projects({
  ref,
  id
}: {
  ref?: React.Ref<any>
  id?: string
}) {
  return (
    <DefaultSection
      ref={ref}
      id={`${id}`}
      className={"!bg-secondary"}
    >
      <SectionBody>
        <SectionTitle 
          title="Projects"
          subtitle="Principais projetos em ciência de dados, análise econômica e inteligência artificial que desenvolvi"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} index={index} />
          ))}
        </div>
      </SectionBody>
    </DefaultSection>
  )
}
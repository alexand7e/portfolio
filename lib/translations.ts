export type Language = 'pt' | 'en';

export interface Translations {
  home: {
    title: string;
    subtitle: string;
    description: string;
    contactButton: string;
  };
  skills: {
    title: string;
    subtitle: string;
    categories: {
      backend: string;
      frontend: string;
      devops: string;
    };
  };
  experience: {
    title: string;
    subtitle: string;
  };
  projects: {
    title: string;
    subtitle: string;
    showMore: string;
    showLess: string;
  };
  contact: {
    title: string;
    subtitle: string;
    getInTouch: string;
    description: string;
    form: {
      name: string;
      email: string;
      message: string;
      send: string;
      sending: string;
    };
    success: string;
    error: string;
  };
}

export const translations: Record<Language, Translations> = {
  pt: {
    home: {
      title: "Data Engineer | Full-Stack Developer | Tech Leader",
      subtitle: "Olá, eu sou",
      description: "Dados não mentem. Pessoas interpretam, narrativas distorcem — mas os números estão lá, esperando alguém que saiba o que perguntar. Trabalho na interseção entre dados e tecnologia desde 2022, no setor público e no privado, tentando transformar o que os dados mostram em decisões que mudam alguma coisa de verdade.",
      contactButton: "Entre em Contato"
    },
    skills: {
      title: "Skills",
      subtitle: "Stack tecnológica completa para desenvolvimento full-stack, data engineering e DevOps",
      categories: {
        backend: "Backend & Data Engineering",
        frontend: "Frontend & Mobile",
        devops: "DevOps & Cloud"
      }
    },
    experience: {
      title: "Experience",
      subtitle: "Minha jornada profissional focada em Data Engineering, IA e desenvolvimento full-stack"
    },
    projects: {
      title: "Projects",
      subtitle: "Principais projetos em desenvolvimento full-stack, data engineering e soluções de IA que desenvolvi",
      showMore: "Ver Mais",
      showLess: "Ver Menos"
    },
    contact: {
      title: "Contact",
      subtitle: "Tem um projeto em mente ou quer conversar? Entre em contato!",
      getInTouch: "Entre em contato",
      description: "Atualmente atuo como Manager na SIA-PI (Secretaria de Inteligência Artificial) e Co-Founder & CTO na Teaser. Estou aberto a colaborações em projetos de data science, IA e transformação digital. Seja para uma pergunta ou discussão de parcerias, ficarei feliz em conectar!",
      form: {
        name: "Nome",
        email: "Email",
        message: "Mensagem",
        send: "Enviar Mensagem",
        sending: "Enviando..."
      },
      success: "Mensagem enviada com sucesso! Entrarei em contato em breve.",
      error: "Algo deu errado. Tente novamente."
    }
  },
  en: {
    home: {
      title: "Data Engineer | Full-Stack Developer | Tech Leader",
      subtitle: "Hello, I'm",
      description: "Data doesn't lie. People interpret, narratives distort — but the numbers are there, waiting for someone who knows what to ask. I've worked at the intersection of data and technology since 2022, in the public and private sectors, trying to turn what the data shows into decisions that actually change something.",
      contactButton: "Get in Touch"
    },
    skills: {
      title: "Skills",
      subtitle: "Complete technology stack for full-stack development, data engineering and DevOps",
      categories: {
        backend: "Backend & Data Engineering",
        frontend: "Frontend & Mobile",
        devops: "DevOps & Cloud"
      }
    },
    experience: {
      title: "Experience",
      subtitle: "My professional journey focused on Data Engineering, AI and full-stack development"
    },
    projects: {
      title: "Projects",
      subtitle: "Main projects in full-stack development, data engineering and AI solutions that I developed",
      showMore: "Show More",
      showLess: "Show Less"
    },
    contact: {
      title: "Contact",
      subtitle: "Have a project in mind or want to chat? Get in touch!",
      getInTouch: "Get in touch",
      description: "I currently work as Manager at SIA-PI (Artificial Intelligence Secretariat) and Co-Founder & CTO at Teaser. I'm open to collaborations in data science, AI and digital transformation projects. Whether for a question or partnership discussion, I'll be happy to connect!",
      form: {
        name: "Name",
        email: "Email",
        message: "Message",
        send: "Send Message",
        sending: "Sending..."
      },
      success: "Message sent successfully! I'll get back to you soon.",
      error: "Something went wrong. Please try again."
    }
  }
};

export const getTranslation = (lang: Language): Translations => {
  return translations[lang];
};

import Script from 'next/script'

export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Alexandre Barros dos Santos",
    "alternateName": ["Alexandre Barros", "Alexandre Barros SIA", "Alexandre Barros UFPI"],
    "description": "Gerente de IA na Secretaria de Inteligência Artificial do Piauí (SIA), formado pela UFPI. Engenheiro e Cientista de Dados especialista em IA, Python, R e transformação digital no setor público.",
    "url": "https://alexand7e.dev.br",
    "image": "https://github.com/alexand7e.png",
    "sameAs": [
      "https://github.com/alexand7e",
      "https://linkedin.com/in/alexandre-barros",
      "https://twitter.com/alexand7e"
    ],
    "jobTitle": "Gerente de IA",
    "worksFor": {
      "@type": "Organization",
      "name": "Secretaria de Inteligência Artificial do Piauí",
      "alternateName": ["SIA", "SIA-PI", "Sia"],
      "url": "https://sia.pi.gov.br",
      "address": {
        "@type": "PostalAddress",
        "addressRegion": "Piauí",
        "addressCountry": "BR"
      }
    },
    "knowsAbout": [
      "Data Science",
      "Machine Learning",
      "Artificial Intelligence",
      "Python Programming",
      "R Programming",
      "Data Analysis",
      "Digital Transformation",
      "Business Intelligence",
      "Public Sector AI",
      "Government Data"
    ],
    "alumniOf": {
      "@type": "EducationalOrganization",
      "name": "Universidade Federal do Piauí",
      "alternateName": "UFPI"
    },
    "hasOccupation": {
      "@type": "Occupation",
      "name": "Gerente de Inteligência Artificial",
      "occupationLocation": {
        "@type": "Place",
        "name": "Piauí, Brasil"
      },
      "skills": [
        "Python", "R", "Machine Learning", "Data Analysis",
        "Artificial Intelligence", "Statistical Modeling",
        "Data Visualization", "Big Data", "Public Policy"
      ]
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://alexand7e.dev.br"
    }
  }

  const websiteStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Alexandre Barros",
    "alternateName": "Alexandre Barros — Dados, IA e Tecnologia",
    "url": "https://alexand7e.dev.br",
    "description": "Site pessoal de Alexandre Barros dos Santos — Gerente de IA na SIA-PI, formado pela UFPI. Artigos, tutoriais, newsletter e projetos sobre IA e dados.",
    "author": {
      "@type": "Person",
      "name": "Alexandre Barros dos Santos"
    },
    "inLanguage": "pt-BR",
    "copyrightYear": new Date().getFullYear(),
    "keywords": "Alexandre Barros, SIA, SIA-PI, UFPI, Data Science, IA, Machine Learning, Python, R",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://alexand7e.dev.br/tags/{search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  }

  return (
    <>
      <Script
        id="structured-data-person"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <Script
        id="structured-data-website"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteStructuredData),
        }}
      />
    </>
  )
}
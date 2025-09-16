import Script from 'next/script'

export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Alexandre Barros dos Santos",
    "alternateName": "Alexandre Barros",
    "description": "Engenheiro e Cientista de Dados especialista em Inteligência Artificial, Python, R e transformação digital",
    "url": "https://alexandre-barros.dev",
    "image": "https://github.com/alexand7e.png",
    "sameAs": [
      "https://github.com/alexand7e",
      "https://linkedin.com/in/alexandre-barros",
      "https://twitter.com/alexand7e"
    ],
    "jobTitle": "Gerente de Programas em IA",
    "worksFor": {
      "@type": "Organization",
      "name": "Secretaria de Inteligência Artificial do Piauí",
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
      "Business Intelligence"
    ],
    "alumniOf": {
      "@type": "EducationalOrganization",
      "name": "Universidade Federal do Piauí"
    },
    "hasOccupation": {
      "@type": "Occupation",
      "name": "Data Scientist",
      "occupationLocation": {
        "@type": "Place",
        "name": "Piauí, Brasil"
      },
      "skills": [
        "Python",
        "R",
        "Machine Learning",
        "Data Analysis",
        "Artificial Intelligence",
        "Statistical Modeling",
        "Data Visualization",
        "Big Data"
      ]
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://alexandre-barros.dev"
    }
  }

  const websiteStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Alexandre Barros Portfolio",
    "alternateName": "Alexandre Barros - Data Scientist Portfolio",
    "url": "https://alexandre-barros.dev",
    "description": "Portfolio profissional de Alexandre Barros dos Santos - Engenheiro e Cientista de Dados especialista em IA e transformação digital",
    "author": {
      "@type": "Person",
      "name": "Alexandre Barros dos Santos"
    },
    "inLanguage": "pt-BR",
    "copyrightYear": new Date().getFullYear(),
    "genre": "Portfolio",
    "keywords": "Data Science, Machine Learning, Artificial Intelligence, Python, R, Portfolio, Alexandre Barros"
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
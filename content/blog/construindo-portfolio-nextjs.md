---
title: "Como Criei Meu Portfolio do Zero (e Por Que Você Deveria Fazer o Mesmo) 🚀"
description: "A jornada real de um Engenheiro de Dados que decidiu sair da zona de conforto e criar algo incrível. Spoiler: valeu cada minuto!"
date: "2025-08-25"
author: "Alexandre Barros"
tags: ["Next.js", "React", "TypeScript", "Portfolio", "Carreira", "Tech"]
readTime: "6 min"
---

# Como Criei Meu Portfolio do Zero (e Por Que Você Deveria Fazer o Mesmo) 🚀

## 💭 Aquele Momento de "E Se..."

Sabe aquela sensação de estar navegando no LinkedIn e ver aqueles portfolios incríveis que fazem você pensar "caramba, eu deveria ter um desses"? 

Pois é, eu tive esse momento há algumas semanas. E não, não foi só mais uma daquelas ideias que ficam na cabeça e nunca saem do papel. Desta vez, eu realmente fiz acontecer.

E cara, que experiência foi essa! 🎯

---

## 🎪 Por Que Decidi Sair da Zona de Conforto

### A Realidade Crua
- **LinkedIn está saturado** de posts genéricos sobre "5 dicas para..."
- **Portfolios são raros** na área de dados (e isso é uma oportunidade!)
- **Mostrar > Contar**: Nada substitui ver algo funcionando na prática
- **Networking real**: Pessoas que realmente se interessam pelo seu trabalho

### O Gatilho Definitivo
Foi numa reunião com o **Marcos** (aquele frontend genial que conheci na SIA - Secretaria de Inteligência Artificial). Ele estava mostrando uns projetos dele e eu pensei: "porra, eu sou Engenheiro de Dados, mas também sei programar. Por que não?"

**E foi assim que começou tudo.**

---

## 🛠️ A Stack Que Escolhi (e Por Que)

### Next.js 14 - Não, Não É Só "Mais Um Framework React"
- **App Router**: Mudei de ideia 3 vezes sobre a arquitetura. Valeu a pena.
- **TypeScript nativo**: Sim, é mais verboso, mas quando você vê o erro antes de rodar... 🤯
- **SSR automático**: SEO que funciona sem você fazer nada
- **Image optimization**: Suas imagens ficam otimizadas automaticamente

### Tailwind CSS - O Amor à Primeira Vista
- **Utility-first**: No começo parece estranho, depois você não consegue viver sem
- **Responsivo por padrão**: Mobile-first que realmente funciona
- **Customização**: Criei um sistema de cores que faz sentido (não é só "azul bonito")

### Framer Motion - Porque Animações Importam
- **60fps**: Suas animações não travam no iPhone 6 do seu tio
- **Declarativo**: Escreva o que você quer, não como fazer
- **Acessibilidade**: Respeita as preferências de movimento do usuário

---

## 🏗️ A Arquitetura Que Funcionou (Depois de 2 Tentativas)

### Primeira Tentativa: "Vou Fazer Tudo em Uma Página"
❌ **Resultado**: Uma página de 2000 linhas que ninguém conseguia manter

### Segunda Tentativa: "Vou Usar Muitos Micro-Components"
❌ **Resultado**: Over-engineering que complicava coisas simples

### Terceira Tentativa: "Vou Fazer Do Jeito Certo"
✅ **Resultado**: Componentes que fazem sentido, são reutilizáveis e fáceis de manter

```typescript
// Exemplo de como ficou limpo
<DefaultSection>
  <SectionTitle title="Skills" subtitle="O que eu sei fazer" />
  <SectionBody>
    {skills.map(skill => (
      <SkillCard key={skill.id} {...skill} />
    ))}
  </SectionBody>
</DefaultSection>
```

**Dica Pro**: Comece simples. Você pode sempre refatorar depois.

---

## 🚀 As Funcionalidades Que Fizeram a Diferença

### 1. GitHub API Integration - "Mostra, Não Conta"
```typescript
// Isso aqui é mágico
const [stats, setStats] = useState([
  { value: "0+", label: "Years on GitHub" },
  { value: "0+", label: "Repositories" },
  { value: "0+", label: "Stars Received" },
  { value: "0+", label: "Followers" },
]);
```

**Por que funciona:**
- ✅ Dados sempre atualizados
- ✅ Zero manutenção
- ✅ Credibilidade instantânea
- ✅ "Ah, ele realmente programa!"

### 2. EmailJS - Porque Formulários de Contato Devem Funcionar
- **Validação real**: Não é só `required` no HTML
- **Feedback visual**: Usuário sabe o que está acontecendo
- **Anti-spam**: Proteção básica que funciona
- **Integração**: Funciona com Gmail, Outlook, etc.

### 3. Animações Que Fazem Sentido
- **FadeIn**: Entrada suave das seções
- **Hover effects**: Micro-interações que dão vida
- **Scroll animations**: Baseadas no que o usuário está fazendo

---

## 📱 Design Responsivo - A Parte Que Todo Mundo Esquece

### Mobile-First (De Verdade)
- **Touch-friendly**: Botões grandes o suficiente para dedos humanos
- **Performance**: Carrega rápido mesmo com 3G
- **Navegação**: Menu que funciona no celular

### Acessibilidade (Não É Só Para Deficientes Visuais)
- **Contraste**: Cores que você consegue ler no sol
- **Semântica**: HTML que faz sentido
- **Teclado**: Navegação sem mouse

---

## 🔥 Os Desafios Que Me Fizeram Crescer

### 1. Docker + Next.js = ❤️ + 😤
**O que aconteceu:**
- Container não encontrava o build
- Arquivos estáticos não carregavam
- Portas conflitando

**Como resolvi:**
- Removi `output: standalone` (era overkill)
- Configurei volumes corretos
- Sincronizei todas as portas para 7000

**Lição**: Docker é poderoso, mas pode ser traiçoeiro. Teste cada passo.

### 2. DNS Manual - Porque Nada É Tão Simples Quanto Parece
**O problema:** Configurei o domínio, mas o site não carregava
**O que descobri:**
- Registro A apontando para IP errado
- CNAME conflitando com A record
- Propagação DNS demorando (até 48h!)
- SPF e DKIM para e-mails funcionarem

**A solução:** Estudei DNS como se fosse para uma prova
**O resultado:** `alexand7e.dev.br` funcionando perfeitamente

### 3. Traefik - Proxy Reverso Que Funciona (Depois de Configurar)
**O problema:** Container rodando, mas Traefik não redirecionava
**O que aprendi:**
- Labels são críticos para roteamento
- SSL automático com Let's Encrypt
- Health checks para garantir disponibilidade
- Networks Docker para comunicação entre serviços

**A solução:** Configurei labels corretos e networks
**O resultado:** HTTPS automático + proxy reverso funcionando

### 4. Imagens do GitHub Não Carregavam
**O problema:** Next.js bloqueia domínios externos por segurança
**A solução:** Configurei `remotePatterns` corretamente
**O resultado:** Imagem do perfil carregando perfeitamente

### 5. EmailJS Duplicando E-Mails
**O problema:** Eu e o usuário recebíamos o mesmo e-mail
**A solução:** Configurei o template corretamente (era problema de configuração, não de código)
**A lição:** Às vezes o problema não está no seu código

---

## 📊 Métricas Que Importam (e Como Medir)

### Lighthouse Score: 95+
- **Performance**: Carrega em menos de 2 segundos
- **Acessibilidade**: Funciona para todos
- **SEO**: Google vai te encontrar
- **Best Practices**: Seguindo padrões da web

### Como Medir:
1. **Chrome DevTools** → Lighthouse
2. **WebPageTest** → Performance global
3. **GTmetrix** → Análise detalhada
4. **PageSpeed Insights** → Visão do Google

---

## 🚀 Deploy - A Hora da Verdade

### VPS + Traefik (Porque Controle Total É Tudo)
- **VPS própria**: Controle completo sobre infraestrutura
- **DNS manual**: Configurei cada registro A, CNAME, MX
- **Traefik como proxy reverso**: Load balancing e SSL automático
- **Docker containers**: Deploy isolado e escalável

### O Processo Real (Não É Só Git Push):
1. **Comprei o domínio**: `alexand7e.dev.br` (não é só registrar)
2. **Configurei DNS manualmente**: A, CNAME, MX, TXT (SPF, DKIM)
3. **Clonei o repositório** na VPS
4. **Organizei o workflow**: Docker + docker-compose
5. **Configurei Traefik**: Proxy reverso + SSL automático
6. **Deploy em produção**: Container rodando na porta 7000

### Por Que Não Vercel:
- **Controle total**: Infraestrutura é minha
- **Custo-benefício**: VPS + domínio < Vercel Pro
- **Flexibilidade**: Posso rodar outros serviços
- **Aprendizado**: Docker, Traefik, DNS, networking

**Dica Pro**: Se você quer aprender de verdade, configure tudo manualmente. Se quer algo rápido, use Vercel.

---

## 💡 Lições Que Mudaram Minha Perspectiva

### 1. "Perfeito é Inimigo do Feito"
- **Primeira versão**: Funcional, mas básica
- **Versão atual**: Muito melhor, mas ainda pode melhorar
- **Próxima versão**: Vai ser incrível

**Moral da história**: Lance algo que funciona, depois melhore.

### 2. Componentização é Arte
- **Componentes pequenos**: Fáceis de testar e manter
- **Props bem definidas**: Interface clara entre componentes
- **Reutilização**: Não duplique código

### 3. Performance Desde o Dia 1
- **Lazy loading**: Carregue só o que precisa
- **Image optimization**: Imagens que não travam
- **Code splitting**: Bundle que faz sentido

---

## 🔮 O Que Vem Por Aí

### Funcionalidades Planejadas:
- [ ] **Sistema de comentários**: Porque feedback é tudo
- [ ] **Newsletter**: Conecte com quem realmente se importa
- [ ] **Projetos interativos**: Mostre o que você faz
- [ ] **Sistema de busca**: Encontre o que procura
- [ ] **PWA**: App-like experience

### Melhorias Técnicas:
- [ ] **Testes automatizados**: Porque bugs são chatos
- [ ] **Cache strategies**: Performance ainda melhor
- [ ] **Service worker**: Funciona offline
- [ ] **Bundle analysis**: Otimize o que importa

---

## 🎯 Dicas Para Quem Quer Fazer o Mesmo

### 1. **Comece Simples**
- Uma página que funciona
- Design básico mas funcional
- Conteúdo real (não Lorem Ipsum)

### 2. **Escolha Tecnologias Que Você Conhece**
- Não tente aprender 5 coisas ao mesmo tempo
- Foque no que importa: funcionalidade
- Tecnologias são ferramentas, não o objetivo

### 3. **Teste Com Pessoas Reais**
- Amigos, família, colegas
- Feedback honesto é ouro
- Itere baseado no que as pessoas dizem

### 4. **Documente o Processo**
- Escreva sobre o que aprendeu
- Compartilhe os desafios
- Ajude outros a não cometerem os mesmos erros

---

## 🤝 Conecte-se (Porque Networking Real Importa)

### Onde Me Encontrar:
- **LinkedIn**: [Alexandre Barros](https://www.linkedin.com/in/alexandre-barros-dos-santos-4b67a9233/)
- **GitHub**: [alexand7e](https://github.com/alexand7e)
- **Portfolio**: [alexand7e.dev.br](https://alexand7e.dev.br)

### Por Que Conectar:
- **Colaborações**: Sempre aberto a projetos interessantes
- **Mentoria**: Posso ajudar com dúvidas técnicas
- **Networking**: Conhecer pessoas que fazem acontecer
- **Aprendizado**: Sempre aprendo algo novo

---

## 🎉 Conclusão - Valeu Cada Minuto

Construir este portfolio foi uma das experiências mais gratificantes da minha carreira. Não só porque agora tenho algo para mostrar, mas porque:

- **Aprendi muito**: Tecnologias, arquitetura, design
- **Cresci como desenvolvedor**: Código mais limpo, mais organizado
- **Conectei com pessoas**: Feedback real de quem importa
- **Criei algo útil**: Não é só mais um projeto no GitHub

### A Mensagem Final:
**Se você está pensando em criar um portfolio, pare de pensar e comece a fazer.** 

Não precisa ser perfeito, não precisa ter todas as funcionalidades, não precisa ser o mais bonito. Precisa apenas existir e funcionar.

O resto vem com o tempo, com feedback, com iteração.

---

## 📚 Recursos Que Me Ajudaram

### Documentação:
- [Next.js Docs](https://nextjs.org/docs) - O básico que funciona
- [Tailwind CSS](https://tailwindcss.com/docs) - CSS que faz sentido
- [Framer Motion](https://www.framer.com/motion/) - Animações que funcionam

### Ferramentas:
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Medir o que importa
- [WebPageTest](https://www.webpagetest.org/) - Performance real
- [Can I Use](https://caniuse.com/) - Compatibilidade que funciona

### Infraestrutura (O Que Realmente Importa):
- [Traefik Documentation](https://doc.traefik.io/traefik/) - Proxy reverso que funciona
- [DNS Checker](https://dnschecker.org/) - Verificar propagação DNS
- [Let's Encrypt](https://letsencrypt.org/) - SSL gratuito e automático
- [Docker Compose](https://docs.docker.com/compose/) - Orquestração de containers

### Inspiração:
- [Marcos](https://github.com/Marck-vsv) - O cara que me inspirou
- [Portfolios da comunidade](https://github.com/topics/portfolio) - Ideias que funcionam
- [Dribbble](https://dribbble.com/) - Design que inspira

---

**Alexandre Barros** é Engenheiro e Cientista de Dados, atualmente liderando projetos de IA na Secretaria de Inteligência Artificial do Piauí. Apaixonado por tecnologia, dados e criar coisas que funcionam.

*Se este artigo te ajudou, compartilhe! E se tiver dúvidas, me chama no LinkedIn. Sempre respondo! 🚀*

---

*Última atualização: Janeiro de 2025 | Feito com ❤️ e muito ☕*

const BASE_URL = process.env.SITE_URL ?? 'https://alexand7e.dev.br'

function layout(content: string, unsubscribeUrl?: string): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Newsletter – Alexandre Barros</title>
</head>
<body style="margin:0;padding:0;background:#13131a;font-family:'Courier New',Courier,monospace;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#13131a;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;border-radius:12px;overflow:hidden;border:1px solid #2a2a35;">

          <!-- HEADER -->
          <tr>
            <td style="background:#1c1c22;padding:24px 32px;border-bottom:2px solid #00ff99;">
              <a href="${BASE_URL}" style="text-decoration:none;">
                <span style="font-size:26px;font-weight:bold;font-family:'Courier New',Courier,monospace;color:#E0E1DD;">
                  <span style="color:#00ff99;">.</span>Alexandre<span style="color:#00ff99;">;</span>
                </span>
              </a>
            </td>
          </tr>

          <!-- CONTENT -->
          <tr>
            <td style="background:#1C2026;padding:36px 32px;color:#E0E1DD;">
              ${content}
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background:#1c1c22;padding:20px 32px;border-top:1px solid #2a2a35;">
              <p style="margin:0;font-size:12px;color:#6b7280;font-family:'Courier New',Courier,monospace;">
                Você está recebendo este e-mail porque se inscreveu na newsletter de
                <a href="${BASE_URL}" style="color:#00ff99;text-decoration:none;">alexand7e.dev.br</a>.
                ${unsubscribeUrl ? `<br/>Não quer mais receber? <a href="${unsubscribeUrl}" style="color:#6b7280;text-decoration:underline;">Cancelar inscrição</a>.` : ''}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

function heading(text: string): string {
  return `<h1 style="margin:0 0 16px 0;font-size:22px;color:#E0E1DD;font-family:'Courier New',Courier,monospace;">
    <span style="color:#00ff99;">//</span> ${text}
  </h1>`
}

function paragraph(text: string): string {
  return `<p style="margin:0 0 16px 0;font-size:15px;line-height:1.7;color:#c8c9c5;">${text}</p>`
}

function button(label: string, href: string): string {
  return `<a href="${href}"
    style="display:inline-block;margin-top:8px;padding:12px 28px;background:#00ff99;color:#1c1c22;
           font-weight:bold;font-size:14px;border-radius:6px;text-decoration:none;
           font-family:'Courier New',Courier,monospace;">
    ${label} →
  </a>`
}

function card(inner: string): string {
  return `<div style="border:1px solid #2a2a35;border-radius:8px;padding:24px;margin:24px 0;background:#1c1c22;">
    ${inner}
  </div>`
}

function badge(text: string): string {
  return `<span style="display:inline-block;padding:2px 10px;background:#00ff991a;color:#00ff99;
                border:1px solid #00ff9944;border-radius:4px;font-size:12px;margin-bottom:12px;">
    ${text}
  </span>`
}

// ─── Templates ───────────────────────────────────────────────────────────────

export function welcomeEmail(name?: string | null, unsubscribeUrl?: string): string {
  const greeting = name ? `Olá, <strong>${name}</strong>!` : 'Olá!'
  return layout(
    `
    ${heading('Bem-vindo à newsletter!')}
    ${paragraph(greeting)}
    ${paragraph('A partir de agora você vai receber conteúdo sobre <strong style="color:#00ff99;">IA</strong>, <strong style="color:#00ff99;">dados</strong> e <strong style="color:#00ff99;">tecnologia pública</strong> diretamente no seu e-mail.')}
    ${paragraph('Sempre que eu publicar um novo tutorial, artigo ou projeto relevante, você será um dos primeiros a saber.')}
    ${card(`
      ${badge('o que vem por aí')}
      <ul style="margin:0;padding-left:20px;color:#c8c9c5;font-size:14px;line-height:2;">
        <li>Tutoriais práticos com código</li>
        <li>Projetos de dados abertos</li>
        <li>Ferramentas e stacks que uso no dia a dia</li>
      </ul>
    `)}
    ${button('Ver o site', process.env.NEXTAUTH_URL ?? 'https://alexand7e.dev.br')}
    `,
    unsubscribeUrl
  )
}

export function reactivationEmail(name?: string | null, unsubscribeUrl?: string): string {
  const greeting = name ? `Olá, <strong>${name}</strong>!` : 'Olá!'
  return layout(
    `
    ${heading('Inscrição reativada!')}
    ${paragraph(greeting)}
    ${paragraph('Sua inscrição na newsletter foi <strong style="color:#00ff99;">reativada com sucesso</strong>. Que bom ter você de volta!')}
    ${paragraph('Você voltará a receber conteúdo sobre IA, dados e tecnologia pública.')}
    ${button('Ver o site', process.env.NEXTAUTH_URL ?? 'https://alexand7e.dev.br')}
    `,
    unsubscribeUrl
  )
}

export function tutorialEmail(
  tutorial: { title: string; description: string; slug: string; difficulty?: string; estimatedTime?: number | null; tags?: string[] },
  name?: string | null,
  unsubscribeUrl?: string
): string {
  const greeting = name ? `Olá, <strong>${name}</strong>!` : 'Olá!'
  const tutorialUrl = `${BASE_URL}/tutoriais/${tutorial.slug}`

  const difficultyLabel: Record<string, string> = {
    BEGINNER: 'Iniciante',
    INTERMEDIATE: 'Intermediário',
    ADVANCED: 'Avançado',
  }
  const difficulty = tutorial.difficulty ? difficultyLabel[tutorial.difficulty] ?? tutorial.difficulty : null
  const time = tutorial.estimatedTime ? `${tutorial.estimatedTime} min` : null
  const meta = [difficulty, time].filter(Boolean).join(' · ')

  const tagsHtml = (tutorial.tags ?? [])
    .slice(0, 5)
    .map(
      (t) =>
        `<span style="display:inline-block;margin:2px 4px 2px 0;padding:2px 8px;background:#00ff991a;color:#00ff99;
                      border:1px solid #00ff9933;border-radius:4px;font-size:11px;">#${t}</span>`
    )
    .join('')

  return layout(
    `
    ${heading('Novo tutorial publicado')}
    ${paragraph(greeting)}
    ${paragraph('Acabei de publicar um novo tutorial. Dá uma olhada:')}
    ${card(`
      ${meta ? `<p style="margin:0 0 8px 0;font-size:12px;color:#00ff99;font-family:'Courier New',Courier,monospace;">${meta}</p>` : ''}
      <h2 style="margin:0 0 10px 0;font-size:18px;color:#E0E1DD;">${tutorial.title}</h2>
      <p style="margin:0 0 16px 0;font-size:14px;line-height:1.6;color:#c8c9c5;">${tutorial.description}</p>
      ${tagsHtml ? `<div style="margin-bottom:16px;">${tagsHtml}</div>` : ''}
      ${button('Ler tutorial', tutorialUrl)}
    `)}
    `,
    unsubscribeUrl
  )
}

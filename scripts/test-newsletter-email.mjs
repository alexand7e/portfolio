/**
 * Teste direto do envio de e-mail via nodemailer (sem Next.js).
 * Uso: node scripts/test-newsletter-email.mjs
 *
 * Requer as variáveis de ambiente definidas (ou edite diretamente abaixo):
 *   GMAIL_USER=alexand7e@gmail.com
 *   GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
 *   TEST_RECIPIENT=seu@email.com   (opcional, padrão = GMAIL_USER)
 */

import nodemailer from 'nodemailer'

const GMAIL_USER = process.env.GMAIL_USER ?? 'alexand7e@gmail.com'
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD

if (!GMAIL_APP_PASSWORD) {
  console.error('GMAIL_APP_PASSWORD nao definida. Exporte a variavel ou edite o script.')
  process.exit(1)
}

const TO = process.env.TEST_RECIPIENT ?? GMAIL_USER

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_APP_PASSWORD,
  },
})

console.log(`Testando envio de ${GMAIL_USER} -> ${TO} ...`)

try {
  await transporter.verify()
  console.log('Conexao com Gmail OK')

  const info = await transporter.sendMail({
    from: `"Alexandre Barros" <${GMAIL_USER}>`,
    to: TO,
    subject: '[TESTE] Newsletter - Tutorial de exemplo',
    html: `
      <h2>Novo Tutorial Publicado</h2>
      <p>Ola! Este e um e-mail de teste da newsletter.</p>
      <div style="border:1px solid #e5e7eb;border-radius:8px;padding:20px;margin:20px 0;">
        <h3>Tutorial de Exemplo</h3>
        <p>Descricao do tutorial aqui.</p>
        <a href="https://alexand7e.dev.br/tutoriais/exemplo"
           style="background:#2563eb;color:white;padding:10px 20px;border-radius:6px;text-decoration:none;">
          Ler tutorial
        </a>
      </div>
      <p style="color:#6b7280;font-size:14px;">Este e um e-mail de teste - nenhum assinante real foi notificado.</p>
    `,
  })

  console.log('E-mail enviado com sucesso!')
  console.log('Message ID:', info.messageId)
} catch (err) {
  console.error('Falha no envio:', err.message)
  if (err.code === 'EAUTH') {
    console.error('Verifique se o App Password esta correto e a 2FA esta ativa na conta Google.')
  }
  process.exit(1)
}

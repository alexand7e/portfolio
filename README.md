Portfólio - Alexandre Barros dos Santos
=======================================

Isto é um site de portfólio pessoal. Não é um framework, não é uma
biblioteca e não é um template que você deva sair copiando. É o site de
uma pessoa só, com um painel administrativo atrás de autenticação, e foi
escrito para resolver o problema dessa pessoa.

Se mesmo assim você quiser rodá-lo, leia o resto deste arquivo. Ele diz
tudo que você precisa saber. Se algo aqui não funcionar, provavelmente
você pulou um passo.


O QUE ESTÁ AQUI DENTRO
----------------------

Next.js 16 no App Router, React 18, TypeScript e Prisma sobre PostgreSQL.
Autenticação com NextAuth, apenas com provider de credenciais.
Estilização com Tailwind. Animações com Framer Motion. E-mail via
nodemailer no servidor e EmailJS no formulário de contato do cliente.

A escolha de tecnologia não é interessante e não vale discussão.
Funciona.


REQUISITOS
----------

  - Node.js 20.9 ou superior. O Next 16 não roda em menos que isso, e
    não adianta insistir.
  - PostgreSQL. Qualquer instância serve; em desenvolvimento o Neon
    resolve sem você instalar nada localmente.
  - Docker, se você preferir esse caminho. É opcional.


COMPILANDO E RODANDO
--------------------

	git clone https://github.com/alexand7e/portfolio.git
	cd portfolio
	npm install --legacy-peer-deps
	cp .env.example .env.local
	# edite .env.local antes de continuar
	npx prisma migrate dev
	npx prisma generate
	npm run dev

O site sobe em http://localhost:7000.

O `--legacy-peer-deps` não é preguiça. O next-auth declara nodemailer 7
como peer *opcional* e este projeto usa a 9, que é a primeira versão sem
o GHSA-p6gq-j5cr-w38f. Como o único provider em uso é o de credenciais,
o nodemailer do next-auth nunca é carregado e o conflito é decorativo.
Não "conserte" isso rebaixando o nodemailer.


CONFIGURAÇÃO
------------

Toda a configuração vem de variáveis de ambiente. Use `.env.example`
como ponto de partida:

	DATABASE_URL="postgresql://usuario:senha@host:porta/banco?sslmode=require"

	NEXTAUTH_SECRET="troque-isto-em-producao"
	NEXTAUTH_URL="http://localhost:7000"

	ADMIN_EMAIL="admin@exemplo.com"
	ADMIN_PASSWORD="troque-isto-tambem"

	NEXT_PUBLIC_EMAILJS_SERVICE_ID="..."
	NEXT_PUBLIC_EMAILJS_TEMPLATE_ID="..."
	NEXT_PUBLIC_EMAILJS_PUBLIC_KEY="..."

Credencial real não entra em commit. Nunca. Se você commitar uma, ela
vazou: não basta apagar no commit seguinte, você precisa rotacionar o
segredo. Tudo que começa com NEXT_PUBLIC_ vai embutido no bundle do
cliente e é público por construção — não coloque nada sensível ali.

Para criar o usuário administrativo:

	npm run create-admin


DOCKER
------

Construindo localmente:

	docker build -t portfolio .
	docker run -p 7000:7000 \
	  -e DATABASE_URL="..." \
	  -e NEXTAUTH_SECRET="..." \
	  -e NEXTAUTH_URL="http://localhost:7000" \
	  -e ADMIN_EMAIL="..." \
	  portfolio

Ou use a imagem já publicada no GitHub Container Registry, que é o mesmo
com menos espera:

	docker pull ghcr.io/alexand7e/portfolio:latest
	docker run -p 7000:7000 -e DATABASE_URL="..." \
	  ghcr.io/alexand7e/portfolio:latest

Os arquivos de compose estão em docker/.


ESTRUTURA DO CÓDIGO
-------------------

	app/            rotas do App Router
	  admin/        painel administrativo, atrás de autenticação
	  api/          route handlers
	components/     componentes React, separados por área
	lib/            autenticação, prisma, markdown, utilitários
	prisma/         schema e migrações
	scripts/        automações avulsas
	types/          declarações de tipo

Se você for adicionar uma rota dinâmica, note que `params` é uma Promise
e precisa de `await`. Isso é exigência do Next desde a versão 15 e não é
negociável.


BANCO DE DADOS
--------------

PostgreSQL com Prisma. As entidades que importam são Projects,
Experiences, Blog e Users.

	npx prisma studio          # inspecionar os dados
	npx prisma migrate dev     # aplicar migrações
	npx prisma generate        # regerar o client
	npx prisma migrate reset   # apaga tudo, sem perguntar duas vezes

O último comando faz exatamente o que o nome diz. Se você rodá-lo contra
produção, o problema é seu.


TESTES E LINT
-------------

	npm test
	npm run lint

O lint chama o ESLint diretamente. O `next lint` foi removido no Next 16
e a configuração vive em `eslint.config.mjs`, no formato flat — não
procure por `.eslintrc.json`, ele não existe mais.

O lint hoje acusa erros preexistentes das regras novas do
eslint-plugin-react-hooks 7. São reais e estão na fila. Não são
regressões, e não é motivo para abrir issue.


SEGURANÇA
---------

Senhas passam por bcrypt. As rotas administrativas verificam a sessão do
NextAuth no servidor, não no cliente. As dependências são acompanhadas
pelo Dependabot e as correções entram sem cerimônia — inclusive quando
exigem major, porque na prática elas sempre exigem.

Achou uma falha de verdade? Mande e-mail. Não abra issue pública.


CONTATO
-------

	Alexandre Barros dos Santos
	https://github.com/alexand7e
	https://www.linkedin.com/in/alexand7e/
	alexand7e@gmail.com


LICENÇA
-------

Ver LICENSE.

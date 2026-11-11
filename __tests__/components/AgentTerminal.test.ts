import { MAX_INPUT, consumeRateSlot, route, sanitize, searchTerm, suggest } from '@/components/ui/AgentTerminal'

describe('AgentTerminal route', () => {
  it.each([
    ['onde ele trabalha?', 'experience'],
    ['Onde o Alexandre trabalha atualmente?', 'experience'],
    ['qual o cargo dele?', 'experience'],
    ['where does he work?', 'experience'],
    ['mostre seus trabalhos', 'projects'],
    ['quais projetos ele fez?', 'projects'],
    ['que tecnologias ele usa?', 'stack'],
    ['como entro em contato?', 'contact'],
    ['ele escreve artigos?', 'content'],
    ['quem é ele?', 'about'],
    ['get_experience()', 'experience'],
    ['whoami', 'about'],
    ['clear()', 'clear'],
    ['ajuda', 'help'],
    ['github', 'contact'],
    ['qual o linkedin dele?', 'contact'],
  ])('%s -> %s', (question, target) => {
    expect(route(question)).toBe(target)
  })

  it('devolve null para pergunta fora do roteiro', () => {
    expect(route('qual a cor favorita dele?')).toBeNull()
  })
})

describe('AgentTerminal suggest', () => {
  it('completa pelo prefixo da função', () => {
    expect(suggest('get_').map(fn => fn.name)).toEqual(['get_tech_stack()', 'get_experience()'])
  })

  it('aceita trecho do meio do nome depois dos prefixos', () => {
    expect(suggest('stack').map(fn => fn.name)).toEqual(['get_tech_stack()'])
  })

  it('não sugere para perguntas em texto livre', () => {
    expect(suggest('onde ele trabalha')).toEqual([])
  })

  it('some quando o nome já está completo', () => {
    expect(suggest('whoami()')).toEqual([])
  })
})

describe('AgentTerminal sanitize', () => {
  it('remove caracteres invisíveis e de direção', () => {
    expect(sanitize('onde\u200b ele\u202e trabalha\u0000?')).toBe('onde ele trabalha?')
  })

  it('colapsa quebras de linha e espaços', () => {
    expect(sanitize('  quem\n\n é\t ele  ')).toBe('quem é ele')
  })

  it('corta no limite de tamanho', () => {
    expect(sanitize('a'.repeat(5000))).toHaveLength(MAX_INPUT)
  })

  it('mantém HTML como texto (o React escapa na renderização)', () => {
    expect(sanitize('<img src=x onerror=alert(1)>')).toBe('<img src=x onerror=alert(1)>')
  })
})

describe('AgentTerminal consumeRateSlot', () => {
  it('bloqueia o 7º comando dentro de 10s e libera depois da janela', () => {
    let hits: number[] = []
    for (let i = 0; i < 6; i++) {
      const result = consumeRateSlot(hits, 1000 + i * 100)
      expect(result.allowed).toBe(true)
      hits = result.hits
    }

    const blocked = consumeRateSlot(hits, 2000)
    expect(blocked.allowed).toBe(false)
    expect(blocked.hits).toHaveLength(6)

    expect(consumeRateSlot(blocked.hits, 1000 + 10_000).allowed).toBe(true)
  })
})

describe('AgentTerminal searchTerm', () => {
  it.each([
    ['comunismo', 'comunismo'],
    ['o que ele escreveu sobre comunismo?', 'comunismo'],
    ['ele tem algum artigo sobre LGPD?', 'lgpd'],
    ['tem tutorial de visualização?', 'visualização'],
    ['what did he write about governance?', 'governance'],
  ])('%s -> %s', (question, term) => {
    expect(searchTerm(question)).toBe(term)
  })

  it('devolve null quando só há palavras genéricas', () => {
    expect(searchTerm('ele escreve artigos?')).toBeNull()
    expect(searchTerm('blog')).toBeNull()
  })

  it('assunto solto fica fora do roteiro e vai para a busca', () => {
    expect(route('comunismo')).toBeNull()
    expect(route('o que ele sabe sobre comunismo?')).toBeNull()
    expect(route('socialismo')).toBeNull()
  })
})

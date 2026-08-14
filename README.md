# Bíblia Sagrada — Midas

Aplicação web mobile-first para a experiência física da Bíblia NFC da Midas.

## O que já funciona

- leitura dos 66 livros e 1.189 capítulos;
- navegação por livros, capítulos e versículos;
- busca por referência, como João 3:16;
- experiência Promessas de Deus por tema;
- palavra do dia;
- favoritos e anotações salvos no aparelho;
- compartilhamento e links diretos para versículos;
- continuidade da última leitura;
- modo escuro e três tamanhos de texto;
- instalação como PWA;
- leitura offline dos capítulos já visitados;
- layout responsivo, otimizado primeiro para smartphones.

## Conteúdo bíblico

O texto é a tradução histórica de João Ferreira de Almeida disponibilizada pelo
bible-api.com. A API reúne traduções em domínio público ou com licença livre,
oferece CORS para uso no navegador e limita o serviço público a 15 requisições
a cada 30 segundos por endereço IP.

O aplicativo guarda no aparelho os capítulos já carregados para reduzir
requisições e permitir releitura sem conexão.

## Desenvolvimento local

Não há dependências de produção nem etapa de compilação.

1. Inicie um servidor estático nesta pasta.
2. Abra o endereço local no navegador.
3. Execute npm test para validar a lista dos livros e as referências das promessas.
4. Execute npm run check para validar também a sintaxe JavaScript.

## Rotas para NFC

As rotas são baseadas em fragmentos, então funcionam no GitHub Pages sem gerar
erros de página inexistente:

- Bíblia: #/inicio
- Lista de livros: #/biblia
- Promessas: #/promessas
- Promessas por tema: #/promessas/Paz
- Capítulo: #/leitura/JHN/3
- Versículo: #/leitura/JHN/3/16

Antes de gravar o lote definitivo de tags, a URL deve usar um domínio controlado
pela Midas. Assim, a hospedagem poderá mudar no futuro sem reprogramar as tags.

## Privacidade

Favoritos, anotações, preferências e progresso ficam no localStorage do
navegador. Esta versão não possui conta, login, painel administrativo ou
sincronização externa.

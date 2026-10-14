# Boletim Digital — Ambiente de Teste

Origem: `Profbt/Boletim-Digital-8c` (preservado sem alterações).

Ambiente de laboratório utilizado para testar integrações, diferentes turmas e funcionalidades antes de incorporá-las aos projetos utilizados pelos estudantes.

- Ano letivo: 2026.
- Identificação lógica: turma + número de chamada (por exemplo, `8C-17`).
- Regra de PIN: `2026 + chamada com dois dígitos` (por exemplo, chamada 17 → `202617`).
- Turma: código simples de 1 a 10 letras ou números; chamada: inteiro de 1 a 50.
- Não utilize dados pessoais reais neste ambiente. Os dados de disciplinas, notas, faltas e frequência são fictícios e iguais para qualquer turma/chamada nesta etapa.
- O PIN esperado aparece no painel apenas para testes: ele é previsível, está em código público e **não constitui autenticação**. Nunca usar essa exibição na versão dos estudantes.
- Sem API, banco de dados, sincronização ou armazenamento persistente nesta versão. `CONFIG.apiUrl` permanece vazio até a futura integração.

Abra `index.html` no navegador ou acesse a publicação do GitHub Pages em `https://profbt.github.io/Boletim-Digital-Teste/`.

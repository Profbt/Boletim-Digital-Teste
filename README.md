# Boletim Digital — Ambiente de Teste

Laboratório público derivado de `Profbt/Boletim-Digital-8c`, que permanece sem alterações. A API central `https://boletim-api.profbt.com.br` é a única fonte persistente; não há armazenamento local do PIN ou dos boletins.

1. Selecione a turma e a chamada (1 a 50). O painel mostra o identificador e o PIN esperado apenas para testes do professor; esse PIN previsível **não constitui autenticação segura** e não deve aparecer na versão dos estudantes.
2. Digite o PIN manualmente e clique em **Conectar ao boletim**. Um boletim existente é carregado integralmente da API. Um boletim novo usa uma cópia normalizada das disciplinas fictícias do laboratório como modelo visual, sem salvar automaticamente.
3. Clique em **Alterar dados** para editar notas de 0 a 10 e faltas inteiras não negativas. Nota vazia significa `null`. Clique em **Salvar alterações** para persistir na API.
4. **Trocar boletim** encerra a sessão em memória sem apagar o registro no servidor. Para verificar persistência, recarregue a página ou abra o site em outro navegador e conecte novamente.

A frequência de 92% permanece fictícia e não é calculada a partir das faltas. Não utilize dados pessoais reais neste laboratório. A turma `9A` neste estágio serve para testar isolamento e persistência, não o currículo definitivo do 9º ano.

Publicação: https://profbt.github.io/Boletim-Digital-Teste/

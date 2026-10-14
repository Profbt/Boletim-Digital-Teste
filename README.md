# Boletim Digital — Ambiente de Teste

Laboratório público derivado de `Profbt/Boletim-Digital-8c`, que permanece sem alterações. A API central `https://boletim-api.profbt.com.br` é a única fonte persistente; não há armazenamento local do PIN ou dos boletins.

1. Selecione a turma e a chamada (1 a 50). O painel mostra o identificador e o PIN esperado apenas para testes do professor; esse PIN previsível **não constitui autenticação segura** e não deve aparecer na versão dos estudantes.
2. Digite o PIN manualmente e clique em **Conectar ao boletim**. Um boletim com dados existentes é carregado integralmente da API, sem substituição por modelos. Se a API retornar `dados: null` (inclusive após uma abertura anterior sem salvamento), a turma seleciona automaticamente o modelo fictício do 8º ano (`8A`–`8C`) ou do 9º ano (`9A`–`9C`); nenhuma seleção adicional ou salvamento automático é feito.
3. Clique em **Alterar dados** para editar notas de 0 a 10 e faltas inteiras não negativas. Nota vazia significa `null`. Clique em **Salvar alterações** para persistir na API.
4. **Trocar boletim** encerra a sessão em memória sem apagar o registro no servidor. Para verificar persistência, recarregue a página ou abra o site em outro navegador e conecte novamente.

A frequência de 92% permanece fictícia e não é calculada a partir das faltas. Não utilize dados pessoais reais neste laboratório. O modelo do 9º ano usa as disciplinas e notas fictícias de `Profbt/boletim9C` como referência; boletins já salvos sempre prevalecem.

Publicação: https://profbt.github.io/Boletim-Digital-Teste/

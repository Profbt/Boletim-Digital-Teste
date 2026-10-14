/* Boletim Digital — laboratório. A API é a única fonte persistente. */
const CONFIG = {
  anoLetivo: 2026,
  apiUrl: "https://boletim-api.profbt.com.br",
  modoTeste: true
};

function gerarPin(numeroChamada) {
  return `2026${String(numeroChamada).padStart(2, "0")}`;
}

/* Modelo fictício do laboratório; nunca substitui dados já salvos na API. */
const dadosBrutos = [
  { disciplina: "Língua Portuguesa",           tri1: 78, tri2: 15,  tri3: null, faltas: [5, 7, 0] },
  { disciplina: "Matemática",                  tri1: 75, tri2: 51,  tri3: null, faltas: [6, 8, 0] },
  { disciplina: "Ciências",                    tri1: 75, tri2: 25,  tri3: null, faltas: [2, 5, 0] },
  { disciplina: "História",                    tri1: 75, tri2: 98,  tri3: null, faltas: [9, 1, 0] },
  { disciplina: "Geografia",                   tri1: 75, tri2: 68,  tri3: null, faltas: [8, 3, 0] },
  { disciplina: "Língua Inglesa",              tri1: 75, tri2: 75,  tri3: null, faltas: [4, 8, 0] },
  { disciplina: "Arte",                        tri1: 75, tri2: 84,  tri3: null, faltas: [65, 50, 0] },
  { disciplina: "Educação Física",             tri1: 75, tri2: 98,  tri3: null, faltas: [8, 65, 0] },
  { disciplina: "Educação Digital",            tri1: 75, tri2: 100, tri3: null, faltas: [45, 8, 0] },
  { disciplina: "Educação Financeira",         tri1: 75, tri2: 59,  tri3: null, faltas: [5, 5, 0] },
  { disciplina: "Estudo Orientado",            tri1: 75, tri2: 65,  tri3: null, faltas: [2, 6, 0] },
  { disciplina: "Redação e Leitura",           tri1: 75, tri2: 77,  tri3: null, faltas: [3, 2, 0] },
  { disciplina: "Pensamento Lógico",           tri1: 75, tri2: 72,  tri3: null, faltas: [0, 3, 0] },
  { disciplina: "Literatura Arte e Movimento", tri1: 78, tri2: 88,  tri3: null, faltas: [1, 2, 0] },
  { disciplina: "Práticas Experimentais",      tri1: 55, tri2: 71,  tri3: null, faltas: [4, 1, 0] }
];

const FREQUENCIA_DEMONSTRATIVA = 92;
let sessaoAtual = null;
let dadosAtuais = null;
let disciplinasProcessadas = [];
let requisicaoEmAndamento = false;

function normalizarNota(valor) {
  if (valor === null || valor === undefined || String(valor).trim() === "") return null;
  const numero = Number(typeof valor === "string" ? valor.trim().replace(",", ".") : valor);
  if (!Number.isFinite(numero)) return null;
  if (numero >= 0 && numero <= 10) return numero;
  if (numero > 10 && numero <= 100) return numero / 10;
  return null;
}

function calcularMedia(notas) {
  const validas = notas.filter((nota) => nota !== null);
  return validas.length ? validas.reduce((soma, nota) => soma + nota, 0) / validas.length : null;
}

function definirSituacao(media) {
  if (media === null) return { texto: "Nota ainda não disponível", classe: "situacao-neutra" };
  if (media >= 6) return { texto: "Bom desempenho", classe: "situacao-bom" };
  return { texto: "Atenção", classe: "situacao-atencao" };
}

function formatarNota(nota) {
  return nota === null ? "—" : nota.toFixed(1).replace(".", ",");
}

function dadosIniciais() {
  return {
    disciplinas: dadosBrutos.map((item) => ({
      disciplina: item.disciplina,
      tri1: normalizarNota(item.tri1),
      tri2: normalizarNota(item.tri2),
      tri3: normalizarNota(item.tri3),
      faltas: [...item.faltas]
    }))
  };
}

function dadosValidos(dados) {
  return dados && Array.isArray(dados.disciplinas) && dados.disciplinas.every((item) =>
    item && typeof item.disciplina === "string" &&
    ["tri1", "tri2", "tri3"].every((tri) => item[tri] === null ||
      (typeof item[tri] === "number" && Number.isFinite(item[tri]))) &&
    Array.isArray(item.faltas) && item.faltas.length === 3 &&
    item.faltas.every((falta) => Number.isSafeInteger(falta) && falta >= 0)
  );
}

function processarDados() {
  disciplinasProcessadas = dadosAtuais.disciplinas.map((item) => {
    const tri1 = normalizarNota(item.tri1);
    const tri2 = normalizarNota(item.tri2);
    const tri3 = normalizarNota(item.tri3);
    const media = calcularMedia([tri1, tri2, tri3]);
    return {
      disciplina: item.disciplina,
      tri1, tri2, tri3, media,
      totalFaltas: item.faltas.reduce((soma, falta) => soma + falta, 0),
      situacao: definirSituacao(media)
    };
  });
}

function montarTabela() {
  const corpo = document.getElementById("corpoTabela");
  corpo.replaceChildren();
  for (const disciplina of disciplinasProcessadas) {
    const linha = document.createElement("tr");
    function celula(texto) {
      const td = document.createElement("td");
      td.textContent = String(texto);
      linha.appendChild(td);
      return td;
    }
    celula(disciplina.disciplina);
    celula(formatarNota(disciplina.tri1));
    celula(formatarNota(disciplina.tri2));
    celula(formatarNota(disciplina.tri3));
    const media = celula("");
    const forte = document.createElement("strong");
    forte.textContent = formatarNota(disciplina.media);
    media.appendChild(forte);
    celula(disciplina.totalFaltas);
    const situacao = document.createElement("span");
    situacao.className = `situacao ${disciplina.situacao.classe}`;
    situacao.textContent = disciplina.situacao.texto;
    celula("").appendChild(situacao);
    corpo.appendChild(linha);
  }
}

function montarCards() {
  const container = document.getElementById("cardsResumo");
  container.replaceChildren();
  const medias = disciplinasProcessadas.map((item) => item.media).filter((media) => media !== null);
  const mediaGeral = calcularMedia(medias);
  const totalFaltas = disciplinasProcessadas.reduce((soma, item) => soma + item.totalFaltas, 0);
  const bomDesempenho = disciplinasProcessadas.filter((item) => item.situacao.texto === "Bom desempenho").length;
  const atencao = disciplinasProcessadas.filter((item) => item.situacao.texto === "Atenção").length;
  const cards = [
    ["Média geral", mediaGeral === null ? "—" : formatarNota(mediaGeral), "Média das disciplinas com nota lançada", true],
    ["Total de faltas", totalFaltas, "Soma das faltas nos três trimestres", false],
    ["Bom desempenho", bomDesempenho, "Disciplinas com média ≥ 6,0", true],
    ["Precisam de atenção", atencao, "Disciplinas com média < 6,0", false],
    ["Frequência", `${FREQUENCIA_DEMONSTRATIVA}%`, "Frequência demonstrativa, não calculada pelas faltas", true]
  ];
  for (const [titulo, valor, descricao, verde] of cards) {
    const card = document.createElement("div");
    card.className = verde ? "card card-verde" : "card";
    for (const [classe, texto] of [["card-titulo", titulo], ["card-valor", valor], ["card-descricao", descricao]]) {
      const paragrafo = document.createElement("p");
      paragrafo.className = classe;
      paragrafo.textContent = String(texto);
      card.appendChild(paragrafo);
    }
    container.appendChild(card);
  }
}

function atualizarInterface() {
  processarDados();
  montarCards();
  montarTabela();
}

function atualizarPainelTeste() {
  const turmaInput = document.getElementById("turmaTeste");
  const chamadaInput = document.getElementById("chamadaTeste");
  const turma = turmaInput.value.trim().toUpperCase();
  const chamadaTexto = chamadaInput.value.trim();
  const chamada = Number(chamadaTexto);
  const turmaValida = /^[A-Z0-9]{1,10}$/.test(turma);
  const chamadaValida = /^\d{1,2}$/.test(chamadaTexto) && chamada >= 1 && chamada <= 50;
  turmaInput.setAttribute("aria-invalid", String(!turmaValida));
  chamadaInput.setAttribute("aria-invalid", String(!chamadaValida));
  const campos = ["turmaAtual", "chamadaAtual", "identificadorAtual", "pinEsperado"]
    .map((id) => document.getElementById(id));
  if (!turmaValida || !chamadaValida) {
    document.getElementById("erroConfiguracao").textContent = !turmaValida
      ? "Informe uma turma com 1 a 10 letras ou números."
      : "A chamada deve ser um número inteiro de 1 a 50.";
    campos.forEach((campo) => { campo.textContent = "—"; });
    return null;
  }
  document.getElementById("erroConfiguracao").textContent = "";
  campos[0].textContent = turma;
  campos[1].textContent = String(chamada);
  campos[2].textContent = `${turma}-${chamada}`;
  campos[3].textContent = gerarPin(chamada);
  return { turma, numero_chamada: chamada };
}

function mensagemErro(erro) {
  if (erro.status === 401) return "Turma, chamada ou PIN inválidos.";
  if (erro.status === 429) return "Muitas tentativas. Aguarde um minuto e tente novamente.";
  if (erro.status === 400 || erro.status === 422 || erro.dadosInvalidos) return "Dados inválidos. Confira os campos e tente novamente.";
  return "Não foi possível conectar ao servidor. Tente novamente.";
}

async function requisitar(caminho, metodo, corpo) {
  const resposta = await fetch(`${CONFIG.apiUrl}${caminho}`, {
    method: metodo,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(corpo),
    cache: "no-store"
  });
  if (!resposta.ok) throw { status: resposta.status };
  try {
    return await resposta.json();
  } catch (_) {
    throw { dadosInvalidos: true };
  }
}

async function conectar(evento) {
  evento.preventDefault();
  if (requisicaoEmAndamento) return;
  const selecao = atualizarPainelTeste();
  if (!selecao) return;
  const pinInput = document.getElementById("pinTeste");
  const pin = pinInput.value.trim();
  if (!/^\d{6}$/.test(pin)) {
    document.getElementById("erroConfiguracao").textContent = "Informe um PIN de seis dígitos.";
    return;
  }
  requisicaoEmAndamento = true;
  const botao = document.getElementById("botaoConectar");
  const estado = document.getElementById("estadoConexao");
  botao.disabled = true;
  botao.textContent = "Conectando...";
  estado.textContent = "Conectando...";
  try {
    const resposta = await requisitar("/api/v1/boletins/abrir", "POST", { ...selecao, pin });
    if (resposta.novo === true && resposta.dados === null) {
      dadosAtuais = dadosIniciais();
      document.getElementById("origemDados").textContent = "Boletim novo — usando dados iniciais de teste (ainda não salvos)";
    } else if (resposta.novo === false && dadosValidos(resposta.dados)) {
      dadosAtuais = JSON.parse(JSON.stringify(resposta.dados));
      document.getElementById("origemDados").textContent = "Dados carregados da API";
    } else {
      throw { dadosInvalidos: true };
    }
    sessaoAtual = { ...selecao, pin };
    pinInput.value = "";
    estado.textContent = "";
    document.getElementById("conexaoAtual").textContent = `Conectado: ${selecao.turma} — chamada ${selecao.numero_chamada}`;
    document.getElementById("estadoSalvamento").textContent = "";
    document.getElementById("painelTeste").hidden = true;
    document.getElementById("boletimConteudo").hidden = false;
    atualizarInterface();
  } catch (erro) {
    estado.textContent = mensagemErro(erro);
  } finally {
    requisicaoEmAndamento = false;
    botao.disabled = false;
    botao.textContent = "Conectar ao boletim";
  }
}

function entradaEditor(indice, nomeCampo, rotulo, valor, tipo) {
  const campo = document.createElement("label");
  campo.className = "campo-editor";
  const texto = document.createElement("span");
  texto.textContent = rotulo;
  const input = document.createElement("input");
  input.type = "text";
  input.inputMode = tipo === "nota" ? "decimal" : "numeric";
  input.autocomplete = "off";
  input.value = String(valor);
  input.dataset.indice = String(indice);
  input.dataset.campo = nomeCampo;
  input.setAttribute("aria-label", `${rotulo} — ${dadosAtuais.disciplinas[indice].disciplina}`);
  campo.append(texto, input);
  return campo;
}

function abrirEditor() {
  if (!sessaoAtual || requisicaoEmAndamento) return;
  const container = document.getElementById("linhasEditor");
  container.replaceChildren();
  dadosAtuais.disciplinas.forEach((item, indice) => {
    const grupo = document.createElement("fieldset");
    grupo.className = "disciplina-editor";
    const titulo = document.createElement("legend");
    titulo.textContent = item.disciplina;
    grupo.appendChild(titulo);
    const campos = document.createElement("div");
    campos.className = "grade-editor";
    for (const [campo, rotulo] of [["tri1", "1º trimestre"], ["tri2", "2º trimestre"], ["tri3", "3º trimestre"]]) {
      const nota = normalizarNota(item[campo]);
      campos.appendChild(entradaEditor(indice, campo, rotulo, nota === null ? "" : String(nota).replace(".", ","), "nota"));
    }
    item.faltas.forEach((falta, trimestre) => {
      campos.appendChild(entradaEditor(indice, `falta${trimestre}`, `Faltas do ${trimestre + 1}º trimestre`, falta, "falta"));
    });
    grupo.appendChild(campos);
    container.appendChild(grupo);
  });
  document.getElementById("erroEditor").textContent = "";
  document.getElementById("estadoSalvamento").textContent = "";
  document.getElementById("painelEditor").hidden = false;
  document.getElementById("botaoAlterar").disabled = true;
  const primeiro = container.querySelector("input");
  if (primeiro) primeiro.focus();
}

function fecharEditor() {
  document.getElementById("painelEditor").hidden = true;
  document.getElementById("linhasEditor").replaceChildren();
  document.getElementById("erroEditor").textContent = "";
  document.getElementById("botaoAlterar").disabled = false;
}

function lerNota(texto) {
  const valor = texto.trim();
  if (valor === "") return null;
  if (!/^(?:10(?:[.,]0+)?|[0-9](?:[.,][0-9]+)?)$/.test(valor)) throw new Error("nota");
  const numero = Number(valor.replace(",", "."));
  if (!Number.isFinite(numero) || numero < 0 || numero > 10) throw new Error("nota");
  return numero;
}

function lerFaltas(texto) {
  const valor = texto.trim();
  if (!/^(?:0|[1-9]\d*)$/.test(valor)) throw new Error("falta");
  const numero = Number(valor);
  if (!Number.isSafeInteger(numero)) throw new Error("falta");
  return numero;
}

function coletarEdicao() {
  const campos = [...document.querySelectorAll("#linhasEditor input")];
  const disciplinas = dadosAtuais.disciplinas.map((item) => ({
    disciplina: item.disciplina, tri1: null, tri2: null, tri3: null, faltas: [0, 0, 0]
  }));
  for (const input of campos) {
    try {
      const indice = Number(input.dataset.indice);
      const campo = input.dataset.campo;
      if (campo.startsWith("falta")) {
        disciplinas[indice].faltas[Number(campo.slice(5))] = lerFaltas(input.value);
      } else {
        disciplinas[indice][campo] = lerNota(input.value);
      }
      input.setAttribute("aria-invalid", "false");
    } catch (erro) {
      input.setAttribute("aria-invalid", "true");
      input.focus();
      throw { dadosInvalidos: true };
    }
  }
  return { disciplinas };
}

async function salvar(evento) {
  evento.preventDefault();
  if (!sessaoAtual || requisicaoEmAndamento) return;
  const erroEditor = document.getElementById("erroEditor");
  erroEditor.textContent = "";
  let dados;
  try {
    dados = coletarEdicao();
  } catch (erro) {
    erroEditor.textContent = "Dados inválidos. Confira notas (0 a 10) e faltas (inteiros não negativos).";
    return;
  }
  requisicaoEmAndamento = true;
  const botao = document.getElementById("botaoSalvar");
  const cancelar = document.getElementById("botaoCancelar");
  const trocar = document.getElementById("botaoTrocar");
  botao.disabled = true;
  cancelar.disabled = true;
  trocar.disabled = true;
  botao.textContent = "Salvando...";
  try {
    const resposta = await requisitar("/api/v1/boletins/salvar", "PUT", { ...sessaoAtual, dados });
    if (resposta.ok !== true) throw { dadosInvalidos: true };
    dadosAtuais = dados;
    atualizarInterface();
    document.getElementById("origemDados").textContent = "Dados carregados da API";
    document.getElementById("estadoSalvamento").textContent = "Dados salvos com sucesso.";
    fecharEditor();
  } catch (erro) {
    erroEditor.textContent = mensagemErro(erro);
  } finally {
    requisicaoEmAndamento = false;
    botao.disabled = false;
    cancelar.disabled = false;
    trocar.disabled = false;
    botao.textContent = "Salvar alterações";
  }
}

function trocarBoletim() {
  if (requisicaoEmAndamento) return;
  fecharEditor();
  sessaoAtual = null;
  dadosAtuais = null;
  disciplinasProcessadas = [];
  document.getElementById("turmaTeste").value = "";
  document.getElementById("chamadaTeste").value = "";
  document.getElementById("pinTeste").value = "";
  document.getElementById("cardsResumo").replaceChildren();
  document.getElementById("corpoTabela").replaceChildren();
  document.getElementById("estadoConexao").textContent = "";
  document.getElementById("estadoSalvamento").textContent = "";
  document.getElementById("origemDados").textContent = "";
  document.getElementById("boletimConteudo").hidden = true;
  document.getElementById("painelTeste").hidden = false;
  atualizarPainelTeste();
  document.getElementById("turmaTeste").focus();
}

function iniciar() {
  document.getElementById("turmaTeste").addEventListener("input", atualizarPainelTeste);
  document.getElementById("chamadaTeste").addEventListener("input", atualizarPainelTeste);
  document.getElementById("formConectar").addEventListener("submit", conectar);
  document.getElementById("botaoAlterar").addEventListener("click", abrirEditor);
  document.getElementById("botaoCancelar").addEventListener("click", fecharEditor);
  document.getElementById("formEditar").addEventListener("submit", salvar);
  document.getElementById("botaoTrocar").addEventListener("click", trocarBoletim);
  atualizarPainelTeste();
}

iniciar();

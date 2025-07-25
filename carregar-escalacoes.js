let times = [];
let timeSelecionadoA = null;
let timeSelecionadoB = null;
let escalações = { A: [], B: [] };
const formacoesDisponiveis = {
  "4-3-3": [
    "goleiro",
    "zagueiro",
    "zagueiro",
    "lateral-esquerdo",
    "lateral-direito",
    "volante",
    "meia",
    "meia",
    "ponta",
    "ponta",
    "atacante",
  ],
  "4-4-2": [
    "goleiro",
    "zagueiro",
    "zagueiro",
    "lateral-esquerdo",
    "lateral-direito",
    "volante",
    "meia",
    "meia",
    "meia",
    "atacante",
    "atacante",
  ],
  "4-2-3-1": [
    "goleiro",
    "zagueiro",
    "zagueiro",
    "lateral-esquerdo",
    "lateral-direito",
    "volante",
    "volante",
    "ponta",
    "meia",
    "ponta",
    "atacante",
  ],
  "4-3-1-2": [
    "goleiro",
    "zagueiro",
    "zagueiro",
    "lateral-esquerdo",
    "lateral-direito",
    "volante",
    "volante",
    "volante",
    "meia",
    "atacante",
    "atacante",
  ],
  "4-2-4": [
    "goleiro",
    "zagueiro",
    "zagueiro",
    "lateral-esquerdo",
    "lateral-direito",
    "volante",
    "meia",
    "ponta",
    "ponta",
    "atacante",
    "atacante",
  ],
  "3-5-2": [
    "goleiro",
    "zagueiro",
    "zagueiro",
    "zagueiro",
    "volante",
    "meia",
    "meia",
    "ponta",
    "ponta",
    "atacante",
    "atacante",
  ],
  "3-4-3": [
    "goleiro",
    "zagueiro",
    "zagueiro",
    "zagueiro",
    "volante",
    "meia",
    "meia",
    "meia",
    "ponta",
    "ponta",
    "atacante",
  ],
  "5-3-2": [
    "goleiro",
    "zagueiro",
    "zagueiro",
    "zagueiro",
    "lateral-esquerdo",
    "lateral-direito",
    "volante",
    "meia",
    "meia",
    "atacante",
    "atacante",
  ],
};

function abrirSelecaoTimes() {
  // Oculta todas as seções
  document
    .querySelectorAll(".section")
    .forEach((sec) => (sec.style.display = "none"));

  // Exibe a seção para escolher a origem dos times
  document.getElementById("escolhaOrigem").style.display = "block";
}

function validarSelecao() {
  const a = document.getElementById("timeA").value;
  const b = document.getElementById("timeB").value;
  document.getElementById("btnAvancar").disabled = a === b || !a || !b;
}

function irParaEscalacao() {
  const nomeA = document.getElementById("timeA").value;
  const nomeB = document.getElementById("timeB").value;
  timeSelecionadoA = times.find((t) => t.nome === nomeA);
  timeSelecionadoB = times.find((t) => t.nome === nomeB);

  document.getElementById("selecaoTimes").style.display = "none";
  document.getElementById("escalacaoContainer").style.display = "block";
  carregarFormacoes();
  montarInterfaceEscalacao();

  window.estadoCampoNeutro = document.getElementById("campoNeutro")?.checked;
}

function carregarFormacoes() {
  const formacoesContainer = document.getElementById("formacoes");
  formacoesContainer.classList.add("layout-responsivo");
  const selectA = document.getElementById("formacaoA");
  const selectB = document.getElementById("formacaoB");

  Object.keys(formacoesDisponiveis).forEach((f) => {
    const op1 = document.createElement("option");
    op1.value = f;
    op1.textContent = f;
    selectA.appendChild(op1);

    const op2 = document.createElement("option");
    op2.value = f;
    op2.textContent = f;
    selectB.appendChild(op2);
  });

  selectA.addEventListener("change", montarInterfaceEscalacao);
  selectB.addEventListener("change", montarInterfaceEscalacao);
}

function montarInterfaceEscalacao() {
  const container = document.getElementById("elencoTimes");
  container.innerHTML = "";

  const formA = document.getElementById("formacaoA").value;
  const formB = document.getElementById("formacaoB").value;
  escalações.A = Array(formacoesDisponiveis[formA].length).fill(null);
  escalações.B = Array(formacoesDisponiveis[formB].length).fill(null);

  const blocoA = document.createElement("div");
  const blocoB = document.createElement("div");

  blocoA.innerHTML = `
  <h3><img src="${timeSelecionadoA.logo}" alt="logo" width="30" style="vertical-align: middle; margin-right: 8px;">
  ${timeSelecionadoA.nome} - ${formA}</h3>`;

  blocoB.innerHTML = `
  <h3><img src="${timeSelecionadoB.logo}" alt="logo" width="30" style="vertical-align: middle; margin-right: 8px;">
  ${timeSelecionadoB.nome} - ${formB}</h3>`;

  formacoesDisponiveis[formA].forEach((pos, i) => {
    const linha = document.createElement("div");
    linha.innerHTML = ` ${pos.toUpperCase()}: <span id="slotA${i}">(nenhum)</span> <button class="btn-selecionar" onclick="abrirModal('A', ${i}, '${pos}')">Selecionar</button> <button class="btn-remover" onclick="removerJogador('A', ${i})">X</button> `;
    blocoA.appendChild(linha);
  });

  formacoesDisponiveis[formB].forEach((pos, i) => {
    const linha = document.createElement("div");
    linha.innerHTML = `${pos.toUpperCase()}: <span id="slotB${i}">(nenhum)</span> <button class="btn-selecionar" onclick="abrirModal('B', ${i}, '${pos}')">Selecionar</button> <button class="btn-remover" onclick="removerJogador('B', ${i})">X</button> `;
    blocoB.appendChild(linha);
  });

  container.appendChild(blocoA);
  container.appendChild(blocoB);

  const botaoAutoA = document.createElement("button");
  botaoAutoA.textContent = "Preencher automaticamente A";
  botaoAutoA.onclick = () => preencherAuto("A");
  container.appendChild(botaoAutoA);

  const botaoAutoB = document.createElement("button");
  botaoAutoB.textContent = "Preencher automaticamente B";
  botaoAutoB.onclick = () => preencherAuto("B");
  container.appendChild(botaoAutoB);
}

function removerJogador(timeKey, index) {
  // Zera o slot da escalação
  escalações[timeKey][index] = null;

  // Atualiza visualmente o slot
  const slot = document.getElementById(`slot${timeKey}${index}`);
  if (slot) slot.textContent = "(nenhum)";

  // Revalida se pode avançar para próxima etapa
  verificarSePodeAvancar?.();
}

function preencherAuto(timeKey) {
  const time = timeKey === "A" ? timeSelecionadoA : timeSelecionadoB;
  const formacao = document.getElementById("formacao" + timeKey).value;
  const posicoes = formacoesDisponiveis[formacao];

  const jaUsados = new Set(escalações[timeKey]);
  posicoes.forEach((pos, i) => {
    if (!escalações[timeKey][i]) {
      const jogador = time.jogadores.find(
        (j) => j.posicao === pos && !jaUsados.has(j.nome)
      );
      if (jogador) {
        escalações[timeKey][i] = jogador.nome;
        document.getElementById(`slot${timeKey}${i}`).textContent =
          jogador.nome;
        jaUsados.add(jogador.nome);
      }
    }
  });

  verificarSePodeAvancar();
}

function verificarSePodeAvancar() {
  const completos =
    escalações.A.every((n) => n) && escalações.B.every((n) => n);
  document.getElementById("botaoConfirmarEscalacao").disabled = !completos;
}

function abrirModal(timeKey, index, posicao) {
  const modal = document.getElementById("modal");
  const lista = document.getElementById("listaJogadores");
  lista.innerHTML = "";

  const time = timeKey === "A" ? timeSelecionadoA : timeSelecionadoB;
  const jogadores = time.jogadores.filter((j) => j.posicao === posicao);
  const usados = escalações[timeKey].filter((nome, i) => i !== index);

  if (jogadores.length === 0) {
    lista.innerHTML = "<p>Nenhum jogador disponível para essa posição.</p>";
  } else {
    jogadores.forEach((j) => {
      const botao = document.createElement("button");
      botao.textContent = j.nome;
      botao.disabled = usados.includes(j.nome); // bloqueia se já estiver usado
      botao.onclick = () => selecionarJogador(timeKey, index, j.nome);
      lista.appendChild(botao);
    });
  }

  modal.dataset.timeKey = timeKey;
  modal.dataset.index = index;
  modal.style.display = "block";
}

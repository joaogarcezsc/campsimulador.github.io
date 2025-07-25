function selecionarJogador(timeKey, index, nome) {
  const escala = escalações[timeKey];

  const jogadorAnterior = escala[index];
  if (jogadorAnterior) {
    const usados = escala.filter((n, i) => i !== index);
    escalações[timeKey] = escala.map((n, i) => (i === index ? nome : n));
  } else {
    escala[index] = nome;
  }

  document.getElementById(`slot${timeKey}${index}`).textContent = nome;
  document.getElementById("modal").style.display = "none";
  verificarSePodeAvancar?.();
}

function confirmarEscalacoes() {
  document.getElementById("escalacaoContainer").style.display = "none";

  const conteudo = document.getElementById("conteudo");

  // Remove tela anterior de confrontos se houver
  const anterior = document.getElementById("telaConfrontos");
  if (anterior) anterior.remove();

  const container = document.createElement("div");
  container.className = "section";
  container.id = "telaConfrontos";
  container.innerHTML =
    "<h2>Confrontos - Selecione o vencedor de cada duelo</h2>";

  const formA = document.getElementById("formacaoA").value;
  const formB = document.getElementById("formacaoB").value;

  const posA = formacoesDisponiveis[formA];
  const posB = formacoesDisponiveis[formB];
  confrontos = [];

  const limite = Math.max(posA.length, posB.length);
  for (let i = 0; i < limite; i++) {
    const jogadorA = escalações.A[i] || "(vazio)";
    const jogadorB = escalações.B[i] || "(vazio)";
    const linha = document.createElement("div");
    linha.innerHTML = `${jogadorA} × ${jogadorB} 
 <button onclick="definirVencedor(${i}, 'A', this)">A</button>
<button onclick="definirVencedor(${i}, 'B', this)">B</button>`;
    confrontos[i] = {
      tipo: "jogador",
      index: i,
      jogadorA,
      jogadorB,
      vencedor: null,
    };
    container.appendChild(linha);
  }

  // confronto dos treinadores
  const tecnicoLinha = document.createElement("div");
  tecnicoLinha.innerHTML = `${timeSelecionadoA.treinador.nome} × ${timeSelecionadoB.treinador.nome} (Treinadores)
<button onclick="definirVencedor('tecnico', 'A', this)">A</button>
<button onclick="definirVencedor('tecnico', 'B', this)">B</button>`;
  confrontos.push({
    tipo: "treinador",
    treinadorA: timeSelecionadoA.treinador.nome,
    treinadorB: timeSelecionadoB.treinador.nome,
    vencedor: null,
  });
  container.appendChild(tecnicoLinha);

  const btn = document.createElement("button");
  btn.textContent = "Simular Partida";
  btn.onclick = () => simularPartida();
  container.appendChild(btn);

  conteudo.appendChild(container);
}

function definirVencedor(index, vencedor, btn) {
  if (index === "tecnico") {
    const c = confrontos.find((c) => c.tipo === "treinador");
    if (!c.vencedor) c.vencedor = vencedor;
  } else {
    if (!confrontos[index].vencedor) confrontos[index].vencedor = vencedor;
  }

  // Desabilita ambos os botões do confronto após escolha
  btn.disabled = true;
  const sibling = btn.parentNode.querySelectorAll("button");
  sibling.forEach((b) => {
    if (b !== btn) b.disabled = true;
  });

  const todos = confrontos.every((c) => c.vencedor !== null);
  const botao = document.getElementById("botaoSimularPartida");
  if (botao) botao.disabled = !todos;
}

window.onload = () => {
  // Fecha o modal ao clicar em "fechar"
  document.getElementById("fecharModal").onclick = () => {
    document.getElementById("modal").style.display = "none";
  };

  // Oculta todas as seções no início
  document
    .querySelectorAll(".section")
    .forEach((s) => (s.style.display = "none"));

  // Exibe apenas a escolha de origem
  document.getElementById("escolhaOrigem").style.display = "block";
};

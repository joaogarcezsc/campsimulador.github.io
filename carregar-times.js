let caminhoArquivo = "data.json"; // padrão: CAMP

function definirOrigemTimes(origem) {
  caminhoArquivo = origem === "reais" ? "timesreais.json" : "data.json";
}

function irParaSelecaoTimes() {
  const origem = document.querySelector('input[name="origem"]:checked').value;
  definirOrigemTimes(origem);
  document.getElementById("escolhaOrigem").style.display = "none";
  abrirSelecaoTimes();
}

async function carregarJSON(caminho = "data.json") {
  const res = await fetch(caminho);
  const data = await res.json();
  times = data.times;

  const timeASelect = document.getElementById("timeA");
  const timeBSelect = document.getElementById("timeB");

  // Limpa opções anteriores
  timeASelect.innerHTML = "";
  timeBSelect.innerHTML = "";

  times.forEach((time) => {
    const optA = document.createElement("option");
    optA.value = time.nome;
    optA.textContent = time.nome;
    timeASelect.appendChild(optA);

    const optB = document.createElement("option");
    optB.value = time.nome;
    optB.textContent = time.nome;
    timeBSelect.appendChild(optB);
  });

  timeASelect.addEventListener("change", validarSelecao);
  timeBSelect.addEventListener("change", validarSelecao);
}

function irParaSelecaoTimes() {
  // Oculta a seção de escolha de origem
  document.getElementById("escolhaOrigem").style.display = "none";

  // Verifica qual foi a opção escolhida (CAMP ou Reais)
  const origem = document.querySelector('input[name="origem"]:checked')?.value;

  // Carrega o JSON correspondente
  if (origem === "reais") {
    carregarJSON("timesreais.json");
  } else {
    carregarJSON("data.json");
  }

  // Exibe a próxima etapa
  document.getElementById("selecaoTimes").style.display = "block";
}

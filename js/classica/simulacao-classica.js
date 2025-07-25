function simularPartida() {
  const conteudo = document.getElementById("conteudo");
  conteudo.innerHTML = ""; // Limpa a área principal apenas

  const simulando = document.createElement("div");
  simulando.className = "section";
  simulando.innerHTML = `<h2>Simulando partida...</h2>`;

  conteudo.appendChild(simulando);

  setTimeout(() => {
    const resultado = calcularPontuacao();
    mostrarResultado(resultado);
  }, 5000);
}

function calcularPontuacao() {
  const resultado = {
    pontosA: 0,
    pontosB: 0,
    detalhes: [],
  };

  let campoNeutro = window.estadoCampoNeutro;

  if (campoNeutro) {
    resultado.pontosA += 1;
    resultado.pontosB += 1;
    resultado.detalhes.push("Campo neutro: 1 ponto para cada time");
  } else {
    resultado.pontosA += 1;
    resultado.detalhes.push("Fator casa: 1 ponto para Time A");
  }

  const vitoriasA = confrontos.filter(
    (c) => c.tipo === "jogador" && c.vencedor === "A"
  ).length;
  const vitoriasB = confrontos.filter(
    (c) => c.tipo === "jogador" && c.vencedor === "B"
  ).length;

  if (vitoriasA > vitoriasB) {
    resultado.pontosA += 1;
    resultado.detalhes.push("Mano a mano: vitória do Time A");
    if (vitoriasA >= 8) {
      resultado.pontosA += 0.5;
      resultado.detalhes.push("Mano a mano: +0.5 extra por ampla vitória");
    }
  } else if (vitoriasB > vitoriasA) {
    resultado.pontosB += 1;
    resultado.detalhes.push("Mano a mano: vitória do Time B");
    if (vitoriasB >= 8) {
      resultado.pontosB += 0.5;
      resultado.detalhes.push("Mano a mano: +0.5 extra por ampla vitória");
    }
  } else {
    resultado.pontosA += 0.5;
    resultado.pontosB += 0.5;
    resultado.detalhes.push("Mano a mano: empate");
  }

  const treinador = confrontos.find((c) => c.tipo === "treinador");
  if (treinador?.vencedor === "A") {
    resultado.pontosA += 1;
    resultado.detalhes.push("Treinador: vitória do Time A");
  } else if (treinador?.vencedor === "B") {
    resultado.pontosB += 1;
    resultado.detalhes.push("Treinador: vitória do Time B");
  } else {
    resultado.pontosA += 0.5;
    resultado.pontosB += 0.5;
    resultado.detalhes.push("Treinador: empate");
  }

  const sorteio = Math.ceil(Math.random() * 3);
  if (sorteio === 1) {
    resultado.pontosA += 1;
    resultado.detalhes.push("Aleatório: ponto para Time A");
  } else if (sorteio === 2) {
    resultado.pontosB += 1;
    resultado.detalhes.push("Aleatório: ponto para Time B");
  } else {
    resultado.pontosA += 0.5;
    resultado.pontosB += 0.5;
    resultado.detalhes.push("Aleatório: 0.5 ponto para cada");
  }

  return resultado;
}

function mostrarResultado(resultado) {
  const diff = resultado.pontosA - resultado.pontosB;
  let placarA = 0;
  let placarB = 0;
  const faixa = Math.abs(diff);

  if (faixa === 0) {
    [placarA, placarB] = [
      [0, 0],
      [1, 1],
      [2, 2],
    ][Math.floor(Math.random() * 3)];
  } else if (faixa <= 0.5) {
    [placarA, placarB] = diff > 0 ? [1, 0] : [0, 1];
  } else if (faixa <= 1.5) {
    [placarA, placarB] =
      diff > 0
        ? [
            [1, 0],
            [2, 1],
            [2, 0],
          ][Math.floor(Math.random() * 3)]
        : [
            [0, 1],
            [1, 2],
            [0, 2],
          ][Math.floor(Math.random() * 3)];
  } else if (faixa <= 2.5) {
    [placarA, placarB] =
      diff > 0
        ? [
            [2, 0],
            [3, 1],
            [3, 0],
          ][Math.floor(Math.random() * 3)]
        : [
            [0, 2],
            [1, 3],
            [0, 3],
          ][Math.floor(Math.random() * 3)];
  } else {
    [placarA, placarB] =
      diff > 0
        ? [
            [4, 0],
            [5, 1],
            [5, 0],
            [6, 1],
          ][Math.floor(Math.random() * 4)]
        : [
            [0, 4],
            [1, 5],
            [0, 5],
            [1, 6],
          ][Math.floor(Math.random() * 4)];
  }

  const nomeA = timeSelecionadoA.nome;
  const nomeB = timeSelecionadoB.nome;

  const conteudo = document.getElementById("conteudo");
  conteudo.innerHTML = "";

  const artilheiros = [];
  const assistentes = [];

  [
    { t: "A", gols: placarA },
    { t: "B", gols: placarB },
  ].forEach(({ t, gols }) => {
    for (let i = 0; i < gols; i++) {
      const jogadores = escalações[t];
      const time = t === "A" ? timeSelecionadoA : timeSelecionadoB;

      // Filtra os jogadores, removendo goleiros
      const lista = jogadores
        .map((n) => time.jogadores.find((j) => j.nome === n))
        .filter((j) => j?.posicao?.toLowerCase() !== "goleiro");

      function sortearJogadorComPeso(lista) {
        const pesos = {
          atacante: 5,
          ponta: 4,
          meia: 3,
          lateral: 2,
          volante: 1,
          zagueiro: 1,
        };
        const pool = [];
        lista.forEach((j) => {
          const pos = j?.posicao?.toLowerCase() || "";
          const peso = pesos[pos] || 1;
          for (let i = 0; i < peso; i++) pool.push(j);
        });
        if (pool.length === 0) return lista[0];
        return pool[Math.floor(Math.random() * pool.length)];
      }

      const autor = sortearJogadorComPeso(lista);
      const assist = sortearJogadorComPeso(lista);

      artilheiros.push(`${autor?.nome || "Desconhecido"} (${t})`);
      assistentes.push(`${assist?.nome || "Desconhecido"} (${t})`);
    }
  });

  const tela = document.createElement("div");
  tela.className = "resultado-container";
  tela.innerHTML = `
    <h2>
      <img src="${
        timeSelecionadoA.logo
      }" width="30" style="vertical-align: middle;">
      ${nomeA} ${placarA} x ${placarB} ${nomeB}
      <img src="${
        timeSelecionadoB.logo
      }" width="30" style="vertical-align: middle;">
    </h2>
    <h3>Gols</h3>
    <ul>
      ${artilheiros.map((g) => `<li class="goleador">${g}</li>`).join("")}
    </ul>
    <h3>Assistências</h3>
    <ul>
      ${assistentes.map((a) => `<li>${a}</li>`).join("")}
    </ul>
  `;

  const btnDetalhes = document.createElement("button");
  btnDetalhes.textContent = "Ver Detalhes";
  btnDetalhes.onclick = () => {
    const modal = document.createElement("div");
    modal.style.position = "fixed";
    modal.style.top = "10%";
    modal.style.left = "20%";
    modal.style.width = "60%";
    modal.style.background = "white";
    modal.style.padding = "20px";
    modal.style.border = "2px solid black";
    modal.style.zIndex = 1000;
    modal.innerHTML = `
      <h3>Detalhes da Partida</h3>
      <p><strong>Placar Técnico:</strong> ${resultado.pontosA} x ${
      resultado.pontosB
    }</p>
      <ul>${resultado.detalhes.map((d) => `<li>${d}</li>`).join("")}</ul>
      <br>
      <button onclick='this.parentNode.remove()'>Fechar</button>
    `;
    document.body.appendChild(modal);
  };
  tela.appendChild(btnDetalhes);

  const voltarBtn = document.createElement("button");
  voltarBtn.textContent = "Voltar à Simulação Clássica";
  voltarBtn.onclick = () => {
    window.location.reload();
  };
  tela.appendChild(voltarBtn);

  conteudo.appendChild(tela);
}

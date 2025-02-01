    option.textContent = topic.rota;

    selectHorario.appendChild(option);
  });
}

const selectHorario = document.getElementById("listaHorarios");
const buscaRota = document.getElementById("buscaRota");
const main = document.querySelector(".main");
const resultado = document.querySelector(".resultado");
const map = document.getElementById("map");
const favoritarBtn = document.getElementById("favoritar");
const compartilharBtn = document.getElementById("compartilhar");

// Função para carregar as rotas no dropdown
function optionHorarios() {
  topics.forEach((topic) => {
    const option = document.createElement("option");
    option.value = topic.topic;
    option.textContent = topic.rota;
    selectHorario.appendChild(option);
  });
}

// Função para filtrar rotas no campo de busca
buscaRota.addEventListener("input", () => {
  const termo = buscaRota.value.toLowerCase();
  const options = selectHorario.options;

  for (let i = 0; i < options.length; i++) {
    const option = options[i];
    if (option.textContent.toLowerCase().includes(termo)) {
      option.style.display = "block";
    } else {
      option.style.display = "none";
    }
  }
});

// Função para exibir os horários
function pegaHorario(item) {
  if (item != 0) {
    main.classList.remove("hide");
    resultado.classList.remove("hide");
    map.classList.remove("hide");

    const topic = topics.find((t) => t.topic === item);
    document.getElementById("rota").textContent = topic.rota;
    document.getElementById("valor").textContent = `R$ ${topic.valor.toFixed(2)}`;

    // Exibir horários
    exibirHorarios(topic.segundaasexta, "saidaSemana", "chegadaSemana");
    exibirHorarios(topic.sabado, "saidaSabado", "chegadaSabado");
    exibirHorarios(topic.domingo, "saidaDomingo", "chegadaDomingo");

    // Inicializar mapa
    initMap(topic.rota);

    // Atualizar botão de favoritar
    atualizarBotaoFavoritar(topic.topic);
  } else {
    main.classList.add("hide");
  }
}

// Função para exibir horários
function exibirHorarios(horarios, saidaId, chegadaId) {
  const saida = document.getElementById(saidaId);
  const chegada = document.getElementById(chegadaId);
  saida.innerHTML = "";
  chegada.innerHTML = "";

  if (horarios.saida.length > 0) {
    document.querySelector(`.${saidaId.split("Semana")[0]}`).classList.remove("hide");
    horarios.saida.forEach((hora) => {
      const li = document.createElement("li");
      li.className = "saida-dia";
      li.textContent = hora;
      saida.appendChild(li);
    });
  } else {
    document.querySelector(`.${saidaId.split("Semana")[0]}`).classList.add("hide");
  }

  if (horarios.chegada.length > 0) {
    horarios.chegada.forEach((hora) => {
      const li = document.createElement("li");
      li.className = "chegada-dia";
      li.textContent = hora;
      chegada.appendChild(li);
    });
  }
}

// Função para inicializar o mapa
function initMap(rota) {
  const map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -3.1277, lng: -40.8467 }, // Coordenadas de Camocim
    zoom: 12,
  });

  new google.maps.Marker({
    position: { lat: -3.1277, lng: -40.8467 },
    map,
    title: rota,
  });
}

// Modo escuro
document.getElementById("toggleModo").addEventListener("click", () => {
  document.body.classList.toggle("modo-escuro");
  localStorage.setItem("modoEscuro", document.body.classList.contains("modo-escuro"));
});

// Verificar modo escuro ao carregar a página
if (localStorage.getItem("modoEscuro") === "true") {
  document.body.classList.add("modo-escuro");
}

// Favoritar rota
favoritarBtn.addEventListener("click", () => {
  const rotaId = parseInt(selectHorario.value);
  if (rotaId !== 0) {
    const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
    if (!favoritos.includes(rotaId)) {
      favoritos.push(rotaId);
      localStorage.setItem("favoritos", JSON.stringify(favoritos));
      favoritarBtn.innerHTML = '<i class="fas fa-star"></i> Favoritado';
      alert("Rota favoritada com sucesso!");
    } else {
      alert("Esta rota já está favoritada.");
    }
  } else {
    alert("Selecione uma rota válida para favoritar.");
  }
});

// Atualizar botão de favoritar
function atualizarBotaoFavoritar(rotaId) {
  const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
  if (favoritos.includes(rotaId)) {
    favoritarBtn.innerHTML = '<i class="fas fa-star"></i> Favoritado';
  } else {
    favoritarBtn.innerHTML = '<i class="fas fa-star"></i> Favoritar';
  }
}

// Compartilhar rota
compartilharBtn.addEventListener("click", () => {
  const rota = document.getElementById("rota").textContent;
  const texto = `Confira os horários da rota: ${rota}`;
  const link = encodeURIComponent(window.location.href);
  window.open(`https://wa.me/?text=${texto}%20${link}`, "_blank");
});

// Notificações de horários
function configurarNotificacoes(horarios) {
  horarios.saida.forEach((hora) => {
    const agora = new Date();
    const [horaSaida, minutoSaida] = hora.split(":");
    const horarioNotificacao = new Date(
      agora.getFullYear(),
      agora.getMonth(),
      agora.getDate(),
      horaSaida,
      minutoSaida,
      0
    );

    const tempoParaNotificacao = horarioNotificacao - agora;

    if (tempoParaNotificacao > 0) {
      setTimeout(() => {
        alert(`🚌 Horário de saída: ${hora}`);
      }, tempoParaNotificacao);
    }
  });
}

// Carregar notificações ao selecionar uma rota
selectHorario.addEventListener("change", () => {
  const rotaId = parseInt(selectHorario.value);
  if (rotaId !== 0) {
    const topic = topics.find((t) => t.topic === rotaId);
    configurarNotificacoes(topic.segundaasexta);
  }
});

// Inicializar
optionHorarios();
selectHorario.addEventListener("change", () => {
  pegaHorario(parseInt(selectHorario.value));
});

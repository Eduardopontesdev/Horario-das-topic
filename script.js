const topics = [
  {
    // Granja a Camocim
    topic: 1,
    rota: "Granja - Camocim",
    saidarota: "Granja",
    chegadarota: "Camocim",
    segundaasexta: {
      saida: [
        "05:45", "06:00", "06:20", "06:40", "07:00", "07:20", "07:40", "08:00", "08:20", "08:40",
        "09:00", "09:20", "09:40", "10:00", "10:20", "10:40", "11:00", "11:20", "11:40", "12:00",
        "12:25", "12:50", "13:15", "13:40", "14:05", "14:30", "14:55", "15:20", "15:45", "16:10",
        "16:35", "17:00", "17:25", "18:00",
      ],
      chegada: [
        "06:25", "06:40", "07:00", "07:20", "07:40", "08:00", "08:20", "08:40", "09:00", "09:20",
        "09:40", "10:00", "10:20", "10:40", "11:00", "11:20", "11:40", "12:00", "12:20", "12:40",
        "13:05", "13:30", "13:55", "14:20", "14:45", "15:10", "15:35", "16:00", "16:25", "16:50",
        "17:15", "17:40", "18:05", "18:40",
      ],
    },
    sabado: {
      saidarota: "Granja",
      chegadarota: "Camocim",
      saida: [],
      chegada: [],
    },
    valor: 7.25,
    domingo: {
      saidarota: "Granja",
      chegadarota: "Camocim",
      saida: [],
      chegada: [],
    },
    rotaadicional: {
      cidade1: { nome: "", passada: [], sabado: { passada: [] }, domingo: { passada: [] } },
      cidade2: { nome: "", passada: [], sabado: { passada: [] }, domingo: { passada: [] } },
      cidade3: { nome: "", passada: [], sabado: { passada: [] }, domingo: { passada: [] } },
      cidade4: { nome: "", passada: [], sabado: { passada: [] }, domingo: { passada: [] } },
    },
  },
  // Camocim a Granja
  {
    topic: 2,
    rota: "Camocim - Granja",
    saidarota: "Camocim",
    chegadarota: "Granja",
    segundaasexta: {
      saida: [
        "06:30", "06:45", "07:05", "07:25", "07:45", "08:05", "08:25", "08:45", "09:05", "09:25",
        "09:45", "10:05", "10:25", "10:45", "11:05", "11:25", "11:45", "12:05", "12:25", "12:45",
        "13:10", "13:35", "14:00", "14:25", "14:50", "15:15", "15:40", "16:05", "16:30", "16:55",
        "17:20", "17:45", "18:10", "18:45",
      ],
      chegada: [
        "07:10", "07:25", "07:45", "08:05", "08:25", "08:45", "09:05", "09:25", "09:45", "10:05",
        "10:25", "10:45", "11:05", "11:25", "11:45", "12:05", "12:25", "12:45", "13:05", "13:25",
        "13:50", "14:15", "14:40", "15:05", "15:30", "15:55", "16:20", "16:45", "17:10", "17:35",
        "18:00", "18:25", "18:50", "19:25",
      ],
    },
    sabado: {
      saidarota: "Camocim",
      chegadarota: "Granja",
      saida: [],
      chegada: [],
    },
    valor: 7.25,
    domingo: {
      saidarota: "Camocim",
      chegadarota: "Granja",
      saida: [],
      chegada: [],
    },
    rotaadicional: {
      cidade1: { nome: "", passada: [], sabado: { passada: [] }, domingo: { passada: [] } },
      cidade2: { nome: "", passada: [], sabado: { passada: [] }, domingo: { passada: [] } },
      cidade3: { nome: "", passada: [], sabado: { passada: [] }, domingo: { passada: [] } },
      cidade4: { nome: "", passada: [], sabado: { passada: [] }, domingo: { passada: [] } },
    },
  },
  // ... (insira os demais objetos do array topics aqui)
];

const selectHorario = document.getElementById("listaHorarios");

// Função para carregar as rotas no dropdown
function optionHorarios() {
  // Limpa o select antes de preencher
  selectHorario.innerHTML = '<option value="0">👉 Escolha o horário da topic 👈</option>';

  // Preenche o select com as rotas
  topics.forEach((topic) => {
    const option = document.createElement("option");
    option.value = topic.topic; // Usa o número da rota como valor
    option.textContent = topic.rota; // Usa o nome da rota como texto
    selectHorario.appendChild(option);
  });
}

// Função para exibir os horários
function pegaHorario(item) {
  const main = document.querySelector(".main");
  const resultado = document.querySelector(".resultado");

  if (item != 0) {
    main.classList.remove("hide");
    resultado.classList.remove("hide");

    const topic = topics.find((t) => t.topic === item);
    if (topic) {
      document.getElementById("rota").textContent = topic.rota;
      document.getElementById("valor").textContent = `R$ ${topic.valor.toFixed(2)}`;

      // Exibir horários
      exibirHorarios(topic.segundaasexta, "saidaSemana", "chegadaSemana");
      exibirHorarios(topic.sabado, "saidaSabado", "chegadaSabado");
      exibirHorarios(topic.domingo, "saidaDomingo", "chegadaDomingo");
    }
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

// Evento para carregar os horários ao selecionar uma rota
selectHorario.addEventListener("change", () => {
  const item = parseInt(selectHorario.value);
  pegaHorario(item);
});

// Inicializar o select ao carregar a página
window.addEventListener("load", () => {
  optionHorarios(); // Preenche o select com as rotas
});

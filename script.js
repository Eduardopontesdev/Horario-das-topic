document.addEventListener('DOMContentLoaded', function () {
  const homeLink = document.getElementById('home-link');
  const cadastroLink = document.getElementById('cadastro-link');
  const listagemSection = document.getElementById('listagem');
  const cadastroSection = document.getElementById('cadastro');
  const contactList = document.getElementById('contact-list');
  const searchInput = document.getElementById('search');
  const mensagemSucesso = document.getElementById('mensagem-sucesso');
  const categoriaSelect = document.getElementById('categoria');
  const categoriaFiltro = document.getElementById('categoria-filtro');
  const paginacao = document.getElementById('paginacao');
  const premiumLink = document.getElementById('premium-link');
  const premiumSection = document.getElementById('premium');

  let contacts = [];
  let categorias = [];
  const contatosPorPagina = 8;
  let paginaAtual = 1;

  const apiUrl = 'https://guia-api.vercel.app/contatos';
  const categoriasUrl = 'https://guia-api.vercel.app/categorias';
  const meuWhatsapp = "88996328842";

  // Array de categorias para o cadastro de novos contatos
  const categoriasCadastro = [
    "Sem Categoria",
    "Saúde",
    "Farmacia",
    "Emergência",
    "Serviços Públicos",
    "Restaurantes",
    "Educação",
    "Transporte",
    "Lazer",
    "Corretor de Imoveis",
    "Compras",
    "Turismo",
    "Tecnologia",
    "Desenvolvedor",
    "Informatica",
    "Assitencia de Celulares",
    "Finanças",
    "Alimentação",
    "Moda",
    "Beleza",
    "Esportes",
    "Automóveis",
    "Casa e Jardim",
    "Pet Shop",
    "Entretenimento",
    "Serviços Profissionais",
    "Pintor",
    "Pedreiro",
    "Eletricista",
    "Servente",
    "Loja",
    "Barraca",
    "Moto-taxi",
    "Taxi",
    "Motorista de Aplicativo",
    "Podador de Arvóre",
    "Frete",
    "Bolo",
    "Bolo confeitado",
    "Bolos e Salgados",
    "Salgados",
    "Frete",
    "Outros"
  ];

  // Função para buscar contatos da API
  async function fetchContacts() {
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      contacts = data;
      renderContacts(contacts);
    } catch (error) {
      console.error('Erro ao buscar contatos:', error);
    }
  }

  // Função para buscar categorias da API (para o filtro de pesquisa)
  async function fetchCategorias() {
    try {
      const response = await fetch(categoriasUrl);
      const data = await response.json();
      categorias = data;
      renderCategoriasFiltro();
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
    }
  }

  // Função para renderizar categorias no select do filtro de pesquisa (vindas do banco de dados)
  function renderCategoriasFiltro() {
    const options = categorias.map((cat) => `<option value="${cat}">${cat}</option>`).join('');
    categoriaFiltro.innerHTML = `<option value="Todas">Todas</option>${options}`;
  }

  // Função para renderizar categorias no select do cadastro (vindas da array)
  function renderCategoriasCadastro() {
    const options = categoriasCadastro.map(cat => `<option value="${cat}">${cat}</option>`).join('');
    categoriaSelect.innerHTML = options;
  }

  // Função para alternar entre as seções
  homeLink.addEventListener('click', function (e) {
    e.preventDefault();
    showSection(listagemSection);
    renderContacts(contacts);
    premiumSection.classList.add('hidden');
  });

  cadastroLink.addEventListener('click', function (e) {
    e.preventDefault();
    showSection(cadastroSection);
    premiumSection.classList.add('hidden');
  });

  // Função para exibir uma seção e ocultar as outras
  function showSection(section) {
    listagemSection.classList.add('hidden');
    cadastroSection.classList.add('hidden');
    premiumSection.classList.add('hidden');
    section.classList.remove('hidden');
  }

  // Função para renderizar contatos na listagem com paginação
  function renderContacts(contacts) {
    const categoriaSelecionada = categoriaFiltro.value;
    const contatosFiltrados = categoriaSelecionada === "Todas"
      ? contacts
      : contacts.filter(contact => contact.categoria === categoriaSelecionada);

    const inicio = (paginaAtual - 1) * contatosPorPagina;
    const fim = inicio + contatosPorPagina;
    const contatosPagina = contatosFiltrados.slice(inicio, fim);

    contactList.innerHTML = '';
    contatosPagina.forEach(contact => {
      const contactCard = document.createElement('div');
      contactCard.classList.add('contact-card');
      if (contact.premium && new Date(contact.premiumUntil) > new Date()) {
        contactCard.classList.add('premium');
      }

      // Renderização das redes sociais (sempre visível)
      const redesSociaisHTML = `
        <div class="redes-sociais-icons">
          ${contact.redesSociais.facebook ? `<a href="${contact.redesSociais.facebook}" target="_blank"><i class="fab fa-facebook" style="color: #1877f2;"></i></a>` : ''}
          ${contact.redesSociais.instagram ? `<a href="${contact.redesSociais.instagram}" target="_blank"><i class="fab fa-instagram" style="color: #e4405f;"></i></a>` : ''}
          ${contact.redesSociais.whatsapp ? `<a href="https://wa.me/${contact.redesSociais.whatsapp}" target="_blank"><i class="fab fa-whatsapp" style="color: #25d366;"></i></a>` : ''}
        </div>
      `;

      // Renderização do conteúdo do card
      contactCard.innerHTML = `
        <div class="categoria">${contact.categoria}</div>
        <h3>${contact.nome}</h3>
        <p>Telefone: ${contact.telefone}</p>
        ${redesSociaisHTML}
        ${contact.premium && new Date(contact.premiumUntil) > new Date()
          ? ` <p>⭐ Premium até: ${new Date(contact.premiumUntil).toLocaleDateString()}</p>`
          : ''}
      
        <button class="whatsapp-share" onclick="shareOnWhatsApp('${contact.telefone}', '${contact.nome}')">
          <i class="fab fa-whatsapp"></i> Compartilhar
        </button>
        ${!contact.premium || new Date(contact.premiumUntil) <= new Date()
          ? `<span class="premium-icon" onclick="goToPremium('${contact.id}', '${contact.nome}', '${contact.telefone}')">Se tornar Premium?</span>`
          : ''}
      `;
      contactList.appendChild(contactCard);
    });

    renderPaginacao(contatosFiltrados.length);
  }

  // Função para renderizar botões de paginação
  function renderPaginacao(totalContatos) {
    const totalPaginas = Math.ceil(totalContatos / contatosPorPagina);
    paginacao.innerHTML = '';

    for (let i = 1; i <= totalPaginas; i++) {
      const botao = document.createElement('button');
      botao.textContent = i;
      botao.classList.add('pagina');
      if (i === paginaAtual) {
        botao.classList.add('active');
      }
      botao.addEventListener('click', () => {
        paginaAtual = i;
        renderContacts(contacts);
      });
      paginacao.appendChild(botao);
    }
  }

  // Função para compartilhar um contato no WhatsApp
  window.shareOnWhatsApp = function (telefone, nome) {
    const mensagem = `Contato: ${nome}\nTelefone: ${telefone}`;
    const url = `https://wa.me/?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
  };

  // Função para filtrar contatos por categoria
  categoriaFiltro.addEventListener('change', function () {
    paginaAtual = 1;
    renderContacts(contacts);
  });

  // Função para verificar se o contato já existe na mesma categoria
  function contatoExisteNaCategoria(nome, telefone, categoria) {
    return contacts.some(contact =>
      contact.nome.toLowerCase() === nome.toLowerCase() &&
      contact.telefone === telefone &&
      contact.categoria === categoria
    );
  }

  // Variável para armazenar o tempo do último cadastro
  let ultimoCadastroTempo = 0;
  const tempoMinimoEntreCadastros = 10000; // 10 segundos

  // Função para verificar se o tempo mínimo entre cadastros foi respeitado
  function podeCadastrar() {
    const agora = Date.now();
    return agora - ultimoCadastroTempo >= tempoMinimoEntreCadastros;
  }

  // Função para cadastrar um novo contato
  document.getElementById('cadastro-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const nome = document.getElementById('nome').value;
    const telefone = document.getElementById('telefone').value;
    const categoria = document.getElementById('categoria').value;
    const facebook = document.getElementById('facebook').value;
    const instagram = document.getElementById('instagram').value;
    const whatsapp = document.getElementById('whatsapp').value;

    if (!validatePhone(telefone)) {
      alert("Por favor, insira um número de telefone válido.");
      return;
    }

    if (!podeCadastrar()) {
      alert("Por favor, aguarde 10 segundos antes de cadastrar outro contato.");
      return;
    }

    if (contatoExisteNaCategoria(nome, telefone, categoria)) {
      alert("Um contato com os mesmos dados já existe nesta categoria.");
      return;
    }

    const newContact = {
      nome,
      telefone,
      categoria,
      redesSociais: {
        facebook,
        instagram,
        whatsapp,
      },
      premium: false,
      premiumUntil: null,
    };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newContact),
      });
      if (response.ok) {
        ultimoCadastroTempo = Date.now(); // Atualiza o tempo do último cadastro
        await fetchContacts();
        document.getElementById('cadastro-form').reset();
        mensagemSucesso.classList.remove('hidden');
        setTimeout(() => {
          mensagemSucesso.classList.add('hidden');
        }, 3000);
      }
    } catch (error) {
      console.error('Erro ao cadastrar contato:', error);
    }
  });

  // Função para validar o telefone
  function validatePhone(telefone) {
    const regex = /^\(?\d{2}\)?[\s-]?\d{4,5}-?\d{4}$/;
    return regex.test(telefone);
  }

  // Função para filtrar contatos na pesquisa
  searchInput.addEventListener('input', function () {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredContacts = contacts.filter(contact =>
      contact.nome.toLowerCase().includes(searchTerm) ||
      contact.telefone.includes(searchTerm) ||
      contact.categoria.toLowerCase().includes(searchTerm)
    );
    paginaAtual = 1;
    renderContacts(filteredContacts);
  });

  // Adicionar evento para a seção premium
  premiumLink.addEventListener('click', function (e) {
    e.preventDefault();
    showSection(premiumSection);
  });

  // Função para redirecionar para a seção premium com os dados do contato
  window.goToPremium = function (id, nome, telefone) {
    showSection(premiumSection);
    document.getElementById('premium-contact-id').value = id;
    document.getElementById('premium-contact-name').value = nome;
    document.getElementById('premium-contact-phone').value = telefone;
  };

  // Função para comprar premium
  document.getElementById('comprar-premium').addEventListener('click', function () {
    const id = document.getElementById('premium-contact-id').value;
    const nome = document.getElementById('premium-contact-name').value;
    const telefone = document.getElementById('premium-contact-phone').value;

    const mensagem = `Olá, gostaria de tornar o contato ${nome} (${telefone}) premium.`;
    const url = `https://wa.me/${meuWhatsapp}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
  });

  // Renderizar categorias no select do cadastro ao carregar a página
  renderCategoriasCadastro();
  // Buscar categorias do banco de dados para o filtro de pesquisa
  fetchCategorias();
  // Buscar contatos da API ao carregar a página
  fetchContacts();
});
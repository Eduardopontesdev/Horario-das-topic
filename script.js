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
  const meuWhatsapp = "+5588996328842";

  // Array de categorias para o cadastro de novos contatos
  const categoriasCadastro = [
    "Sem Categoria",
"Alimentação",
"Academia",
"Açougue",
"Artesenato",
"Arquiteto",
"Artigos Esportivos",
"Assitencia de Celulares",
"Automóveis",
"Barraca",
"Barbeiro",
"Beleza",
"Berçario",
"Bolo",
"Bolo confeitado",
"Bolo Confeitado Doces Kits",
"Bolos e Salgados",
"Box",
"Casa e Jardim",
"Camarão",
"Cantor(a)",
"Cabeleleiro",
"Cartorio",
"Clinica",
"Compras",
"Confeitaria",
"Corretor de Imoveis",
"Delivery",
"Desenvolvedor",
"Desenvolvedor Criação de Sites",
"Deposito de Bebidas",
"Dentista",
"Educação",
"Eletricista",
"Escola",
"Emergência",
"Emprestimo",
"Entretenimento",
"Esportes",
"Escola",
"Farmácia",
"Finanças",
"Frete",
"Frios",
"Frigorifico",
"Frutaria",
"Hotel - Pousada",
"Dormitorio",
"Condominio",
"Colegio",
"Informatica",
"Lazer",
"Loja",
"Loja de Acessórios",
"Loja de Artesenato",
"Loja de Importados",
"Loja de Construção",
"Loja Acessórios Frontais Baterias",
"Moda",
"Madereira",
"Montador de Móveis",
"Motorista de Aplicativo",
"Moto-taxi",
"Moto-boy",
"Moto Peças",
"Outros",
"Oficina de Carros",
"Oficina de Motos",
"Ótica",
"Papelaria - Informatica",
"Papelaria",
"Pastelaria",
"Padaria",
"Padaria Panificadora Confeitaria",
"Pedreiro",
"Peixaria",
"Pet Shop",
"Peixes Ornamentais",
"Peixes Camarão",
"Peixes Rações Aquarios",
"Pintor",
"Pizzaria",
"Pizzaria - Pastelaria",
"Podador de Arvóre",
"Restaurantes",
"Salgados",
"Salão de Beleza",
"Saúde",
"Servente",
"Serviço",
"Serviço de Cartorio",
"Serraria",
"Serviços Públicos",
"Serviços de Entrega",
"Serviços Profissionais",
"Soldagens",
"Soldador",
"Sushi",
"Supermercado",
"Supermercado Frigorifico",
"Supermercado Frigorifico Padaria",
"Taxi",
"Tecnologia",
"Transporte",
"Turismo",
"Vendedor de Agua",
"Vendedor de Peixe",
"Vendedor de Camarão",
"Vendedor de Carangueijo",
"Vendedor de Sururu",
"Vendas Online"
    
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

  // Função para ordenar contatos, priorizando os Premium
  function sortContacts(contacts) {
    return contacts.sort((a, b) => {
      const aIsPremium = a.premium && new Date(a.premiumUntil) > new Date();
      const bIsPremium = b.premium && new Date(b.premiumUntil) > new Date();

      if (aIsPremium && !bIsPremium) return -1;
      if (!aIsPremium && bIsPremium) return 1;
      return 0;
    });
  }

  // Função para renderizar contatos na listagem com paginação
  function renderContacts(contacts) {
    const categoriaSelecionada = categoriaFiltro.value;
    const contatosFiltrados = categoriaSelecionada === "Todas"
      ? contacts
      : contacts.filter(contact => contact.categoria === categoriaSelecionada);

    // Ordena os contatos, priorizando os Premium
    const contatosOrdenados = sortContacts(contatosFiltrados);

    const inicio = (paginaAtual - 1) * contatosPorPagina;
    const fim = inicio + contatosPorPagina;
    const contatosPagina = contatosOrdenados.slice(inicio, fim);

    // Atualiza o contador de contatos
  document.getElementById('total-contatos').textContent = contatosFiltrados.length;

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
          ${contact.redesSociais.site ? `<a href="${contact.redesSociais.site}" target="_blank"><i class="fas fa-globe" style="color: #000;"></i></a>` : ''}
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
      botao.classList.add('botao');
      botao.textContent = i;
      botao.classList.add('pagina');
      if (i === paginaAtual) {
        
        botao.classList.add('ativado');
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
    const mais = "Encontrei esse contato no *Guia Camocim*"
    const mensagem = `Contato: ${nome}\nTelefone: ${telefone}\n${mais}`;
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
    let telefone = document.getElementById('telefone').value;
    const categoria = document.getElementById('categoria').value;
    const facebook = document.getElementById('facebook').value;
    const instagram = document.getElementById('instagram').value;
    const whatsapp = document.getElementById('whatsapp').value;
    const site = document.getElementById('site').value;

    // Adiciona +55 ao número de telefone se não estiver presente
    if (!telefone.startsWith('+55')) {
      telefone = `+55${telefone.replace(/\D/g, '')}`;
    }

    if (!validatePhone(telefone)) {
      alert("Por favor, insira um número de telefone válido.");
      return;
    }

    if (!validateFacebook(facebook)) {
      alert("Por favor, insira um link do Facebook válido (ex: https://www.facebook.com/NOMEDOUSUARIO).");
      return;
    }

    if (!validateInstagram(instagram)) {
      alert("Por favor, insira um link do Instagram válido (ex: https://www.instagram.com/NOMEDOUSUARIO).");
      return;
    }

    if (!validateWhatsApp(whatsapp)) {
      alert("Por favor, insira um número de WhatsApp válido (ex: 11999999999).");
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
        whatsapp: whatsapp ? `+55${whatsapp.replace(/\D/g, '')}` : '',
        site
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
    const regex = /^\+55\d{10,11}$/;
    return regex.test(telefone);
  }

  // Função para validar o link do Facebook
  function validateFacebook(facebook) {
    if (!facebook) return true; // Se o campo estiver vazio, não há problema
    const regex = /^https:\/\/www\.facebook\.com\/[a-zA-Z0-9.]+$/;
    return regex.test(facebook);
  }

  // Função para validar o link do Instagram
  function validateInstagram(instagram) {
    if (!instagram) return true; // Se o campo estiver vazio, não há problema
    const regex = /^https:\/\/www\.instagram\.com\/[a-zA-Z0-9._]+\/?$/;
    return regex.test(instagram);
  }

  // Função para validar o número do WhatsApp
  function validateWhatsApp(whatsapp) {
    if (!whatsapp) return true; // Se o campo estiver vazio, não há problema
    const regex = /^\d{10,11}$/;
    return regex.test(whatsapp);
  }
// Função para remover acentos
function removerAcentos(texto) {
  return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
}

// Função para filtrar contatos na pesquisa
searchInput.addEventListener('input', function () {
  const searchTerm = removerAcentos(searchInput.value.toLowerCase());
  const filteredContacts = contacts.filter(contact => {
    const nomeNormalizado = removerAcentos(contact.nome.toLowerCase());
    const telefoneNormalizado = contact.telefone; // Telefone geralmente não tem acentos
    const categoriaNormalizada = removerAcentos(contact.categoria.toLowerCase());

    return nomeNormalizado.includes(searchTerm) ||
           telefoneNormalizado.includes(searchTerm) ||
           categoriaNormalizada.includes(searchTerm);
  });
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
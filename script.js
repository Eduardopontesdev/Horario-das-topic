document.addEventListener('DOMContentLoaded', function () {
  const homeLink = document.getElementById('home-link');
  const cadastroLink = document.getElementById('cadastro-link');
  const adminLink = document.getElementById('admin-link');
  const listagemSection = document.getElementById('listagem');
  const cadastroSection = document.getElementById('cadastro');
  const administracaoSection = document.getElementById('administracao');
  const editarContatosSection = document.getElementById('editar-contatos-section');
  const gerenciarCategoriasSection = document.getElementById('gerenciar-categorias-section');
  const adminContactList = document.getElementById('admin-contact-list');
  const categoriasList = document.getElementById('categorias-list');
  const categoriaForm = document.getElementById('categoria-form');
  const novaCategoriaInput = document.getElementById('nova-categoria');
  const cadastroForm = document.getElementById('cadastro-form');
  const contactList = document.getElementById('contact-list');
  const searchInput = document.getElementById('search');
  const mensagemSucesso = document.getElementById('mensagem-sucesso');
  const categoriaSelect = document.getElementById('categoria');
  const categoriaFiltro = document.getElementById('categoria-filtro');
  const exportarContatosButton = document.getElementById('exportar-contatos');
  const paginacao = document.getElementById('paginacao');

// Adicione no início do arquivo, junto com as outras constantes
const premiumLink = document.getElementById('premium-link');
const premiumSection = document.getElementById('premium');



  
  const contatosCamocim = [
    // ... (seus contatos aqui)
  ];

  let contacts = JSON.parse(localStorage.getItem('contacts')) || contatosCamocim;
  let categorias = JSON.parse(localStorage.getItem('categorias')) || ["Saúde", "Emergência", "Serviços Públicos", "Restaurantes"];
  const contatosPorPagina = 6; // Contatos por página
  let paginaAtual = 1; // Página atual

  // Função para salvar dados no localStorage
  function saveData() {
    localStorage.setItem('contacts', JSON.stringify(contacts));
    localStorage.setItem('categorias', JSON.stringify(categorias));
  }

  // Função para renderizar categorias no select
  function renderCategoriasSelect() {
    const options = categorias.map(cat => `<option value="${cat}">${cat}</option>`).join('');
    categoriaSelect.innerHTML = options;
    categoriaFiltro.innerHTML = `<option value="Todas">Todas</option>${options}`;
  }

  // Função para alternar entre as seções
  homeLink.addEventListener('click', function (e) {
    e.preventDefault();
    showSection(listagemSection);
    renderContacts(contacts);
  });

  cadastroLink.addEventListener('click', function (e) {
    e.preventDefault();
    showSection(cadastroSection);
  });

  adminLink.addEventListener('click', function (e) {
    e.preventDefault();
    showSection(administracaoSection);
  });

  document.getElementById('editar-contatos').addEventListener('click', function () {
    editarContatosSection.classList.remove('hidden');
    gerenciarCategoriasSection.classList.add('hidden');
    renderAdminContacts();
  });

  document.getElementById('gerenciar-categorias').addEventListener('click', function () {
    gerenciarCategoriasSection.classList.remove('hidden');
    editarContatosSection.classList.add('hidden');
    renderCategorias();
  });

  // Função para exibir uma seção e ocultar as outras
  function showSection(section) {
    listagemSection.classList.add('hidden');
    cadastroSection.classList.add('hidden');
    administracaoSection.classList.add('hidden');
    section.classList.remove('hidden');
  }

  // Função para renderizar contatos na administração
  function renderAdminContacts() {
    adminContactList.innerHTML = '';
    contacts.forEach((contact, index) => {
      const contactCard = document.createElement('div');
      contactCard.classList.add('contact-card');
      if (contact.premium) contactCard.classList.add('premium');

      contactCard.innerHTML = `
        <h3>${contact.nome}</h3>
        <p>Telefone: ${contact.telefone}</p>
        <p>Categoria: ${contact.categoria}</p>
        <button onclick="editContact(${index})">Editar</button>
        <button onclick="deleteContact(${index})">Excluir</button>
        ${contact.premium ? `<p>Premium até: ${new Date(contact.premiumUntil).toLocaleDateString()}</p>` : ''}
      `;
      adminContactList.appendChild(contactCard);
    });
  }

  // Função para editar um contato
  window.editContact = function (index) {
    const contact = contacts[index];
    const novoNome = prompt("Editar nome:", contact.nome);
    const novoTelefone = prompt("Editar telefone:", contact.telefone);
    const novaCategoria = prompt("Editar categoria:", contact.categoria);
    const isPremium = confirm("Tornar este contato premium?");
    let premiumUntil = null;

    if (isPremium) {
      const diasPremium = parseInt(prompt("Quantos dias de premium?"));
      if (!isNaN(diasPremium) && diasPremium > 0) {
        premiumUntil = new Date();
        premiumUntil.setDate(premiumUntil.getDate() + diasPremium);
      }
    }

    if (novoNome && novoTelefone && novaCategoria) {
      contacts[index] = {
        ...contact,
        nome: novoNome,
        telefone: novoTelefone,
        categoria: novaCategoria,
        premium: isPremium,
        premiumUntil: premiumUntil,
      };
      saveData();
      renderAdminContacts();
      renderContacts(contacts);
    }
  };

  // Função para excluir um contato
  window.deleteContact = function (index) {
    if (confirm("Tem certeza que deseja excluir este contato?")) {
      contacts.splice(index, 1);
      saveData();
      renderAdminContacts();
      renderContacts(contacts);
    }
  };

  // Função para adicionar uma nova categoria
  categoriaForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const novaCategoria = novaCategoriaInput.value.trim();
    if (novaCategoria && !categorias.includes(novaCategoria)) {
      categorias.push(novaCategoria);
      saveData();
      renderCategorias();
      renderCategoriasSelect();
      novaCategoriaInput.value = '';
    }
  });

  // Função para renderizar categorias
  function renderCategorias() {
    categoriasList.innerHTML = '';
    categorias.forEach((categoria, index) => {
      const li = document.createElement('li');
      li.textContent = categoria;
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Excluir';
      deleteButton.onclick = () => deleteCategoria(index);
      li.appendChild(deleteButton);
      categoriasList.appendChild(li);
    });
  }

  // Função para excluir uma categoria
  function deleteCategoria(index) {
    if (confirm("Tem certeza que deseja excluir esta categoria?")) {
      categorias.splice(index, 1);
      saveData();
      renderCategorias();
      renderCategoriasSelect();
    }
  }

  // Função para renderizar contatos na listagem com paginação
  function renderContacts(contacts) {
    const categoriaSelecionada = categoriaFiltro.value;
    const contatosFiltrados = categoriaSelecionada === "Todas"
      ? contacts
      : contacts.filter(contact => contact.categoria === categoriaSelecionada);

    // Calcular índices dos contatos da página atual
    const inicio = (paginaAtual - 1) * contatosPorPagina;
    const fim = inicio + contatosPorPagina;
    const contatosPagina = contatosFiltrados.slice(inicio, fim);

    // Renderizar contatos da página atual
    contactList.innerHTML = '';
    contatosPagina.forEach(contact => {
      const contactCard = document.createElement('div');
      contactCard.classList.add('contact-card');
      if (contact.premium && new Date(contact.premiumUntil) > new Date()) {
        contactCard.classList.add('premium');
      }

      const redesSociaisHTML = `
        <div class="redes-sociais-icons">
          ${contact.redesSociais.facebook ? `<a href="${contact.redesSociais.facebook}" target="_blank"><i class="fab fa-facebook" style="color: #1877f2;"></i></a>` : ''}
          ${contact.redesSociais.instagram ? `<a href="${contact.redesSociais.instagram}" target="_blank"><i class="fab fa-instagram" style="color: #e4405f;"></i></a>` : ''}
          ${contact.redesSociais.whatsapp ? `<a href="https://wa.me/${contact.redesSociais.whatsapp}" target="_blank"><i class="fab fa-whatsapp" style="color: #25d366;"></i></a>` : ''}
        </div>
      `;

      contactCard.innerHTML = `
        <div class="categoria">${contact.categoria}</div>
        <h3>${contact.nome}</h3>
        <p>Telefone: ${contact.telefone}</p>
        ${redesSociaisHTML}
        ${contact.premium && new Date(contact.premiumUntil) > new Date()
          ? `<p>⭐ Premium até: ${new Date(contact.premiumUntil).toLocaleDateString()}</p>`
          : ''}
        <button class="whatsapp-share" onclick="shareOnWhatsApp('${contact.telefone}', '${contact.nome}')">
          <i class="fab fa-whatsapp"></i> Compartilhar
        </button>
      `;
      contactList.appendChild(contactCard);
    });

    // Renderizar botões de paginação
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

  // Função para exportar contatos
  exportarContatosButton.addEventListener('click', function () {
    const contatosFormatados = contacts.map(contact => ({
      Nome: contact.nome,
      Telefone: contact.telefone,
      Categoria: contact.categoria,
      Premium: contact.premium ? `Até ${new Date(contact.premiumUntil).toLocaleDateString()}` : 'Não',
    }));

    const blob = new Blob([JSON.stringify(contatosFormatados, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'contatos.json';
    a.click();
    URL.revokeObjectURL(url);
  });

  // Função para filtrar contatos por categoria
  categoriaFiltro.addEventListener('change', function () {
    paginaAtual = 1; // Resetar para a primeira página ao filtrar
    renderContacts(contacts);
  });

  // Função para cadastrar um novo contato
  cadastroForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const nome = document.getElementById('nome').value;
    const telefone = document.getElementById('telefone').value;
    const categoria = document.getElementById('categoria').value;
    const facebook = document.getElementById('facebook').value;
    const instagram = document.getElementById('instagram').value;
    const whatsapp = document.getElementById('whatsapp').value;

    // Validação do telefone
    if (!validatePhone(telefone)) {
      alert("Por favor, insira um número de telefone válido.");
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

    contacts.push(newContact);
    saveData();
    renderContacts(contacts);
    cadastroForm.reset();
    mensagemSucesso.classList.remove('hidden');
    setTimeout(() => {
      mensagemSucesso.classList.add('hidden');
    }, 3000);
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
    paginaAtual = 1; // Resetar para a primeira página ao pesquisar
    renderContacts(filteredContacts);
  });

  // Renderizar categorias no select ao carregar a página
  renderCategoriasSelect();
  // Renderizar contatos ao carregar a página
  renderContacts(contacts);
});

// Adicione no evento DOMContentLoaded
premiumLink.addEventListener('click', function (e) {
  e.preventDefault();
  showSection(premiumSection);
});

// Adicione a função para simular a compra do Premium
document.getElementById('comprar-premium').addEventListener('click', function () {
  const nomeContato = prompt("Digite o nome do contato que deseja tornar Premium:");
  const contato = contacts.find(contact => contact.nome === nomeContato);

  if (contato) {
    const confirmacao = confirm(`Tornar "${contato.nome}" Premium por R$ 10,00?`);
    if (confirmacao) {
      const premiumUntil = new Date();
      premiumUntil.setDate(premiumUntil.getDate() + 30); // 30 dias de Premium
      contato.premium = true;
      contato.premiumUntil = premiumUntil;
      saveData();
      renderContacts(contacts);
      alert("Contato atualizado para Premium com sucesso!");
    }
  } else {
    alert("Contato não encontrado. Verifique o nome e tente novamente.");
  }
});

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
  const premiumLink = document.getElementById('premium-link');
  const premiumSection = document.getElementById('premium');

  const API_URL = 'http://localhost:3000/contatos'; // Substitua pela URL da sua API
  const contatosPorPagina = 8; // Contatos por página
  let paginaAtual = 1; // Página atual
  let contacts = []; // Lista de contatos carregada da API

  // Função para buscar contatos da API
  async function fetchContacts() {
    try {
      const response = await fetch(`${API_URL}/contacts`);
      if (!response.ok) throw new Error('Erro ao carregar contatos');
      contacts = await response.json();
      renderContacts(contacts);
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao carregar contatos. Tente novamente.');
    }
  }

  // Função para adicionar um contato via API
  async function addContact(newContact) {
    try {
      const response = await fetch(`${API_URL}/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newContact),
      });
      if (!response.ok) throw new Error('Erro ao adicionar contato');
      const data = await response.json();
      contacts.push(data); // Adiciona o novo contato à lista local
      renderContacts(contacts);
      mensagemSucesso.classList.remove('hidden');
      setTimeout(() => mensagemSucesso.classList.add('hidden'), 3000);
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao adicionar contato. Tente novamente.');
    }
  }

  // Função para atualizar um contato via API
  async function updateContact(id, updatedContact) {
    try {
      const response = await fetch(`${API_URL}/contacts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedContact),
      });
      if (!response.ok) throw new Error('Erro ao atualizar contato');
      const data = await response.json();
      const index = contacts.findIndex(contact => contact.id === id);
      if (index !== -1) contacts[index] = data; // Atualiza o contato na lista local
      renderContacts(contacts);
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao atualizar contato. Tente novamente.');
    }
  }

  // Função para excluir um contato via API
  async function deleteContact(id) {
    try {
      const response = await fetch(`${API_URL}/contacts/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Erro ao excluir contato');
      contacts = contacts.filter(contact => contact.id !== id); // Remove o contato da lista local
      renderContacts(contacts);
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao excluir contato. Tente novamente.');
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

    addContact(newContact); // Adiciona o contato via API
    cadastroForm.reset();
  });

  // Função para editar um contato
  window.editContact = async function (index) {
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
      const updatedContact = {
        ...contact,
        nome: novoNome,
        telefone: novoTelefone,
        categoria: novaCategoria,
        premium: isPremium,
        premiumUntil: premiumUntil,
      };
      await updateContact(contact.id, updatedContact); // Atualiza o contato via API
    }
  };

  // Função para excluir um contato
  window.deleteContact = async function (index) {
    if (confirm("Tem certeza que deseja excluir este contato?")) {
      const contact = contacts[index];
      await deleteContact(contact.id); // Exclui o contato via API
    }
  };

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

  // Carregar contatos ao iniciar
  fetchContacts();
});

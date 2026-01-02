let produtos = []; // Guarda a lista de objetos (produtos) que vem da API
let cart = [];     // Guarda os produtos adicionados ao carrinho pelo utilizador

const productsSection = document.getElementById("products"); // Onde os produtos serão desenhados
const cartSection = document.getElementById("cart");         // Onde o carrinho será desenhado
const totalElement = document.getElementById("total");       // Elemento para mostrar o preço total
const categorySelect = document.getElementById("categoryFilter"); // O Select das categorias
const searchBox = document.getElementById("searchBox");      // A caixa de texto para pesquisa
const sortSelect = document.getElementById("sortOrder");     // O Select para ordenar por preço

// Evento 'load': Garante que este código só corre quando a página estiver totalmente carregada
window.addEventListener("load", () => {
  
  // 1. Persistência de Dados (localStorage)
  // Tentamos recuperar o carrinho guardado numa sessão anterior
  const stored = localStorage.getItem("cart");
  if (stored) {
    // JSON.parse: Converte o Texto guardado no storage de volta para um Array
    cart = JSON.parse(stored);
    renderCart(); // Atualiza a visualização do carrinho com os dados recuperados
  }

  // 2. Pedidos à API (Dados frescos)
  fetchProducts();   // Vai buscar a lista de produtos
  fetchCategories(); // Vai buscar a lista de categorias

  // 3. Event Listeners (Programação Orientada a Eventos)
  // Configuramos as "escutas". Sempre que o utilizador interagir, chamamos a função 'updateList'
  categorySelect?.addEventListener("change", updateList); // Quando muda a opção do select
  searchBox?.addEventListener("input", updateList);       // Quando escreve uma letra
  sortSelect?.addEventListener("change", updateList);     // Quando muda a ordenação

  // Adiciona o evento de clique ao botão de finalizar encomenda
  document.getElementById("checkoutBtn")?.addEventListener("click", placeOrder);
});


function fetchProducts() {
  // 'fetch' inicia um pedido HTTP (neste caso, GET por omissão)
  // É assíncrono (Promise), ou seja, o código continua sem bloquear enquanto espera pela resposta
  fetch("https://deisishop.pythonanywhere.com/products")
    .then(r => r.json()) // Quando a resposta chega, convertemo-la de JSON (texto) para Objeto JS
    .then(data => {
      produtos = data; // Guardamos os dados recebidos na variável global 'produtos'
      updateList();    // Mandamos atualizar o ecrã com os novos dados
    })
    .catch(() => {
      // .catch apanha erros de rede (ex: servidor em baixo, sem internet)
      productsSection.textContent = "Não foi possível carregar os produtos.";
    });
}

function fetchCategories() {
  fetch("https://deisishop.pythonanywhere.com/categories")
    .then(r => r.json())
    .then(categorias => {
      if (!categorySelect) return; // Segurança: se o select não existir no HTML, paramos
      
      // Manipulação do DOM: Injetamos HTML dentro do select
      // .map transforma o array de strings ["Eletronica", "Roupa"] num array de HTML ["<option>...", "<option>..."]
      // .join("") junta tudo numa única string de texto para o innerHTML
      categorySelect.innerHTML = `<option value="">Todas</option>` +
      categorias.map(c => `<option value="${c.name}">${c.name}</option>`).join("");
    })
    .catch(err => {
      console.error("Erro ao carregar categorias:", err);
    });
}


function applyFilters() {
  // Obtemos os valores dos inputs. .trim() remove espaços vazios acidentais
  const term = (searchBox?.value || "").trim().toLowerCase(); // .toLowerCase() permite pesquisa case-insensitive
  const cat = (categorySelect?.value || "").trim(); // "" significa que o utilizador quer ver 'Todas'

  let list = produtos; // Começamos com a cópia da lista original

  // 1. Filtragem por Categoria (Array Method: .filter)
  if (cat) list = list.filter(p => (p.category || "") === cat);

  // 2. Filtragem por Texto
  if (term) {
    // Mantém na lista apenas produtos cujo título OU descrição contenham o termo pesquisado
    list = list.filter(p =>
      (p.title || "").toLowerCase().includes(term) ||
      (p.description || "").toLowerCase().includes(term)
    );
  }

  // 3. Ordenação (Array Method: .sort)
  const order = sortSelect?.value;
  if (order === "asc") list = [...list].sort((a, b) => a.price - b.price); // [...list] cria uma cópia para não alterar o array original
  if (order === "desc") list = [...list].sort((a, b) => b.price - a.price); // Preço B - Preço A (Decrescente)

  return list; // Devolve a lista processada para ser desenhada
}

function updateList() {
  renderProducts(applyFilters());
}


function renderProducts(list) {
  productsSection.innerHTML = ""; // Limpa a secção (remove produtos antigos)
  
  list.forEach(p => { // Percorre cada produto da lista filtrada
    // 1. createElement: Cria um novo nó HTML na memória (<article>)
    const article = document.createElement("article");
    article.className = "product";
    
    // 2. innerHTML com Template Literals (` `): Define o conteúdo HTML do artigo
    // Injetamos as variáveis ${p.title}, ${p.price}, etc.
    // data-id="${p.id}": Data Attribute, usado para guardarmos o ID do produto no botão HTML
    article.innerHTML = `
      <img src="https://deisishop.pythonanywhere.com/${p.image}" width="150">
      <h3>${p.title}</h3>
      <p>${p.description}</p>
      <p><strong>€${Number(p.price).toFixed(2)}</strong></p>
      <p>Categoria: ${p.category}</p>
      <button class="add" data-id="${p.id}">Adicionar ao carrinho</button>
    `;
    
    // 3. append: Adiciona o elemento criado à página real
    productsSection.append(article);
  });

  // Adicionar Event Listeners aos botões que acabámos de criar dinamicamente
  productsSection.querySelectorAll(".add").forEach(btn => {
    // Quando clicado, vai buscar o ID guardado no 'dataset.id' (data-id) e chama addToCart
    btn.addEventListener("click", () => addToCart(Number(btn.dataset.id)));
  });
}

function renderCart() {
  cartSection.innerHTML = "";
  let total = 0;

  cart.forEach((item, i) => {
    total += Number(item.price); // Acumula o preço para o total
    const row = document.createElement("article");
    row.className = "cart-item";
    row.innerHTML = `
      <img src="https://deisishop.pythonanywhere.com/${item.image}" width="80">
      <p>${item.title}</p>
      <p><strong>€${Number(item.price).toFixed(2)}</strong></p>
      <button class="rm" data-i="${i}">Remover</button>
    `;
    cartSection.append(row);
  });

  // Atualiza o texto do elemento Total
  totalElement.textContent = `Total: €${Number(total).toFixed(2)}`;

  // Event Listeners para os botões de remover (usamos o índice 'i' do array)
  cartSection.querySelectorAll(".rm").forEach(btn => {
    btn.addEventListener("click", () => removeFromCart(Number(btn.dataset.i)));
  });
}


function addToCart(id) {
  // .find: Procura no array de produtos o objeto que tem o ID correspondente
  const produto = produtos.find(p => p.id === id);
  if (!produto) return;
  
  cart.push(produto); // Adiciona ao array do carrinho
  saveCart();         // Guarda no localStorage
  renderCart();       // Atualiza o visual
}

function removeFromCart(index) {
  cart.splice(index, 1); // .splice remove 1 item na posição 'index'
  saveCart();
  renderCart();
}

function saveCart() {
  // localStorage só aceita strings. JSON.stringify converte o Array em Texto JSON.
  localStorage.setItem("cart", JSON.stringify(cart));
}


async function placeOrder() {
  const cartToSend = cart.slice(); // Cria uma cópia do array cart
  const resultEl = document.getElementById("orderResult");

  if (!cartToSend.length) {
    alert("O carrinho está vazio.");
    return;
  }

  // Prepara o objeto de dados (Payload) para enviar ao servidor
  const data = {
    products: cartToSend.map(i => i.id), // .map transforma lista de Objetos em lista de IDs [1, 5, 9]
    student: !!document.getElementById("studentCheckbox")?.checked, // !! converte para Booleano verdadeiro/falso
    coupon: document.getElementById("coupon")?.value || "",
    name: document.getElementById("buyerName")?.value || ""
  };

  try {
    // fetch com método POST: Enviar dados para o servidor
    const resp = await fetch("https://deisishop.pythonanywhere.com/buy", {
      method: "POST",
      headers: { "Content-Type": "application/json" }, // Avisa o servidor que estamos a enviar JSON
      body: JSON.stringify(data) // Converte o objeto JS para texto JSON para viajar na rede
    });

    // Verifica o Código de Estado HTTP (Status Code)
    if (resp.status === 200) { // 200 OK: Sucesso
      const json = await resp.json(); // Lê a resposta do servidor
      
      // Lógica de feedback ao utilizador
      const usedDiscount = data.student || (data.coupon && data.coupon.trim() !== "");
      const totalLabel = usedDiscount ? "Total (com desconto)" : "Total";
      const msg = `${totalLabel}: €${json.totalCost} — Referência: ${json.reference}\n${json.example}`;
      if (resultEl) resultEl.innerText = msg;

      // Limpa o carrinho após sucesso
      cart = [];
      saveCart();
      renderCart();
    } else if (resp.status === 400 || resp.status === 405) { // 400 Bad Request: Dados errados
      const json = await resp.json().catch(() => ({ error: "Erro" }));
      if (resultEl) resultEl.textContent = `Erro: ${json.error || "Dados inválidos"}`;
    } else {
      const txt = await resp.text().catch(() => "");
      if (resultEl) resultEl.textContent = `Erro inesperado: ${resp.status} ${txt}`;
    }
  } catch {
    // Bloco catch para erros de rede (ex: servidor desligado)
    if (resultEl) resultEl.textContent = "Erro de rede ou CORS.";
  }
}
// garante a chave do cesto
if (!localStorage.getItem("produtos-selecionados")) {
  localStorage.setItem("produtos-selecionados", JSON.stringify([]));
}

document.addEventListener("DOMContentLoaded", async function () {
  await carregarCategorias();   // preenche o <select>
  await carregarProdutosAPI();  // carrega produtos da API e renderiza
  atualizaCesto();
});

const secProdutos = document.querySelector("#produtos");
const seletor = document.querySelector("#filtrarProdutos");

// manteremos os produtos em memória para poder filtrar
let produtos = [];

/* ------------ UI de produtos ------------ */
function criarProduto(produto) {
  const artigo = document.createElement("article");

  const titulo = document.createElement("h3");
  titulo.textContent = produto.title;
  artigo.appendChild(titulo);

  const img = document.createElement("img");
  const url = produto.image?.startsWith("http") ? produto.image : `https:${produto.image}`;
  img.src = url;
  img.alt = produto.title;
  img.loading = "lazy";
  img.width = 200;
  artigo.appendChild(img);

  const preco = document.createElement("p");
  preco.textContent = `€${Number(produto.price).toFixed(2)}`;
  artigo.appendChild(preco);

  const botao = document.createElement("button");
  botao.textContent = "Adicionar ao cesto";
  botao.addEventListener("click", function () {
    const lista = JSON.parse(localStorage.getItem("produtos-selecionados")) || [];
    lista.push(produto);
    localStorage.setItem("produtos-selecionados", JSON.stringify(lista));
    atualizaCesto();
  });
  artigo.appendChild(botao);

  secProdutos.appendChild(artigo);
}

function renderizarProdutos(lista) {
  // limpa apenas os <article> de produtos, mantendo o <select>
  [...secProdutos.querySelectorAll("article")].forEach(el => el.remove());
  lista.forEach(criarProduto);
}

/* ------------ CATEGORIAS ------------ */
async function carregarCategorias() {
  try {
    const resp = await fetch("https://deisishop.pythonanywhere.com/categories/");
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const categorias = await resp.json();

    // limpa e começa com "todas"
    seletor.innerHTML = `<option value="">Todas as categorias</option>`;

    categorias.forEach((cat, idx) => {
      const option = document.createElement("option");

      // se vier string: label=string, value=string
      // se vier objeto: label=category/name, value=id (se existir) senão label
      const label =
        (typeof cat === "string" ? cat :
         (cat.category ?? cat.name ?? `Categoria ${cat.id ?? idx}`));

      const value =
        (typeof cat === "string" ? cat :
         (cat.id != null ? String(cat.id) : label));

      option.value = value;
      option.textContent = label;
      seletor.appendChild(option);
    });

    seletor.addEventListener("change", () => {
      const val = seletor.value;
      if (!val) return renderizarProdutos(produtos);

      const filtrados = produtos.filter(p => {
        const pc = p.category; // pode ser string, número ou objeto
        const idDoProduto =
          typeof pc === "object" ? pc.id :
          typeof pc === "number" ? pc : null;

        const nomeDoProduto =
          typeof pc === "object" ? (pc.category ?? pc.name) :
          typeof pc === "string" ? pc : null;

        // compara por id (quando o value é id) OU por nome (quando o value é nome)
        return (idDoProduto != null && String(idDoProduto) === val) ||
               (nomeDoProduto != null && nomeDoProduto === val);
      });

      renderizarProdutos(filtrados);
    });
  } catch (e) {
    console.error("Erro ao carregar categorias:", e);
  }
}



/* ------------ PRODUTOS ------------ */
async function carregarProdutosAPI() {
  try {
    const resp = await fetch("https://deisishop.pythonanywhere.com/products/");
    produtos = await resp.json();
    renderizarProdutos(produtos);
  } catch (e) {
    console.error("Erro ao carregar produtos", e);
  }
}

/* ------------ CESTO ------------ */
function atualizaCesto() {
  const lista = JSON.parse(localStorage.getItem("produtos-selecionados")) || [];
  const secCesto = document.querySelector("#cesto");
  secCesto.innerHTML = "";

  lista.forEach(produto => {
    const artigo = criaProdutoCesto(produto);
    secCesto.appendChild(artigo);
  });

  const total = lista.reduce((soma, produto) => soma + Number(produto.price || 0), 0);
  const totalElem = document.createElement("p");
  totalElem.textContent = `Total: €${total.toFixed(2)}`;
  secCesto.appendChild(totalElem);
}

function criaProdutoCesto(produto) {
  const artigo = document.createElement("article");

  const titulo = document.createElement("h3");
  titulo.textContent = produto.title;

  const preco = document.createElement("p");
  preco.textContent = `Preço: €${Number(produto.price).toFixed(2)}`;

  const botaoRemover = document.createElement("button");
  botaoRemover.textContent = "Remover";
  botaoRemover.addEventListener("click", function () {
    let lista = JSON.parse(localStorage.getItem("produtos-selecionados")) || [];
    const index = lista.findIndex(item => item.id === produto.id);
    if (index !== -1) lista.splice(index, 1);
    localStorage.setItem("produtos-selecionados", JSON.stringify(lista));
    atualizaCesto();
  });

  artigo.append(titulo, preco, botaoRemover);
  return artigo;
}

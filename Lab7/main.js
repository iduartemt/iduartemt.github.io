const API_CATS = "https://deisishop.pythonanywhere.com/categories/";
const API_PROD = "https://deisishop.pythonanywhere.com/products/";


let todosProdutos = [];
let cesto = [];


const elProdutos = document.querySelector('#produtos');
const elCategorias = document.querySelector('#filtro-categoria');
const elFiltroTexto = document.querySelector('#filtro-texto');
const elBtnLimpar = document.querySelector('#btn-limpar');
const elListaCesto = document.querySelector('#lista-cesto');
const elTotal = document.querySelector('#total-valor');


const fmtEUR = n => n.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' });


document.addEventListener('DOMContentLoaded', init);


async function init() {
  cesto = JSON.parse(localStorage.getItem('cesto')) || [];
  renderCesto();
  await carregarCategorias();
  await carregarProdutos();
  aplicarFiltros();
  elCategorias.addEventListener('change', aplicarFiltros);
  elFiltroTexto.addEventListener('input', aplicarFiltros);
  elBtnLimpar.addEventListener('click', () => {
    elCategorias.value = '';
    elFiltroTexto.value = '';
    aplicarFiltros();
  });
}


async function carregarCategorias() {
  try {
    const resp = await fetch(API_CATS);
    const categorias = await resp.json();
    const nomes = categorias.map((cat, i) => typeof cat === 'string' ? cat : cat.category || cat.name || `Categoria ${i}`);
    nomes.forEach(nome => {
      const opt = document.createElement('option');
      opt.value = nome;
      opt.textContent = nome;
      elCategorias.appendChild(opt);
    });
  } catch (e) { console.error(e); }
}

async function carregarProdutos() {
  try {
    const resp = await fetch(API_PROD);
    todosProdutos = await resp.json();
  } catch (e) {
    console.error(e);
    todosProdutos = [];
  }
}


function aplicarFiltros() {
  const cat = elCategorias.value.trim();
  const texto = elFiltroTexto.value.trim().toLowerCase();
  const filtrados = todosProdutos.filter(p => {
    const nome = (p.title || '').toLowerCase();
    const catNome = typeof p.category === 'object' ? (p.category.category || p.category.name || '') : (p.category || '');
    return (!cat || catNome === cat) && (!texto || nome.includes(texto));
  });
  renderProdutos(filtrados);
}


function renderProdutos(lista) {
  elProdutos.innerHTML = lista.length ? '' : '<p>Sem produtos...</p>';
  lista.forEach(p => elProdutos.appendChild(criarCardProduto(p)));
}


function criarCardProduto(prod) {
  const card = document.createElement('article');
  card.className = 'card';
  card.innerHTML = `
<img src="${(prod.image && prod.image.startsWith('http') ? prod.image : 'https:' + prod.image)}" alt="${prod.title}">
<h3>${prod.title}</h3>
<div class="preco">${fmtEUR(Number(prod.price || 0))}</div>
<button class="btn">Adicionar ao cesto</button>
`;
  card.querySelector('button').addEventListener('click', () => adicionarAoCesto(prod));
  return card;
}


function adicionarAoCesto(prod) {
  const item = { id: prod.id, title: prod.title, price: Number(prod.price || 0) };
  cesto.push(item);
  guardarCesto();
  renderCesto();
}


function removerDoCesto(id) {
  const idx = cesto.findIndex(i => i.id === id);
  if (idx !== -1) cesto.splice(idx, 1);
  guardarCesto();
  renderCesto();
}


function guardarCesto() {
  localStorage.setItem('cesto', JSON.stringify(cesto));
}


function renderCesto() {
  elListaCesto.innerHTML = '';
  if (!cesto.length) {
    elListaCesto.innerHTML = '<p>O cesto está vazio.</p>';
    elTotal.textContent = fmtEUR(0);
    return;
  }
  let total = 0;
  cesto.forEach(item => {
    total += item.price;
    const linha = document.createElement('div');
    linha.className = 'linha-cesto';
    linha.innerHTML = `<span>${item.title}</span><strong>${fmtEUR(item.price)}</strong><button>Remover</button>`;
    linha.querySelector('button').addEventListener('click', () => removerDoCesto(item.id));
    elListaCesto.appendChild(linha);
  });
  elTotal.textContent = fmtEUR(total);
}
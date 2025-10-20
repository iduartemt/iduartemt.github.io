
//Verifica se ja existe a chave "produtos-selecioandos" no localStorage
if (!localStorage.getItem("produtos-selecionados")) {
    //Se nao exsitir, cria uma lista vazia
    localStorage.setItem("produtos-selecionados", JSON.stringify([]));
}

document.addEventListener("DOMContentLoaded", function () {
    carregarProdutos(produtos);
});

const produtosLi = document.querySelector("#produtos")

function criarProduto(produto) {

    // Cria o elemento principal <article>
    const artigo = document.createElement("article");

    // Mostra o título do produto
    artigo.textContent = produto.title;

    //cria o botao
    const botao = document.createElement("button");
    botao.textContent = "Adicionar ao cesto";

    // Cria o eventListener para o clique do botão
    botao.addEventListener("click", function () {
        let lista = JSON.parse(localStorage.getItem("produtos-selecionados")) || [];
        lista.push(produto);
        localStorage.setItem("produtos-selecionados", JSON.stringify(lista));
        atualizaCesto(); // ✅ atualiza o cesto e o total automaticamente
    });

    artigo.appendChild(botao);
    produtosLi.append(artigo);
}

function carregarProdutos(produtos) {
    produtos.forEach(produto => criarProduto(produto));
}

//Adiciona produto no carrinho e guardo no localStorage
function adicionarAoCarrinho(produto) {

    //Le o carrinho atual
    let carrinho = JSON.parse(localStorage.getItem("carrinho"));

    //Adiciona o novo produto
    carrinho.push(produto);

    //Guarda o carrinho atualizado no localStorage
    localStorage.setItem("carrinho", JSON.stringify(carrinho));

}

function atualizaCesto() {
    const lista = JSON.parse(localStorage.getItem("produtos-selecionados")) || [];
    const secCesto = document.querySelector("#cesto");
    secCesto.innerHTML = "";

    // Criar artigos para cada produto
    lista.forEach(produto => {
        const artigo = criaProdutoCesto(produto);
        secCesto.appendChild(artigo);
    });

    // ✅ Calcular o total
    const total = lista.reduce((soma, produto) => soma + produto.price, 0);

    // ✅ Criar (ou atualizar) o elemento que mostra o total
    const totalElem = document.createElement("p");
    totalElem.textContent = `Total: €${total.toFixed(2)}`;

    // Adicionar ao fim da secção
    secCesto.appendChild(totalElem);
}

function criaProdutoCesto(produto) {
    // Cria o elemento principal
    const artigo = document.createElement("article");

    // Título
    const titulo = document.createElement("h3");
    titulo.textContent = produto.title;

    // Preço
    const preco = document.createElement("p");
    preco.textContent = `Preço: €${produto.price}`;

    // 🔹 Botão "Remover"
    const botaoRemover = document.createElement("button");
    botaoRemover.textContent = "Remover";

    // 🔹 Event listener para remover o produto
    botaoRemover.addEventListener("click", function () {
        let lista = JSON.parse(localStorage.getItem("produtos-selecionados")) || [];
        const index = lista.findIndex(item => item.id === produto.id);
        if (index !== -1) lista.splice(index, 1);
        localStorage.setItem("produtos-selecionados", JSON.stringify(lista));
        atualizaCesto(); // ✅ atualiza o cesto e recalcula o total
    });


    // Junta tudo no <article>
    artigo.append(titulo, preco, botaoRemover);

    // Retorna o artigo criado
    return artigo;
}


// Constantes
const passarPorCima = document.querySelector("#passarPorCima");
const inputP3 = document.querySelector('#caixaDeTexto');
const inputP4 = document.querySelector('#caixaDeTexto-ponto4');
const botaoSubmeter = document.querySelector('#botaoSub');
const redColor = document.querySelector("#red");
const greenColor = document.querySelector("#green");
const blueColor = document.querySelector("#blue");
const textoP2 = document.querySelector('#corTexto');
const botaoConta = document.querySelector('#botaoConta');
const contador = document.querySelector('#contador');
const listaCores4 = document.querySelector("#listaCores");
const botaoSubmit = document.querySelector("#botaoSubmit");
const nome = document.querySelector("#nome");
const idade = document.querySelector("#idade");
const textoApresentacao = document.querySelector("#textoApresentacao");
const counter = document.querySelector("#contagemAutomatica");

// Variáveis
let numero = 0;
let numeroAuto = 0;

// Listeners
document.querySelector('#listaCores').onchange = function() {
  document.querySelector('body').style.backgroundColor = this.value;
};

const passaEmCima = () => {
  passarPorCima.textContent = "1. Obrigado por passares!";
}
passarPorCima.addEventListener("mouseover", passaEmCima);
passarPorCima.addEventListener("mouseout", tiraRato);
inputP3.addEventListener("keydown", corDeFundo);
botaoSubmeter.addEventListener("click", submeterTexto);
botaoConta.addEventListener("click", contar);

//ArrowFunction
botaoSubmit.addEventListener("click", () => {
  const nomeDaPessoa = nome.value;
  const idadeDaPessoa = idade.value;
  textoApresentacao.textContent = `Olá, o ${nomeDaPessoa} tem ${idadeDaPessoa} !`;
});

// Funções
document.querySelectorAll("button, #color").forEach((botao) => {
  botao.addEventListener("click", () => {
    const cor = botao.dataset.color;
    textoP2.style.color = cor;
  });
});

function tiraRato() {
  passarPorCima.textContent = "1. Passa por aqui!";
}

function mudaCor(cor) {
  textoP2.style.color = cor;
}

function corDeFundo() {
  const cores = ['grey', 'lightblue', 'yellow'];
  const corAleatoria = Math.floor(Math.random() * cores.length);
  inputP3.style.background = cores[corAleatoria];
}

function submeterTexto() {
  const cor = inputP4.value;
  document.body.style.backgroundColor = cor;
}

function contar() {
  numero++;
  contador.textContent = numero;
}

function contarAutomatico() {
  counter.innerHTML = ++numeroAuto;
}

setInterval(contarAutomatico, 1000);


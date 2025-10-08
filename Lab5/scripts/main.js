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

// Variáveis
let numero = 0;

// Listeners
passarPorCima.addEventListener("mouseover", passaEmCima);
passarPorCima.addEventListener("mouseout", tiraRato);
redColor.addEventListener("click", mudarCorTexto);
greenColor.addEventListener("click", mudarCorTexto);
blueColor.addEventListener("click", mudarCorTexto);
inputP3.addEventListener("keydown", corDeFundo);
botaoSubmeter.addEventListener("click", submeterTexto);
botaoConta.addEventListener("click", contar);

// Funções
function mudarCorTexto() {
  if (this === redColor) {
    textoP2.style.color = "red";
  } else if (this === greenColor) {
    textoP2.style.color = "green";
  } else if (this === blueColor) {
    textoP2.style.color = "blue";
  }
}

// Funções
function passaEmCima() {
  passarPorCima.textContent = "1. Obrigado por passares!";
}

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

function contar(){
   numero++;
   contador.textContent = numero;
}
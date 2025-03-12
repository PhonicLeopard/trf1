// Variáveis para armazenar os objetos
let carro;
let carroEsportivo;
let caminhao;

// Classe Veiculo (Base)
class Veiculo {
  constructor(modelo, cor, imagem) {
    this.modelo = modelo;
    this.cor = cor;
    this.ligado = false;
    this.imagem = imagem;
  }

  ligar() {
    this.ligado = true;
    console.log(`${this.modelo} ligado.`);
  }

  desligar() {
    this.ligado = false;
    console.log(`${this.modelo} desligado.`);
  }

  buzinar() {
    console.log("Bi Bi!");
  }
}

// Classe Carro (Herdando de Veiculo)
class Carro extends Veiculo {
  constructor(modelo, cor, imagem) {
    super(modelo, cor, imagem);
    this.velocidade = 0;
  }

  acelerar(incremento) {
    if (this.ligado) {
      this.velocidade += incremento;
      console.log(`${this.modelo} acelerando para ${this.velocidade} km/h.`);
    } else {
      console.log("O carro precisa estar ligado para acelerar.");
    }
  }

  frear(decremento) {
    if (this.velocidade > 0) {
      this.velocidade -= decremento;
      if (this.velocidade < 0) this.velocidade = 0;
      console.log(`${this.modelo} freando para ${this.velocidade} km/h.`);
    } else {
      console.log("O carro já está parado.");
    }
  }

  buzinar() {
    console.log("Beep Beep!");
  }
}

// Classe CarroEsportivo (Herdando de Carro)
class CarroEsportivo extends Carro {
  constructor(modelo, cor, imagem) {
    super(modelo, cor, imagem);
    this.turboAtivado = false;
  }

  ativarTurbo() {
    if (this.ligado) {
      this.turboAtivado = true;
      this.acelerar(50);
      console.log("Turbo ativado!");
      atualizarStatusCarroEsportivo();
    } else {
      console.log("Ligue o carro antes de ativar o turbo.");
    }
  }

  desativarTurbo() {
    this.turboAtivado = false;
    console.log("Turbo desativado!");
    atualizarStatusCarroEsportivo();
  }

  buzinar() {
    console.log("Vrooooooom!");
  }
}

// Classe Caminhao (Herdando de Carro)
class Caminhao extends Carro {
  constructor(modelo, cor, capacidadeCarga, imagem) {
    super(modelo, cor, imagem);
    this.capacidadeCarga = capacidadeCarga;
    this.cargaAtual = 0;
  }

  carregar(peso) {
    if (this.cargaAtual + peso <= this.capacidadeCarga) {
      this.cargaAtual += peso;
      console.log(`Caminhão carregado com ${peso} kg. Carga atual: ${this.cargaAtual} kg.`);
      atualizarStatusCaminhao();
    } else {
      console.log("Capacidade máxima de carga excedida.");
    }
  }

  buzinar() {
    console.log("Fom Fom!");
  }
}

// Funções para Carro Comum
function criarCarro() {
  const modelo = document.getElementById("modeloCarro").value;
  const cor = document.getElementById("corCarro").value;
  const imagem = document.getElementById("imagemCarro").value || "https://via.placeholder.com/150/808080/FFFFFF?text=Carro";
  carro = new Carro(modelo, cor, imagem);
  atualizarStatusCarro();
  console.log("Carro criado:", carro);
}

function ligarCarro() {
  if (carro) {
    carro.ligar();
    atualizarStatusCarro();
  } else {
    alert("Crie o Carro primeiro!");
  }
}

function acelerarCarro() {
  if (carro) {
    carro.acelerar(20);
    atualizarStatusCarro();
  } else {
    alert("Crie o Carro primeiro!");
  }
}

function frearCarro() {
    if (carro) {
      carro.frear(10);
      atualizarStatusCarro();
    } else {
      alert("Crie o Carro primeiro!");
    }
}

function buzinarCarro() {
  if (carro) {
    carro.buzinar();
  } else {
    alert("Crie o Carro primeiro!");
  }
}

function atualizarStatusCarro() {
  if (carro) {
    let statusText = `Modelo: ${carro.modelo}, Cor: ${carro.cor}, Ligado: ${carro.ligado}, Velocidade: ${carro.velocidade}`;
    let imagemElement = document.createElement("img");
    imagemElement.src = carro.imagem;
    imagemElement.alt = "Imagem do Carro";
    imagemElement.style.width = "150px";

    let statusDiv = document.getElementById("statusCarro");
    statusDiv.innerHTML = statusText;
    statusDiv.appendChild(document.createElement("br"));
    statusDiv.appendChild(imagemElement);
  }
}

// Funções para Carro Esportivo
function criarCarroEsportivo() {
  const modelo = document.getElementById("modeloEsportivo").value;
  const cor = document.getElementById("corEsportivo").value;
  const imagem = document.getElementById("imagemEsportivo").value || "https://via.placeholder.com/150/FF0000/FFFFFF?text=Esportivo";
  carroEsportivo = new CarroEsportivo(modelo, cor, imagem);
  atualizarStatusCarroEsportivo();
  console.log("Carro esportivo criado:", carroEsportivo);
}

function ligarCarroEsportivo() {
  if (carroEsportivo) {
    carroEsportivo.ligar();
    atualizarStatusCarroEsportivo();
  } else {
    alert("Crie o Carro Esportivo primeiro!");
  }
}

function acelerarCarroEsportivo() {
  if (carroEsportivo) {
    carroEsportivo.acelerar(20);
    atualizarStatusCarroEsportivo();
  } else {
    alert("Crie o Carro Esportivo primeiro!");
  }
}

function frearCarroEsportivo() {
    if (carroEsportivo) {
    carroEsportivo.frear(10);
    atualizarStatusCarroEsportivo();
  } else {
    alert("Crie o Carro Esportivo primeiro!");
  }
}

function ativarTurbo() {
  if (carroEsportivo) {
    carroEsportivo.ativarTurbo();
    atualizarStatusCarroEsportivo();
  } else {
    alert("Crie o Carro Esportivo primeiro!");
  }
}

function desativarTurbo() {
  if (carroEsportivo) {
    carroEsportivo.desativarTurbo();
    atualizarStatusCarroEsportivo();
  } else {
    alert("Crie o Carro Esportivo primeiro!");
  }
}

function buzinarCarroEsportivo() {
  if (carroEsportivo) {
    carroEsportivo.buzinar();
  } else {
    alert("Crie o Carro Esportivo primeiro!");
  }
}

function atualizarStatusCarroEsportivo() {
  if (carroEsportivo) {
    let statusText = `Modelo: ${carroEsportivo.modelo}, Cor: ${carroEsportivo.cor}, Ligado: ${carroEsportivo.ligado}, Velocidade: ${carroEsportivo.velocidade}, Turbo: ${carroEsportivo.turboAtivado}`;
    let imagemElement = document.createElement("img");
    imagemElement.src = carroEsportivo.imagem;
    imagemElement.alt = "Imagem do Carro Esportivo";
    imagemElement.style.width = "150px";

    let statusDiv = document.getElementById("statusCarroEsportivo");
    statusDiv.innerHTML = statusText;
    statusDiv.appendChild(document.createElement("br"));
    statusDiv.appendChild(imagemElement);
  }
}

// Funções para Caminhão
function criarCaminhao() {
  const modelo = document.getElementById("modeloCaminhao").value;
  const cor = document.getElementById("corCaminhao").value;
  const capacidadeCarga = parseInt(document.getElementById("capacidadeCarga").value);
  const imagem = document.getElementById("imagemCaminhao").value || "https://via.placeholder.com/150/0000FF/FFFFFF?text=Caminhao";
  caminhao = new Caminhao(modelo, cor, capacidadeCarga, imagem);
  atualizarStatusCaminhao();
  console.log("Caminhão criado:", caminhao);
}

function ligarCaminhao() {
  if (caminhao) {
    caminhao.ligar();
    atualizarStatusCaminhao();
  } else {
    alert("Crie o Caminhão primeiro!");
  }
}

function acelerarCaminhao() {
    if (caminhao) {
    caminhao.acelerar(20);
    atualizarStatusCaminhao();
  } else {
    alert("Crie o Caminhão primeiro!");
  }
}

function frearCaminhao() {
    if (caminhao) {
    caminhao.frear(10);
    atualizarStatusCaminhao();
  } else {
    alert("Crie o Caminhão primeiro!");
  }
}

function carregarCaminhao() {
  if (caminhao) {
    const peso = parseInt(document.getElementById("pesoCarga").value);
    caminhao.carregar(peso);
  } else {
    alert("Crie o Caminhão primeiro!");
  }
}

function buzinarCaminhao() {
  if (caminhao) {
    caminhao.buzinar();
  } else {
    alert("Crie o Caminhão primeiro!");
  }
}

function atualizarStatusCaminhao() {
  if (caminhao) {
    let statusText = `Modelo: ${caminhao.modelo}, Cor: ${caminhao.cor}, Carga Atual: ${caminhao.cargaAtual} kg, Capacidade: ${caminhao.capacidadeCarga} kg, Ligado: ${caminhao.ligado}, Velocidade: ${caminhao.velocidade}`;
    let imagemElement = document.createElement("img");
    imagemElement.src = caminhao.imagem;
    imagemElement.alt = "Imagem do Caminhão";
    imagemElement.style.width = "150px";

    let statusDiv = document.getElementById("statusCaminhao");
    statusDiv.innerHTML = statusText;
    statusDiv.appendChild(document.createElement("br"));
    statusDiv.appendChild(imagemElement);
  }
  // (Dentro das funções atualizarStatusCarro, atualizarStatusCarroEsportivo, atualizarStatusCaminhao)

  let statusDiv = document.getElementById("statusCarro"); // Ou o ID correspondente
  statusDiv.className = "veiculo-container"; // Adiciona a classe ao container

  // Criar o container da imagem
  let imagemContainer = document.createElement("div");
  imagemContainer.className = "imagem-container";

  let imagemElement = document.createElement("img");
  imagemElement.src = veiculo.imagem; // ou carroEsportivo.imagem, caminhao.imagem
  imagemElement.alt = "Imagem do Veículo";
  imagemElement.className = "veiculo-imagem"; // Adiciona a classe à imagem

  imagemContainer.appendChild(imagemElement);
  statusDiv.appendChild(imagemContainer); // Adiciona o container da imagem ao container geral

  // Criar o texto com as informações do veículo
  let infoText = document.createElement("p");
  infoText.className = "veiculo-info";
  infoText.textContent = `Modelo: ${veiculo.modelo}, Cor: ${veiculo.cor}, Ligado: ${veiculo.ligado}, Velocidade: ${veiculo.velocidade}`; // Ajuste conforme necessário
  statusDiv.appendChild(infoText);

  statusDiv.appendChild(document.createElement("br")); // Quebra de linha para espaçamento
}

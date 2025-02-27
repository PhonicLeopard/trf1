// Definição da classe Carro
class Carro {
    constructor(modelo, cor) {
      this.modelo = modelo;
      this.cor = cor;
      this.velocidade = 0; // Novo atributo
      this.ligado = false;
    }
  
    ligar() {
      if (!this.ligado) {
        this.ligado = true;
        console.log("Carro ligado!");
        atualizarEstadoCarroNaTela(); // Atualiza o estado na tela ao ligar
      } else {
        console.log("O carro já está ligado.");
      }
    }
  
    desligar() {
      if (this.ligado) {
        this.ligado = false;
        this.velocidade = 0; // Resetar a velocidade ao desligar
        atualizarVelocidadeNaTela();
        atualizarEstadoCarroNaTela(); // Atualiza o estado na tela ao desligar
        console.log("Carro desligado!");
      } else {
        console.log("O carro já está desligado.");
      }
    }
  
    acelerar() {
      if (this.ligado) {
        this.velocidade += 10;
        atualizarVelocidadeNaTela();
        console.log("Acelerando! Velocidade atual: " + this.velocidade + " km/h");
      } else {
        console.log("O carro precisa estar ligado para acelerar.");
      }
    }
  }
  
  // Criando um objeto Carro
  const meuCarro = new Carro("Uno com Escada", "Prata");
  
  // Obtendo elementos HTML
  const modeloElement = document.getElementById("modelo");
  const corElement = document.getElementById("cor");
  const velocidadeElement = document.getElementById("velocidade");
  const ligarButton = document.getElementById("ligar");
  const desligarButton = document.getElementById("desligar");
  const acelerarButton = document.getElementById("acelerar");
  const carroImagem = document.getElementById("carroImagem"); // Obtém a imagem do carro
  const estadoCarroElement = document.getElementById("estadoCarro"); // Obtém o elemento do estado do carro
  
  // Exibindo informações do carro na tela
  modeloElement.textContent = meuCarro.modelo;
  corElement.textContent = meuCarro.cor;
  
  // Função para atualizar a velocidade na tela
  function atualizarVelocidadeNaTela() {
    velocidadeElement.textContent = meuCarro.velocidade;
  }
  
  // Função para atualizar o texto do estado do carro
  function atualizarEstadoCarroNaTela() {
    if (meuCarro.ligado) {
      estadoCarroElement.textContent = "Ligado";
    } else {
      estadoCarroElement.textContent = "Desligado";
    }
  }
  
  // Função para atualizar o estado visual do carro (cor da imagem)
  function atualizarEstadoVisual() {
    if (meuCarro.ligado) {
      carroImagem.classList.add("carro-ligado"); // Adiciona a classe se o carro estiver ligado
    } else {
      carroImagem.classList.remove("carro-ligado"); // Remove a classe se o carro estiver desligado
    }
  }
  
  // Adicionando listeners de evento aos botões
  ligarButton.addEventListener("click", function() {
    meuCarro.ligar();
    atualizarEstadoVisual(); // Atualiza a cor da imagem
  });
  
  desligarButton.addEventListener("click", function() {
    meuCarro.desligar();
    atualizarEstadoVisual(); // Atualiza a cor da imagem
  });
  
  acelerarButton.addEventListener("click", function() {
    meuCarro.acelerar();
    carroImagem.classList.add("carro-movendo"); // Adiciona a classe para iniciar a animação
    setTimeout(function() { // Remove a classe após um curto período para permitir que a animação se repita
      carroImagem.classList.remove("carro-movendo");
    }, 1000); // 1000 milissegundos = 1 segundo (duração da animação)
  });
  
  // Inicializa o estado do carro e a velocidade na tela
  atualizarEstadoCarroNaTela();
  atualizarVelocidadeNaTela();

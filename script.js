// Variáveis globais (veículos)
let carro = null;
let carroEsportivo = null;
let caminhao = null;

// --- OBJETOS DE ÁUDIO GLOBAIS ---
// !! IMPORTANTE: Certifique-se que os arquivos existem na pasta 'sounds/' !!
// !! ou ajuste os caminhos conforme necessário.                       !!
const audioContextCreated = false; // Flag para interação inicial do usuário

const soundMap = {
    ligar: new Audio('sounds/ligar.mp3'),
    desligar: new Audio('sounds/desligar.mp3'),
    acelerar: new Audio('sounds/acelerar.mp3'),
    frear: new Audio('sounds/frear.mp3'),
    buzinar_carro: new Audio('sounds/buzina_carro.mp3'), // Ex: Buzina específica
    buzinar_esportivo: new Audio('sounds/buzina_esportivo.mp3'),
    buzinar_caminhao: new Audio('sounds/buzina_caminhao.mp3'),
    // Adicione outros sons se desejar (ex: turbo, carregar)
};

// Opcional: Pré-carregar sons (pode ajudar em conexões lentas)
// Object.values(soundMap).forEach(sound => sound.load());

// Opcional: Tratar erros de carregamento
Object.entries(soundMap).forEach(([key, sound]) => {
    sound.onerror = () => {
        console.error(`Erro ao carregar o som "${key}": ${sound.src}`);
        // Poderia desabilitar a reprodução desse som específico
    };
});

// --- Definição das Classes (Com validações e maxVelocidade - sem alterações aqui) ---
class Veiculo { /* ...código como antes... */
    constructor(modelo, cor, imagem) { this.modelo = modelo; this.cor = cor; this.imagem = imagem; this.ligado = false;}
    ligar() { if (!this.ligado) { this.ligado = true; console.log(`${this.modelo} ligado.`); return true; } else { alert(`${this.modelo} já está ligado.`); return false; }}
    desligar() { if (!this.ligado) { alert(`${this.modelo} já está desligado.`); return false; } const v = typeof this.velocidade === 'number' ? this.velocidade : 0; if (v > 0) { alert(`Não desligar ${this.modelo} em movimento (V: ${v} km/h).`); return false; } this.ligado = false; console.log(`${this.modelo} desligado.`); return true;}
    buzinar() { console.log("Bi Bi!"); return true; } // Lógica de qual buzina tocar vai para 'interagir'
    exibirInformacoes() { const s = this.ligado ? 'Ligado' : 'Desligado'; return `--- Info Base ---\nMod: ${this.modelo}\nCor: ${this.cor}\nStatus: ${s}`; }
}
class Carro extends Veiculo { /* ...código como antes... */
    constructor(modelo, cor, imagem) { super(modelo, cor, imagem); this.velocidade = 0; this.maxVelocidade = 180; }
    acelerar(inc = 10) { const n = Number(inc); if(isNaN(n)||n<=0) return false; if (!this.ligado) { alert(`Ligue ${this.modelo}`); return false; } if (this.velocidade >= this.maxVelocidade) { alert(`Max vel (${this.maxVelocidade})`); return false; } this.velocidade = Math.min(this.velocidade + n, this.maxVelocidade); console.log(`${this.modelo} V:${this.velocidade}`); return true; }
    frear(dec = 10) { const n = Number(dec); if(isNaN(n)||n<=0) return false; if (this.velocidade === 0) { alert(`${this.modelo} parado.`); return false; } this.velocidade = Math.max(0, this.velocidade - n); console.log(`${this.modelo} V:${this.velocidade}`); return true; }
    // buzinar específico pode ser tratado em 'interagir'
}
class CarroEsportivo extends Carro { /* ...código como antes... */
    constructor(modelo, cor, imagem) { super(modelo, cor, imagem); this.turboAtivado = false; this.maxVelocidade = 350; }
    acelerar(inc = 25) { const n = Number(inc); if(isNaN(n)||n<=0) return false; if (!this.ligado) { alert(`Ligue ${this.modelo}`); return false; } if (this.velocidade >= this.maxVelocidade) { alert(`Max vel (${this.maxVelocidade})`); return false; } const boost = this.turboAtivado ? n * 1.8 : n; this.velocidade = Math.min(this.velocidade + boost, this.maxVelocidade); console.log(`${this.modelo} V:${this.velocidade} ${this.turboAtivado ? '(T!)':''}`); return true; }
    frear(dec = 15) { const n = Number(dec); if(isNaN(n)||n<=0) return false; return super.frear(n); }
    ativarTurbo() { if(!this.ligado) return false; if(!this.turboAtivado) {this.turboAtivado=true; console.log("Turbo ON"); return true;} else {alert("Turbo já ON"); return false;} }
    desativarTurbo() { if(this.turboAtivado) {this.turboAtivado=false; console.log("Turbo OFF"); return true;} else {alert("Turbo já OFF"); return false;} }
    exibirInformacoes() { const b = super.exibirInformacoes(); const t = this.turboAtivado ? 'Ativado' : 'Desativado'; return `${b}\n--- Esportivo ---\nTurbo: ${t}`; }
}
class Caminhao extends Carro { /* ...código como antes... */
    constructor(modelo, cor, cap, img) { super(modelo, cor, img); this.capacidadeCarga = Number(cap) || 0; this.cargaAtual = 0; this.maxVelocidade = 120; }
    acelerar(inc = 5) { const n = Number(inc); if(isNaN(n)||n<=0) return false; if (!this.ligado) { alert(`Ligue ${this.modelo}`); return false; } if (this.velocidade >= this.maxVelocidade) { alert(`Max vel (${this.maxVelocidade})`); return false; } const f = 1 - (this.cargaAtual / (this.capacidadeCarga * 2)); const boost = n * Math.max(0.3, f); this.velocidade = Math.min(this.velocidade + boost, this.maxVelocidade); console.log(`${this.modelo} V:${this.velocidade}`); return true; }
    frear(dec = 5) { const n = Number(dec); if(isNaN(n)||n<=0) return false; return super.frear(n); }
    carregar(peso) { const p = Number(peso); if (isNaN(p) || p <= 0) { alert("Peso inválido."); return false; } if (this.cargaAtual + p > this.capacidadeCarga) { alert(`Carga excedida (Max:${this.capacidadeCarga}, Atual:${this.cargaAtual})`); return false; } this.cargaAtual += p; console.log(`${this.modelo} Carga:${this.cargaAtual}`); return true; }
    descarregar(peso) { const p = Number(peso); if (isNaN(p) || p <= 0) { alert("Peso inválido."); return false; } if (p > this.cargaAtual) { alert(`Descarregar ${p}kg? Só tem ${this.cargaAtual}kg`); return false; } this.cargaAtual -= p; console.log(`${this.modelo} Carga:${this.cargaAtual}`); return true; }
    exibirInformacoes() { const b = super.exibirInformacoes(); return `${b}\n--- Caminhão ---\nCap: ${this.capacidadeCarga}kg\nCarga: ${this.cargaAtual}kg`; }
}


// --- Funções de Interação com HTML ---

const divInformacoes = document.getElementById('informacoesVeiculo');

function mostrarInformacoes(veiculo) {
    // (Função INALTERADA da versão anterior - já inclui status e barra)
     if (veiculo && typeof veiculo.exibirInformacoes === 'function') {
        let textoInfo = veiculo.exibirInformacoes();
        const imageUrl = veiculo.imagem || 'placeholder.png';

        const statusClass = veiculo.ligado ? 'status-ligado' : 'status-desligado';
        const statusTextOriginal = veiculo.ligado ? 'Ligado' : 'Desligado';
        textoInfo = textoInfo.replace(
            `Status: ${statusTextOriginal}`,
            `Status: <span class="status ${statusClass}">${statusTextOriginal}</span>`
        );

        let speedBarHtml = '';
        if (typeof veiculo.velocidade === 'number' && typeof veiculo.maxVelocidade === 'number' && veiculo.maxVelocidade > 0) {
            const speedPercent = Math.max(0, Math.min(100, (veiculo.velocidade / veiculo.maxVelocidade) * 100));
            speedBarHtml = `
                <div class="speed-bar-container">
                    <div class="speed-bar-label">Velocidade (${veiculo.velocidade.toFixed(0)} / ${veiculo.maxVelocidade} km/h):</div>
                    <div class="speed-bar">
                        <div class="speed-bar-fill" style="width: ${speedPercent.toFixed(2)}%;"></div>
                    </div>
                </div>
            `;
        }

        const htmlConteudo = `
            <div style="display: flex; align-items: flex-start; gap: 20px;">
                <div style="flex-shrink: 0;">
                    <img src="${imageUrl}"
                         alt="Imagem de ${veiculo.modelo}"
                         style="width: 150px; height: auto; border: 1px solid #ccc; border-radius: 5px; display: block;"
                         onerror="this.onerror=null; this.src='placeholder.png'; console.warn('Imagem não encontrada: ${imageUrl}');">
                </div>
                <div style="flex-grow: 1;">
                    <pre class="info-texto">${textoInfo}</pre>
                    ${speedBarHtml}
                </div>
            </div>
        `;
        divInformacoes.innerHTML = htmlConteudo;
    } else {
        divInformacoes.innerHTML = '<p style="text-align: center; color: #777; margin-top: 20px;">Crie ou selecione um veículo para ver os detalhes aqui.</p>';
    }
}


function atualizarImagem(imgId, novaUrl) {
    // (Função INALTERADA)
    const imgElement = document.getElementById(imgId);
    if (imgElement) {
        imgElement.src = novaUrl;
        imgElement.onerror = () => {
            console.warn(`Erro ao carregar imagem: ${novaUrl} para ${imgId}.`);
            imgElement.src='placeholder.png';
        };
    }
}

/**
 * Função para tocar um som, reiniciando se já estiver tocando.
 * @param {HTMLAudioElement} audioObject - O objeto Audio a ser tocado.
 */
function playSound(audioObject) {
    if (!audioObject) {
        console.warn("Tentativa de tocar um objeto de áudio inválido.");
        return;
    }
    // Pausa e reseta o tempo para permitir repetição rápida
    audioObject.pause();
    audioObject.currentTime = 0;
    // Tenta tocar - pode falhar se o usuário não interagiu com a página ainda
    const playPromise = audioObject.play();

    if (playPromise !== undefined) {
        playPromise.catch(error => {
            // Erro comum: usuário não interagiu ainda ou permissão negada.
            console.warn(`Não foi possível tocar o som (${audioObject.src.split('/').pop()}): ${error.message}. Interação do usuário pode ser necessária.`);
            // Não mostrar alert para não ser chato, apenas logar.
        });
    }
}

// --- FUNÇÃO GENÉRICA interagir() - MODIFICADA PARA TOCAR SOM ---
function interagir(veiculo, acao, ...args) {
    if (!veiculo) {
        alert("Por favor, crie o veículo correspondente primeiro!");
        return;
    }
    if (typeof veiculo[acao] !== 'function') {
        alert(`Operação inválida! A ação "${acao}" não pode ser realizada em um ${veiculo.constructor.name} (${veiculo.modelo}).`);
        return;
    }

    console.log(`Executando ação "${acao}" em ${veiculo.modelo}...`);
    try {
        const sucesso = veiculo[acao](...args);

        if (sucesso) {
            mostrarInformacoes(veiculo); // Atualiza a interface

            // --- Tocar Som Correspondente ---
            let soundToPlay = null;
            switch (acao) {
                case 'ligar':
                    soundToPlay = soundMap.ligar;
                    break;
                case 'desligar':
                    soundToPlay = soundMap.desligar;
                    break;
                case 'acelerar':
                    soundToPlay = soundMap.acelerar;
                    break;
                case 'frear':
                    // Só toca som de freio se estava em movimento antes
                    // (O método frear já retorna false se estava parado, então confiar no 'sucesso' é ok)
                    soundToPlay = soundMap.frear;
                    break;
                case 'buzinar':
                    // Escolhe a buzina com base no tipo de veículo
                    if (veiculo instanceof Caminhao) {
                        soundToPlay = soundMap.buzinar_caminhao;
                    } else if (veiculo instanceof CarroEsportivo) {
                        soundToPlay = soundMap.buzinar_esportivo;
                    } else { // Carro comum ou Veiculo genérico
                        soundToPlay = soundMap.buzinar_carro;
                    }
                    break;
                // Adicione cases para outros sons se necessário (ex: turbo, carga)
            }

            if (soundToPlay) {
                playSound(soundToPlay); // Chama a função helper para tocar
            }
            // --- Fim Tocar Som ---

        } // else: A ação falhou, o alerta já foi dado dentro do método. Não toca som.

    } catch (error) {
        console.error(`Erro ao executar a ação "${acao}" em ${veiculo.modelo}:`, error);
        alert(`Ocorreu um erro inesperado ao tentar executar a ação: ${acao}. Verifique o console.`);
    }
}


// --- Funções de Criação (Inalteradas) ---
function criarCarro() {
    const modelo = document.getElementById("modeloCarro").value;
    const cor = document.getElementById("corCarro").value;
    const imagemUrl = document.getElementById("imagemCarro").value || "OIP.jpg";
    carro = new Carro(modelo, cor, imagemUrl);
    atualizarImagem('imgCarro', carro.imagem);
    mostrarInformacoes(carro);
    console.log("Carro criado:", carro);
}
function criarCarroEsportivo() {
    const modelo = document.getElementById("modeloEsportivo").value;
    const cor = document.getElementById("corEsportivo").value;
    const imagemUrl = document.getElementById("imagemEsportivo").value || "OIP (1).jpg";
    carroEsportivo = new CarroEsportivo(modelo, cor, imagemUrl);
    atualizarImagem('imgEsportivo', carroEsportivo.imagem);
    mostrarInformacoes(carroEsportivo);
    console.log("Carro esportivo criado:", carroEsportivo);
}
function criarCaminhao() {
    const modelo = document.getElementById("modeloCaminhao").value;
    const cor = document.getElementById("corCaminhao").value;
    const capacidadeCarga = document.getElementById("capacidadeCarga").value;
    const imagemUrl = document.getElementById("imagemCaminhao").value || "oip2.jpg";
    caminhao = new Caminhao(modelo, cor, capacidadeCarga, imagemUrl);
    atualizarImagem('imgCaminhao', caminhao.imagem);
    mostrarInformacoes(caminhao);
    console.log("Caminhão criado:", caminhao);
}

// --- Event Listeners (Inalterados) ---
document.getElementById('btnInfoCarro').addEventListener('click', () => {
    mostrarInformacoes(carro);
});
document.getElementById('btnInfoEsportivo').addEventListener('click', () => {
    mostrarInformacoes(carroEsportivo);
});
document.getElementById('btnInfoCaminhao').addEventListener('click', () => {
    mostrarInformacoes(caminhao);
});

// --- Inicialização Opcional ---
// window.onload = () => { /* ... */ };
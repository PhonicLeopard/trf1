// ==========================================================================
//                             GARAGEM INTELIGENTE PRO
//                             SCRIPT PRINCIPAL (Refatorado)
// ==========================================================================

// --- Variáveis Globais e Constantes ---
let carro = null;
let carroEsportivo = null;
let caminhao = null;
const LOCAL_STORAGE_KEY = 'garagemInteligenteDados'; // Chave única para o LS

// --- Referências do DOM ---
const divInformacoes = document.getElementById('informacoesVeiculo');
const notificationArea = document.getElementById('notification-area');
// Adicione outras referências aqui se necessário (ex: botões específicos)

// --- Configuração de Áudio ---
const soundMap = {
    ligar: new Audio('sounds/ligar.mp3'),
    desligar: new Audio('sounds/desligar.mp3'),
    acelerar: new Audio('sounds/acelerar.mp3'),
    frear: new Audio('sounds/frear.mp3'),
    buzinar_carro: new Audio('sounds/buzina_carro.mp3'),
    buzinar_esportivo: new Audio('sounds/buzina_esportivo.mp3'),
    buzinar_caminhao: new Audio('sounds/buzina_caminhao.mp3'),
};
Object.entries(soundMap).forEach(([key, sound]) => {
    sound.onerror = () => console.error(`Erro ao carregar o som "${key}": ${sound.src}`);
    // sound.load(); // Descomente para pré-carregar
});

// ==========================================================================
//                                  CLASSES
// ==========================================================================

// --- Classe Manutencao ---
class Manutencao {
    constructor(data, tipo, custo, descricao = '') {
        if (!(data instanceof Date) || isNaN(data.getTime())) throw new Error("Data inválida (Manutencao).");
        if (typeof tipo !== 'string' || tipo.trim() === '') throw new Error("Tipo obrigatório (Manutencao).");
        if (typeof custo !== 'number' || custo < 0) throw new Error("Custo inválido (Manutencao).");
        if (typeof descricao !== 'string') throw new Error("Descrição inválida (Manutencao).");
        this.data = data;
        this.tipo = tipo.trim();
        this.custo = custo;
        this.descricao = descricao.trim();
    }

    getDetalhesFormatados() {
        const dataFormatada = this.data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
        const custoFormatado = this.custo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        let detalhes = `${this.tipo} em ${dataFormatada} - ${custoFormatado}`;
        if (this.descricao) detalhes += ` (${this.descricao})`;
        return detalhes;
    }

    static fromPlainObject(obj) {
        if (!obj || !obj.data || !obj.tipo || typeof obj.custo === 'undefined') {
            console.error("Dados insuficientes/inválidos para recriar Manutencao:", obj); return null;
        }
        const dataObj = new Date(obj.data);
        if (isNaN(dataObj.getTime())) { console.error("String de data inválida ao recriar Manutencao:", obj.data); return null; }
        try {
            return new Manutencao(dataObj, obj.tipo, obj.custo, obj.descricao || '');
        } catch (error) {
            console.error("Erro ao recriar instância de Manutencao:", error.message, obj); return null;
        }
    }
}

// --- Classe Veiculo (Base) ---
class Veiculo {
    constructor(modelo, cor, imagem) {
        this.modelo = modelo;
        this.cor = cor;
        this.imagem = imagem;
        this.ligado = false;
    }
    ligar() { if (!this.ligado) { this.ligado = true; return true; } return false; }
    desligar() { const v = typeof this.velocidade === 'number' ? this.velocidade : 0; if (this.ligado && v <= 0) { this.ligado = false; return true; } if (v > 0) alert(`Não desligar ${this.modelo} em movimento (V: ${v} km/h).`); return false; }
    buzinar() { return true; } // Som tratado fora
    exibirInformacoesBase() { const s = this.ligado ? 'Ligado' : 'Desligado'; return `Mod: ${this.modelo}, Cor: ${this.cor}, Status: ${s}`; }
}

// --- Classe Carro ---
class Carro extends Veiculo {
    constructor(modelo, cor, imagem) {
        super(modelo, cor, imagem);
        this.velocidade = 0; this.maxVelocidade = 180; this.quilometragem = 0;
        /** @type {Manutencao[]} */ this.historicoManutencoes = [];
    }
    acelerar(inc = 10) { const n = Number(inc); if(isNaN(n)||n<=0||!this.ligado) { if (!this.ligado) alert(`Ligue ${this.modelo}`); return false; } if (this.velocidade >= this.maxVelocidade) { alert(`Max vel (${this.maxVelocidade})`); return false; } this.velocidade = Math.min(this.velocidade + n, this.maxVelocidade); return true; }
    frear(dec = 10) { const n = Number(dec); if(isNaN(n)||n<=0||this.velocidade===0) return false; this.velocidade = Math.max(0, this.velocidade - n); return true; }
    rodar(distancia) { const dist = Number(distancia); if(isNaN(dist)||dist<=0) { alert("Distância inválida."); return false; } if (!this.ligado) { alert(`${this.modelo} precisa estar ligado.`); return false; } this.quilometragem += dist; return true; }

    registrarManutencao(data, tipo, custo, descricao = '') {
        try {
            const novaManutencao = new Manutencao(data, tipo, custo, descricao);
            this.historicoManutencoes.push(novaManutencao);
            this.historicoManutencoes.sort((a, b) => b.data.getTime() - a.data.getTime()); // Mantém ordenado
            return true;
        } catch (error) { console.error(`Erro Manut: ${error.message}`); alert(`Erro Manut: ${error.message}`); return false; }
    }

    // Métodos que retornam DADOS (arrays filtrados e ordenados)
    getPastMaintenances() {
        const agora = new Date();
        return this.historicoManutencoes
            .filter(m => m.data <= agora)
            .sort((a, b) => b.data.getTime() - a.data.getTime()); // Reordena por segurança
    }
    getFutureMaintenances() {
        const agora = new Date();
        return this.historicoManutencoes
            .filter(m => m.data > agora)
            .sort((a, b) => a.data.getTime() - b.data.getTime()); // Reordena por segurança
    }
}

// --- Classe CarroEsportivo ---
class CarroEsportivo extends Carro {
    constructor(modelo, cor, imagem) { super(modelo, cor, imagem); this.turboAtivado = false; this.maxVelocidade = 350; }
    acelerar(inc = 25) { const n = Number(inc); if(isNaN(n)||n<=0||!this.ligado) { if (!this.ligado) alert(`Ligue ${this.modelo}`); return false; } if (this.velocidade >= this.maxVelocidade) { alert(`Max vel (${this.maxVelocidade})`); return false; } const boost = this.turboAtivado ? n * 1.8 : n; this.velocidade = Math.min(this.velocidade + boost, this.maxVelocidade); return true; }
    frear(dec = 15) { return super.frear(dec); }
    ativarTurbo() { if(this.ligado && !this.turboAtivado){ this.turboAtivado=true; return true;} if (!this.ligado) alert("Ligue o carro!"); else alert("Turbo já ON"); return false; }
    desativarTurbo() { if(this.turboAtivado){ this.turboAtivado=false; return true;} alert("Turbo já OFF"); return false; }
}

// --- Classe Caminhao ---
class Caminhao extends Carro {
    constructor(modelo, cor, cap, img) { super(modelo, cor, img); this.capacidadeCarga = Number(cap) || 0; this.cargaAtual = 0; this.maxVelocidade = 120; }
    acelerar(inc = 5) { const n = Number(inc); if(isNaN(n)||n<=0||!this.ligado) { if (!this.ligado) alert(`Ligue ${this.modelo}`); return false; } if (this.velocidade >= this.maxVelocidade) { alert(`Max vel (${this.maxVelocidade})`); return false; } const f = this.capacidadeCarga > 0 ? 1 - (this.cargaAtual / (this.capacidadeCarga * 2)) : 1; const boost = n * Math.max(0.3, f); this.velocidade = Math.min(this.velocidade + boost, this.maxVelocidade); return true; }
    frear(dec = 5) { return super.frear(dec); }
    carregar(peso) { const p = Number(peso); if (isNaN(p) || p <= 0) { alert("Peso inválido."); return false; } if (this.cargaAtual + p > this.capacidadeCarga) { alert(`Carga excedida (Max:${this.capacidadeCarga}, Atual:${this.cargaAtual})`); return false; } this.cargaAtual += p; return true; }
    descarregar(peso) { const p = Number(peso); if (isNaN(p) || p <= 0) { alert("Peso inválido."); return false; } if (p > this.cargaAtual) { alert(`Descarregar ${p}kg? Só tem ${this.cargaAtual}kg`); return false; } this.cargaAtual -= p; return true; }
}


// ==========================================================================
//                      PERSISTÊNCIA (LocalStorage)
// ==========================================================================

/**
 * *** HELPER LS ***
 * Prepara os dados de um veículo para serem salvos no LocalStorage.
 * Converte datas de manutenção para string ISO.
 * @param {Veiculo | null} vehicle - A instância do veículo.
 * @returns {object | null} Objeto plano pronto para JSON.stringify ou null.
 */
function prepareVehicleDataForStorage(vehicle) {
    if (!vehicle) return null;
    try {
        // Cria uma cópia plana dos dados
        const data = { ...vehicle };
        // Converte o histórico para objetos planos com data ISO
        if (Array.isArray(vehicle.historicoManutencoes)) {
            data.historicoManutencoes = vehicle.historicoManutencoes.map(manut => {
                if (!(manut instanceof Manutencao)) return null; // Ignora itens inválidos
                return {
                    ...manut, // Copia tipo, custo, descricao
                    data: manut.data.toISOString() // Converte Date para string ISO
                };
            }).filter(item => item !== null); // Remove nulos
        } else {
            data.historicoManutencoes = []; // Garante que é um array
        }
        return data;
    } catch (error) {
        console.error(`Erro ao preparar dados de ${vehicle.modelo} para storage:`, error);
        return null; // Retorna null se houver erro na preparação
    }
}

/**
 * *** HELPER LS ***
 * Recria uma instância de veículo a partir de dados planos do LocalStorage.
 * @param {object} itemData - O objeto contendo { tipo: string, dados: object }.
 * @returns {Veiculo | null} A instância recriada ou null em caso de erro.
 */
function recreateVehicleFromData(itemData) {
    if (!itemData || !itemData.tipo || !itemData.dados) {
        console.warn("Dados inválidos para recriar veículo:", itemData);
        return null;
    }

    const d = itemData.dados;
    let vehicleInstance = null;

    try {
        // 1. Cria a instância da classe correta
        switch (itemData.tipo) {
            case 'Carro':
                vehicleInstance = new Carro(d.modelo, d.cor, d.imagem);
                break;
            case 'CarroEsportivo':
                vehicleInstance = new CarroEsportivo(d.modelo, d.cor, d.imagem);
                break;
            case 'Caminhao':
                vehicleInstance = new Caminhao(d.modelo, d.cor, d.capacidadeCarga, d.imagem);
                break;
            default:
                throw new Error(`Tipo de veículo desconhecido: ${itemData.tipo}`);
        }

        // 2. Restaura estado comum
        vehicleInstance.ligado = d.ligado || false;
        vehicleInstance.velocidade = d.velocidade || 0;
        vehicleInstance.quilometragem = d.quilometragem || 0;
        if (d.maxVelocidade) vehicleInstance.maxVelocidade = d.maxVelocidade;

        // 3. Restaura estado específico (se aplicável)
        if (vehicleInstance instanceof CarroEsportivo) {
            vehicleInstance.turboAtivado = d.turboAtivado || false;
        } else if (vehicleInstance instanceof Caminhao) {
            vehicleInstance.cargaAtual = d.cargaAtual || 0;
            // Garante que capacidadeCarga esteja correta (já pega do construtor, mas podemos verificar)
            if (d.capacidadeCarga) vehicleInstance.capacidadeCarga = Number(d.capacidadeCarga) || 0;
        }

        // 4. Recria o histórico de manutenção
        if (Array.isArray(d.historicoManutencoes)) {
            vehicleInstance.historicoManutencoes = d.historicoManutencoes
                .map(histObj => Manutencao.fromPlainObject(histObj))
                .filter(manut => manut !== null); // Filtra nulos de erros na recriação
            // Reordena após recriar para garantir consistência
            vehicleInstance.historicoManutencoes.sort((a, b) => b.data.getTime() - a.data.getTime());
        } else {
            vehicleInstance.historicoManutencoes = [];
        }

        return vehicleInstance;

    } catch (error) {
        console.error(`Erro ao recriar veículo do tipo ${itemData.tipo} (${d?.modelo}):`, error);
        return null; // Retorna null se a recriação falhar
    }
}


/**
 * Salva o estado atual dos veículos (carro, carroEsportivo, caminhao) no LocalStorage.
 */
function salvarVeiculosNoLocalStorage() {
    const veiculosParaSalvar = [];

    const dadosCarro = prepareVehicleDataForStorage(carro);
    if (dadosCarro) veiculosParaSalvar.push({ tipo: 'Carro', dados: dadosCarro });

    const dadosEsportivo = prepareVehicleDataForStorage(carroEsportivo);
    if (dadosEsportivo) veiculosParaSalvar.push({ tipo: 'CarroEsportivo', dados: dadosEsportivo });

    const dadosCaminhao = prepareVehicleDataForStorage(caminhao);
    if (dadosCaminhao) veiculosParaSalvar.push({ tipo: 'Caminhao', dados: dadosCaminhao });

    try {
        if (veiculosParaSalvar.length > 0) {
            const jsonString = JSON.stringify(veiculosParaSalvar);
            localStorage.setItem(LOCAL_STORAGE_KEY, jsonString);
            console.log(`${veiculosParaSalvar.length} veículo(s) salvo(s) no LocalStorage.`);
        } else {
            // Se não há veículos, remove a chave do LS para evitar carregar array vazio
            localStorage.removeItem(LOCAL_STORAGE_KEY);
            console.log("Nenhum veículo para salvar. LocalStorage limpo.");
        }
    } catch (error) {
        console.error("Erro CRÍTICO ao salvar no LocalStorage:", error);
        showNotification("❌ Erro ao salvar dados! O armazenamento pode estar cheio.", 'error', 0); // Notificação persistente
    }
}

/**
 * Carrega os veículos do LocalStorage ao iniciar a página.
 */
function carregarVeiculosDoLocalStorage() {
    const dadosSalvos = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!dadosSalvos) {
        console.log("Nenhum dado salvo encontrado.");
        mostrarInformacoes(null); // Mostra placeholder
        return;
    }

    try {
        const veiculosSalvos = JSON.parse(dadosSalvos);

        // Limpa variáveis globais antes de carregar
        carro = null;
        carroEsportivo = null;
        caminhao = null;
        let primeiroVeiculoCarregado = null;

        veiculosSalvos.forEach(itemData => {
            const veiculoRecriado = recreateVehicleFromData(itemData);

            if (veiculoRecriado) {
                // Atribui à variável global correta
                if (veiculoRecriado instanceof CarroEsportivo) { carroEsportivo = veiculoRecriado; }
                else if (veiculoRecriado instanceof Caminhao) { caminhao = veiculoRecriado; }
                else if (veiculoRecriado instanceof Carro) { carro = veiculoRecriado; }

                if (!primeiroVeiculoCarregado) {
                    primeiroVeiculoCarregado = veiculoRecriado; // Guarda o primeiro para exibir
                }
                atualizarUIComVeiculoCarregado(veiculoRecriado); // Atualiza inputs/imagem na tela
                console.log(`${itemData.tipo} "${veiculoRecriado.modelo}" carregado.`);
            }
        });

        // Mostra informações do primeiro veículo carregado com sucesso
        mostrarInformacoes(primeiroVeiculoCarregado);
        if (primeiroVeiculoCarregado) {
             showNotification("🚗 Dados da garagem carregados!", 'info', 3000);
        }


    } catch (error) {
        console.error("Erro GERAL ao carregar/processar LocalStorage:", error);
        showNotification("❌ Erro ao carregar dados salvos! Podem estar corrompidos.", 'error', 0);
        localStorage.removeItem(LOCAL_STORAGE_KEY); // Limpa dados corrompidos
        mostrarInformacoes(null); // Mostra placeholder
    }
}


// ==========================================================================
//                      LÓGICA DE EXIBIÇÃO E INTERFACE
// ==========================================================================

/**
 * *** HELPER Display ***
 * Gera o HTML para uma lista de manutenções (passadas ou futuras).
 * @param {Manutencao[]} maintenances - Array de objetos Manutencao.
 * @param {string} listClass - Classe CSS para o <ul> (ex: 'maintenance-list').
 * @param {string} emptyMessage - Mensagem a exibir se o array estiver vazio.
 * @returns {string} String HTML da lista.
 */
function generateMaintenanceListHtml(maintenances, listClass, emptyMessage) {
    if (!maintenances || maintenances.length === 0) {
        return `<p>${emptyMessage}</p>`;
    }
    let listHtml = `<ul class="${listClass}">`;
    maintenances.forEach(manut => {
        // Usa o método da instância Manutencao para formatar cada item
        listHtml += `<li>${manut.getDetalhesFormatados()}</li>`;
    });
    listHtml += '</ul>';
    return listHtml;
}

/**
 * *** HELPER Display ***
 * Gera o HTML completo para exibir as informações de um veículo no painel.
 * @param {Veiculo | null} vehicle - O objeto do veículo.
 * @returns {string} String HTML para a div #informacoesVeiculo.
 */
function generateVehicleDisplayHtml(vehicle) {
    if (!vehicle) {
        return '<p class="placeholder">Selecione um veículo acima ou crie um novo abaixo para ver os detalhes.</p>';
    }

    // --- Dados Básicos ---
    const modelo = vehicle.modelo || 'N/A';
    const cor = vehicle.cor || 'N/A';
    const imagemUrl = vehicle.imagem || 'placeholder.png';
    const estaLigado = vehicle.ligado || false;
    const km = (typeof vehicle.quilometragem === 'number') ? vehicle.quilometragem.toFixed(0) : 'N/A';
    const velocidade = (typeof vehicle.velocidade === 'number') ? vehicle.velocidade.toFixed(0) : 'N/A';
    const maxVelocidade = (typeof vehicle.maxVelocidade === 'number') ? vehicle.maxVelocidade : 0;
    const statusClass = estaLigado ? 'status-ligado' : 'status-desligado';
    const statusText = estaLigado ? 'Ligado' : 'Desligado';

    // --- Dados Específicos ---
    let detalhesEspecificosHtml = '';
    if (vehicle instanceof CarroEsportivo) {
        const turboStatus = vehicle.turboAtivado ? 'Ativado' : 'Desativado';
        detalhesEspecificosHtml = `<div class="info-item"><strong>Turbo:</strong> ${turboStatus}</div>`;
    } else if (vehicle instanceof Caminhao) {
        detalhesEspecificosHtml = `
            <div class="info-item"><strong>Capacidade:</strong> ${vehicle.capacidadeCarga || 0} kg</div>
            <div class="info-item"><strong>Carga Atual:</strong> ${vehicle.cargaAtual || 0} kg</div>
        `;
    }

    // --- Barra de Velocidade ---
    let speedBarHtml = '';
    if (maxVelocidade > 0 && typeof vehicle.velocidade === 'number') { // Verifica se velocidade existe
        const speedPercent = Math.max(0, Math.min(100, (vehicle.velocidade / maxVelocidade) * 100));
        speedBarHtml = `
            <div class="speed-bar-container">
                <div class="speed-bar-label">Velocidade (${velocidade} / ${maxVelocidade} km/h):</div>
                <div class="speed-bar">
                    <div class="speed-bar-fill" style="width: ${speedPercent.toFixed(2)}%;"></div>
                </div>
            </div>`;
    }

    // --- Manutenções (usando métodos da classe e helper de lista) ---
    const pastMaintenances = vehicle.getPastMaintenances ? vehicle.getPastMaintenances() : [];
    const futureMaintenances = vehicle.getFutureMaintenances ? vehicle.getFutureMaintenances() : [];

    const historicoHtml = generateMaintenanceListHtml(
        pastMaintenances,
        'maintenance-list',
        'Nenhuma manutenção passada registrada.'
    );
    const agendamentosHtml = generateMaintenanceListHtml(
        futureMaintenances,
        'schedule-list',
        'Nenhum agendamento futuro.'
    );

    // --- Monta o HTML Final ---
    return `
        <div class="info-header" style="display: flex; align-items: center; gap: 20px; margin-bottom: 20px; flex-wrap: wrap;">
             <img src="${imagemUrl}" alt="Imagem de ${modelo}" style="width: 100px; height: 100px; border-radius: 50%; border: 3px solid ${estaLigado ? 'var(--accent-color)' : 'var(--danger-color)'}; object-fit: cover; flex-shrink: 0;">
             <div style="flex-grow: 1;">
                <h3 style="margin: 0 0 5px 0; color: var(--primary-color);">${modelo}</h3>
                <div class="info-item"><strong>Cor:</strong> ${cor}</div>
                <div class="info-item"><strong>Status:</strong> <span class="status ${statusClass}">${statusText}</span></div>
                <div class="info-item"><strong>KM:</strong> ${km}</div>
                 ${detalhesEspecificosHtml}
             </div>
        </div>
        ${speedBarHtml}
        <div class="info-section maintenance-history">
            <h4>Histórico de Manutenção</h4>
            ${historicoHtml}
        </div>
        <div class="info-section maintenance-schedule">
            <h4>Agendamentos Futuros</h4>
            ${agendamentosHtml}
        </div>
    `;
}

/**
 * Atualiza o painel de informações do veículo na tela.
 * @param {Veiculo | null} vehicle - O veículo a ser exibido, ou null para limpar.
 */
function mostrarInformacoes(vehicle) {
    if (!divInformacoes) return; // Sai se a div não existir

    // Gera o HTML usando o helper
    const displayHtml = generateVehicleDisplayHtml(vehicle);
    divInformacoes.innerHTML = displayHtml;

    // Verifica agendamentos apenas se um veículo válido foi exibido
    if (vehicle) {
        verificarAgendamentosProximos(vehicle);
    }
}

/**
 * Exibe uma notificação não bloqueante na tela.
 */
function showNotification(message, type = 'info', duration = 5000) {
    if (!notificationArea) { console.warn("Área de notificação não encontrada."); return; }
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.setAttribute('role', 'alert');
    notification.innerHTML = `${message}<button class="close-btn" aria-label="Fechar" title="Fechar">×</button>`;
    const closeButton = notification.querySelector('.close-btn');
    let timeoutId = null;
    const removeNotification = () => { clearTimeout(timeoutId); notification.remove(); };
    closeButton.addEventListener('click', removeNotification);
    notificationArea.appendChild(notification);
    if (duration > 0) { timeoutId = setTimeout(removeNotification, duration); }
}

/**
 * Verifica agendamentos futuros e mostra notificações de lembrete.
 */
function verificarAgendamentosProximos(veiculo) {
    if (!veiculo || !veiculo.getFutureMaintenances) return; // Verifica se o método existe

    const futureMaintenances = veiculo.getFutureMaintenances();
    if (!futureMaintenances || futureMaintenances.length === 0) return;

    const agora = Date.now();
    const UM_DIA = 24 * 60 * 60 * 1000;
    const UMA_SEMANA = 7 * UM_DIA;

    futureMaintenances.forEach(manut => {
        const dataAgendamento = manut.data.getTime();
        // Evita notificar repetidamente na mesma sessão
        if (!manut._notifiedRecently) {
            const diff = dataAgendamento - agora;
            let notify = false;
            let message = '';
            const dataFormatada = manut.data.toLocaleDateString('pt-BR');
            const horaFormatada = manut.data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

            if (diff <= UM_DIA) { // Menos de 1 dia
                message = `⏰ HOJE/AMANHÃ: "${manut.tipo}" p/ <b>${veiculo.modelo}</b> às ${horaFormatada}.`;
                notify = true;
            } else if (diff <= UMA_SEMANA) { // Menos de 1 semana
                message = `🗓️ Próx. Semana: "${manut.tipo}" p/ <b>${veiculo.modelo}</b> em ${dataFormatada}.`;
                notify = true;
            }

            if (notify) {
                showNotification(message, 'warning', 10000); // Dura 10s
                manut._notifiedRecently = true; // Flag temporária
            }
        }
    });
}

/**
 * Função auxiliar para tocar sons.
 */
function playSound(audioObject) {
    if (!audioObject || !(audioObject instanceof Audio)) return;
    audioObject.pause();
    audioObject.currentTime = 0;
    const playPromise = audioObject.play();
    if (playPromise) {
        playPromise.catch(error => console.warn(`Erro ao tocar som: ${error.message}`));
    }
}

/**
 * Decide qual som tocar baseado na ação e tipo de veículo.
 */
function tocarSomCorrespondente(veiculo, acao) {
    let soundToPlay = null;
    switch (acao) {
        case 'ligar': soundToPlay = soundMap.ligar; break;
        case 'desligar': soundToPlay = soundMap.desligar; break;
        case 'acelerar': soundToPlay = soundMap.acelerar; break;
        case 'frear': soundToPlay = soundMap.frear; break;
        case 'buzinar':
            if (veiculo instanceof Caminhao) soundToPlay = soundMap.buzinar_caminhao;
            else if (veiculo instanceof CarroEsportivo) soundToPlay = soundMap.buzinar_esportivo;
            else soundToPlay = soundMap.buzinar_carro;
            break;
    }
    if (soundToPlay) playSound(soundToPlay);
}

/**
 * Atualiza o atributo 'src' e o fallback de erro de um elemento <img>.
 */
function atualizarImagem(imgId, novaUrl) {
    const imgElement = document.getElementById(imgId);
    if (imgElement) {
        imgElement.src = novaUrl || 'placeholder.png';
        imgElement.onerror = () => {
            imgElement.src = 'placeholder.png'; // Imagem padrão em caso de erro
            imgElement.onerror = null; // Evita loop
        };
    }
}

/**
 * Preenche os campos de input na UI com os dados de um veículo carregado.
 */
function atualizarUIComVeiculoCarregado(veiculo) {
    let prefixoId = '';
    let imgId = '';
    if (veiculo instanceof CarroEsportivo) { prefixoId = 'Esportivo'; imgId = 'imgEsportivo'; }
    else if (veiculo instanceof Caminhao) { prefixoId = 'Caminhao'; imgId = 'imgCaminhao'; }
    else if (veiculo instanceof Carro) { prefixoId = 'Carro'; imgId = 'imgCarro'; }
    else return;

    const setVal = (id, value) => { const el = document.getElementById(id); if (el) el.value = value ?? ''; };
    setVal(`modelo${prefixoId}`, veiculo.modelo);
    setVal(`cor${prefixoId}`, veiculo.cor);
    setVal(`imagem${prefixoId}`, veiculo.imagem);
    atualizarImagem(imgId, veiculo.imagem);
    if (prefixoId === 'Caminhao') { setVal('capacidadeCarga', veiculo.capacidadeCarga); }
    // Poderia atualizar KM ou outros campos aqui se existissem na UI de criação/edição
}

/**
 * Função central para interagir com os veículos. Chama o método apropriado,
 * atualiza a UI, toca som e salva no LocalStorage se necessário.
 * @returns {boolean} True se a ação foi bem-sucedida, false caso contrário.
 */
function interagir(veiculo, acao, ...args) {
    if (!veiculo) { alert("❗ Crie ou selecione o veículo primeiro!"); return false; }
    let sucesso = false;
    if (typeof veiculo[acao] === 'function') {
        try {
            sucesso = veiculo[acao](...args);
            if (typeof sucesso === 'undefined') sucesso = true; // Assume sucesso se não retornar nada e não der erro
        } catch (error) {
            console.error(`Erro na ação "${acao}" em ${veiculo.modelo}:`, error);
            alert(`❌ Erro: ${error.message}.`); // Usa alert para erros da lógica interna
            sucesso = false;
        }
    } else {
        alert(`❗ Operação inválida: Ação "${acao}" não encontrada.`);
        sucesso = false;
    }

    if (sucesso) {
        mostrarInformacoes(veiculo);
        tocarSomCorrespondente(veiculo, acao);
        const acoesQuePersistem = ['ligar','desligar','rodar','ativarTurbo','desativarTurbo','carregar','descarregar','registrarManutencao'];
        if (acoesQuePersistem.includes(acao)) {
            salvarVeiculosNoLocalStorage();
        }
    }
    return sucesso; // Retorna o resultado para a função chamadora (UI)
}

// ==========================================================================
//                      FUNÇÕES DE UI (Handlers de Eventos)
// ==========================================================================

// --- Funções de Criação de Veículos ---
function criarCarro() {
    const modelo = document.getElementById("modeloCarro")?.value || "Sedan";
    const cor = document.getElementById("corCarro")?.value || "Cinza";
    const imagemUrl = document.getElementById("imagemCarro")?.value || "OIP.jpg";
    carro = new Carro(modelo, cor, imagemUrl);
    atualizarImagem('imgCarro', carro.imagem);
    mostrarInformacoes(carro);
    salvarVeiculosNoLocalStorage();
    showNotification(`🚗 Carro "${modelo}" criado/atualizado!`, 'success');
}
function criarCarroEsportivo() {
    const modelo = document.getElementById("modeloEsportivo")?.value || "Ferrari F8";
    const cor = document.getElementById("corEsportivo")?.value || "Vermelha";
    const imagemUrl = document.getElementById("imagemEsportivo")?.value || "OIP (1).jpg";
    carroEsportivo = new CarroEsportivo(modelo, cor, imagemUrl);
    atualizarImagem('imgEsportivo', carroEsportivo.imagem);
    mostrarInformacoes(carroEsportivo);
    salvarVeiculosNoLocalStorage();
     showNotification(`🏎️ Esportivo "${modelo}" criado/atualizado!`, 'success');
}
function criarCaminhao() {
    const modelo = document.getElementById("modeloCaminhao")?.value || "Scania R450";
    const cor = document.getElementById("corCaminhao")?.value || "Branco";
    const capacidadeCarga = document.getElementById("capacidadeCarga")?.value || 25000;
    const imagemUrl = document.getElementById("imagemCaminhao")?.value || "oip2.jpg";
    caminhao = new Caminhao(modelo, cor, capacidadeCarga, imagemUrl);
    atualizarImagem('imgCaminhao', caminhao.imagem);
    mostrarInformacoes(caminhao);
    salvarVeiculosNoLocalStorage();
    showNotification(`🚚 Caminhão "${modelo}" criado/atualizado!`, 'success');
}

// --- Funções de UI para Manutenção ---
function registrarManutencaoUI(veiculo, tipoVeiculoString) {
    if (!veiculo) { alert(`❗ Selecione/crie o ${tipoVeiculoString}.`); return; }
    const tipoInput = document.getElementById(`manutTipo${tipoVeiculoString}`);
    const custoInput = document.getElementById(`manutCusto${tipoVeiculoString}`);
    const descInput = document.getElementById(`manutDesc${tipoVeiculoString}`);
    if (!tipoInput || !custoInput || !descInput) { console.error(`Inputs REGISTRO ${tipoVeiculoString} não encontrados.`); return; }

    const tipo = tipoInput.value.trim();
    const custoStr = custoInput.value.replace(',', '.');
    const custo = parseFloat(custoStr);
    const descricao = descInput.value.trim();

    if (!tipo) { alert("❗ Informe o tipo de serviço."); tipoInput.focus(); return; }
    if (isNaN(custo) || custo < 0) { alert("❗ Informe um custo válido (>= 0)."); custoInput.focus(); return; }

    const sucesso = interagir(veiculo, 'registrarManutencao', new Date(), tipo, custo, descricao);
    if (sucesso) {
        showNotification(`✅ Manutenção "${tipo}" registrada p/ ${veiculo.modelo}!`, 'success', 4000);
        tipoInput.value = ''; custoInput.value = ''; descInput.value = ''; // Limpa campos
    }
}

function agendarManutencaoUI(veiculo, tipoVeiculoString) {
    if (!veiculo) { alert(`❗ Selecione/crie o ${tipoVeiculoString}.`); return; }
    const dataInput = document.getElementById(`agendamentoData${tipoVeiculoString}`);
    const tipoInput = document.getElementById(`agendamentoTipo${tipoVeiculoString}`);
    const descInput = document.getElementById(`agendamentoDesc${tipoVeiculoString}`);
     if (!dataInput || !tipoInput || !descInput) { console.error(`Inputs AGENDAMENTO ${tipoVeiculoString} não encontrados.`); return; }

    const dataString = dataInput.value;
    const tipo = tipoInput.value.trim();
    const descricao = descInput.value.trim();

    if (!dataString) { alert("❗ Selecione data/hora do agendamento."); dataInput.focus(); return; }
    if (!tipo) { alert("❗ Informe o tipo de serviço agendado."); tipoInput.focus(); return; }

    const dataAgendada = new Date(dataString);
    if (isNaN(dataAgendada.getTime())) { alert("❗ Data/hora inválida."); dataInput.focus(); return; }
    if (dataAgendada <= new Date()) { alert("❗ Agendamento deve ser no futuro."); dataInput.focus(); return; }

    const sucesso = interagir(veiculo, 'registrarManutencao', dataAgendada, tipo, 0, descricao); // Custo 0 para agendamento
    if (sucesso) {
        showNotification(`🗓️ Serviço "${tipo}" agendado p/ ${veiculo.modelo}!`, 'success', 4000);
        dataInput.value = ''; tipoInput.value = ''; descInput.value = ''; // Limpa campos
    }
}

// ==========================================================================
//                         INICIALIZAÇÃO E EVENT LISTENERS
// ==========================================================================

// --- Event Listeners para Botões de Seleção Rápida ---
document.getElementById('btnInfoCarro')?.addEventListener('click', () => mostrarInformacoes(carro));
document.getElementById('btnInfoEsportivo')?.addEventListener('click', () => mostrarInformacoes(carroEsportivo));
document.getElementById('btnInfoCaminhao')?.addEventListener('click', () => mostrarInformacoes(caminhao));
// OBS: Os botões de ação e manutenção dentro das seções já possuem 'onclick' diretamente no HTML.

// --- Carregar Dados ao Iniciar ---
window.addEventListener('load', carregarVeiculosDoLocalStorage);

// --- FIM DO SCRIPT ---
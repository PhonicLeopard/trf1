# Garagem Inteligente PRO 🚗💨

## Visão Geral

Garagem Inteligente PRO é uma aplicação web interativa para o gerenciamento de uma frota de veículos. Construída com HTML, CSS e JavaScript puro com forte orientação a objetos, a aplicação permite criar, interagir e gerenciar a manutenção de três tipos distintos de veículos: um Carro Comum, um Carro Esportivo e um Caminhão.

O estado da garagem é salvo localmente no navegador usando `LocalStorage`, garantindo que os dados dos veículos e seus históricos de manutenção persistam entre as sessões.

## ✨ Funcionalidades Principais

- **Criação e Atualização de Veículos**: Defina o modelo, cor, imagem e propriedades específicas (como capacidade de carga para caminhões) para cada veículo.
- **Interação Polimórfica**: Cada veículo responde a ações de forma única:
    - `ligar()` / `desligar()`: Controla o estado do motor.
    - `acelerar()` / `frear()`: Modifica a velocidade com incrementos específicos para cada tipo.
    - `buzinar()`: Toca um som de buzina diferente para cada veículo.
    - **Ações Específicas**: Ative o turbo em carros esportivos ou carregue/descarregue caminhões.
- **Gerenciamento de Manutenção**:
    - **Registro de Histórico**: Adicione registros de manutenções realizadas, incluindo tipo de serviço, custo e descrição.
    - **Agendamento Futuro**: Agende serviços futuros e receba lembretes na interface.
- **Painel Dinâmico**: Um painel central exibe em tempo real todas as informações do veículo selecionado, incluindo status, velocidade (com uma barra visual), quilometragem e listas de manutenção.
- **Persistência de Dados**: Todos os veículos e suas informações são salvos no `LocalStorage` do navegador, recarregando seu último estado ao abrir a aplicação.
- **Feedback ao Usuário**: A interface fornece notificações visuais para ações bem-sucedidas (criação, agendamento) e efeitos sonoros para interações com os veículos.
- **Design Responsivo**: A interface se adapta a diferentes tamanhos de tela, de desktops a dispositivos móveis.

## 🚀 Como Executar Localmente

O projeto não requer um servidor web ou dependências complexas. Para executá-lo:

1.  **Clone o repositório:**
    ```bash
    git clone <URL_DO_SEU_REPOSITORIO>
    ```
2.  **Navegue até a pasta do projeto:**
    ```bash
    cd <NOME_DA_PASTA>
    ```
3.  **Abra o arquivo `index.html`:**
    -   Simplesmente abra o arquivo `index.html` no seu navegador de preferência (Google Chrome, Firefox, etc.).

A aplicação estará pronta para uso.

## 📂 Estrutura do Projeto

**Nota:** Para uma melhor escalabilidade, o arquivo `script.js` poderia ser futuramente dividido, com cada classe em seu próprio arquivo dentro de uma pasta `/js/classes/`.

## 🛠️ Tecnologias Utilizadas

-   **HTML5**: Para a estrutura semântica da aplicação.
-   **CSS3**: Para estilização, layout (Grid), variáveis e responsividade.
-   **JavaScript (ES6+)**: Para toda a lógica, interatividade e manipulação do DOM. O código é fortemente baseado em Programação Orientada a Objetos (Classes, Herança, Polimorfismo).
-   **JSDoc**: Para documentação do código JavaScript.
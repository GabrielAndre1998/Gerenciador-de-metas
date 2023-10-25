document.addEventListener("DOMContentLoaded", function () {
    // Aguarda o evento "DOMContentLoaded" antes de executar o código
    const goalInput = document.getElementById("goal-input"); // Obtém a referência para o campo de entrada de metas
    const addGoalButton = document.getElementById("add-goal"); // Obtém a referência para o botão "Adicionar Meta"
    const goalList = document.getElementById("goal-list"); // Obtém a referência para a lista de metas
    const totalGoalsCount = document.getElementById("total-goals"); // Obtém a referência para o contador de metas totais
    const completedGoalsCount = document.getElementById("completed-goals"); // Obtém a referência para o contador de metas concluídas
    const remainingGoalsCount = document.getElementById("remaining-goals"); // Obtém a referência para o contador de metas restantes
    const motivationalMessages = [
        "Parabéns! Você alcançou uma meta!",
        "Incrível! Mais uma conquista no caminho!",
        "Belo trabalho! Continue assim!",
        "Você está fazendo progresso! Mantenha-se focado!",
        "Meta concluída! Continue sonhando alto!",
    ]; // Lista de mensagens motivacionais

    let savedGoals = JSON.parse(localStorage.getItem("goals")) || []; // Carrega as metas salvas do armazenamento local ou inicializa como um array vazio
    let messageTimeout;

    // Atualiza os contadores de metas na página
    function updateCounters() {
        totalGoalsCount.textContent = savedGoals.length; // Atualiza o contador de metas totais
        const completedCount = savedGoals.filter(goal => goal.completed).length; // Calcula o número de metas concluídas
        completedGoalsCount.textContent = completedCount; // Atualiza o contador de metas concluídas
        remainingGoalsCount.textContent = savedGoals.length - completedCount; // Calcula e atualiza o contador de metas restantes
    }

    // Salva as metas no armazenamento local
    function saveGoals() {
        localStorage.setItem("goals", JSON.stringify(savedGoals)); // Converte as metas em JSON e as armazena no armazenamento local
        updateCounters(); // Atualiza os contadores após salvar as metas
    }

    // Exibe uma mensagem motivacional ao concluir uma meta
    function displayMotivationalMessage() {
        const message = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)]; // Seleciona aleatoriamente uma mensagem motivacional

        Swal.fire({
            title: "Conquista Desbloqueada!", // Título da janela modal
            text: message, // Conteúdo da mensagem
            icon: "success", // Ícone de sucesso
            timer: 2000, // Tempo em milissegundos que a mensagem é exibida
            showConfirmButton: false, // Oculta o botão de confirmação na janela modal
        });

        // Oculta a mensagem após 3 segundos
        messageTimeout = setTimeout(() => {
            Swal.close(); // Fecha a janela modal
        }, 2000); // 2000 milissegundos (2 segundos)
    }

    // Inicializa os contadores de metas na página
    updateCounters();

    // Adiciona um ouvinte de evento para o clique no botão "Adicionar Meta"
    addGoalButton.addEventListener("click", function () {
        const goalText = goalInput.value.trim(); // Obtém o texto da meta e remove espaços em branco
        if (goalText === "") return; // Se o texto da meta estiver vazio, não faz nada

        const goal = { text: goalText, completed: false }; // Cria um objeto de meta
        savedGoals.push(goal); // Adiciona a meta ao array de metas salvas
        saveGoals(); // Salva as metas
        const li = createGoalElement(goal); // Cria um elemento de meta na lista
        goalList.appendChild(li); // Adiciona o elemento à lista
        goalInput.value = ""; // Limpa o campo de entrada
    });

    // Função para criar um elemento de meta na lista
    function createGoalElement(goal) {
        const li = document.createElement("li"); // Cria um elemento <li> para representar a meta na lista
        li.innerHTML = `
            <span>${goal.text}</span> <!-- Adiciona o texto da meta -->
            <button class="remove-goal">Remover</button> <!-- Botão para remover a meta -->
            <button class="complete-goal">${goal.completed ? "Desconcluir" : "Concluir"}</button> <!-- Botão para concluir ou desconcluir a meta com base no status -->

        `;

        // Define o estilo com base no status da meta
        if (goal.completed) {
            li.style.backgroundColor = "rgb(144, 238, 144)"; // Verde mais fraco
        }

        // Evento para remover uma meta
        li.querySelector(".remove-goal").addEventListener("click", function () {
            goalList.removeChild(li); // Remove o elemento da lista
            const goalIndex = savedGoals.indexOf(goal); // Encontra o índice da meta no array de metas
            savedGoals.splice(goalIndex, 1); // Remove a meta do array
            saveGoals(); // Salva as metas atualizadas
        });

        // Evento para concluir ou desconcluir uma meta
        li.querySelector(".complete-goal").addEventListener("click", function () {
            goal.completed = !goal.completed; // Inverte o status da meta (concluída/desconcluída)
            saveGoals(); // Salva as metas atualizadas
            li.querySelector(".complete-goal").textContent = goal.completed ? "Desconcluir" : "Concluir"; // Atualiza o texto do botão
            li.classList.toggle("completed"); // Adiciona ou remove a classe "completed" para aplicar estilos
            if (goal.completed) {
                li.style.backgroundColor = "rgb(144, 238, 144)"; // Define o fundo verde para metas concluídas
                displayMotivationalMessage(); // Exibe uma mensagem motivacional
            } else {
                li.style.backgroundColor = "transparent"; // Remove o estilo de fundo
            }
        });

        return li; // Retorna o elemento de meta criado
    }

    // Cria elementos de meta na lista com base nas metas salvas
    savedGoals.forEach(goal => {
        const li = createGoalElement(goal); // Cria o elemento de meta
        goalList.appendChild(li); // Adiciona o elemento à lista
    });

    // Limpa o timeout da mensagem ao fechar a janela modal
    Swal.getPopup().addEventListener('click', function () {
        clearTimeout(messageTimeout); // Limpa o timeout da mensagem
    });
});

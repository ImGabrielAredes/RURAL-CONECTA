// Dentro do arquivo detalhesemprego.js

async function carregarDetalhesDaVaga(id) {
    const container = document.getElementById('detalhe-vaga-box');
    if (!container) return;

    try {
        let vaga = null;

        // 1. PRIMEIRO, tenta encontrar a vaga na memória da sessão (para vagas recém-criadas).
        const empregosTemporarios = sessionStorage.getItem('empregos_temp');
        if (empregosTemporarios) {
            const listaTemporaria = JSON.parse(empregosTemporarios);
            // Procura na lista da memória pelo ID correspondente.
            vaga = listaTemporaria.find(e => e.id == id); 
        }

        // 2. SE NÃO ENCONTROU na memória, busca na API (para vagas que já existiam).
        if (!vaga) {
            const response = await fetch(`/api/empregos/${id}`);
            if (!response.ok) {
                throw new Error(`A vaga com ID ${id} não foi encontrada (Status: ${response.status})`);
            }
            vaga = await response.json();
        }

        // 3. Se, depois de tudo, ainda não encontrou a vaga, exibe um erro.
        if (!vaga) {
             throw new Error(`A vaga com ID ${id} não foi encontrada em nenhum lugar.`);
        }
        
        // Se encontrou a vaga (seja na memória ou na API), exibe os dados.
        // A sua função de exibir os dados já está perfeita!
        exibirDadosDoProduto(vaga); 
        
    } catch (error) {
        console.error("Erro ao carregar detalhes da vaga:", error);
        container.innerHTML = '<h1>Vaga não encontrada</h1><p>Não foi possível carregar os detalhes desta vaga. Por favor, verifique o link ou tente novamente mais tarde.</p>';
    }
}


// A sua função de exibir os dados permanece a mesma.
// Renomeei para um nome mais genérico para refletir que ela agora exibe os detalhes da vaga.
function exibirDadosDoProduto(vaga) {
    document.getElementById('titulo-vaga').textContent = vaga.tituloVaga;
    document.getElementById('local-vaga').textContent = vaga.local;
    document.getElementById('descricao-vaga').textContent = vaga.descricao;
    document.getElementById('requisitos-vaga').textContent = vaga.requisitos;
    document.getElementById('responsavel-vaga').textContent = vaga.responsavel;
    document.getElementById('contato-vaga').textContent = vaga.contato;
}


// O resto do seu arquivo (o EventListener 'DOMContentLoaded') permanece o mesmo.
document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const vagaId = params.get('id');

    if (vagaId) {
        carregarDetalhesDaVaga(vagaId);
    } else {
        const container = document.getElementById('detalhe-vaga-box');
        if (container) {
            container.innerHTML = '<h1>Nenhuma vaga selecionada</h1><p>Por favor, volte para a página de empregos e selecione uma vaga.</p>';
        }
    }
});
// O script SÓ COMEÇA a rodar DEPOIS que o HTML estiver pronto.
document.addEventListener('DOMContentLoaded', () => {
    // 1. Pega os parâmetros da URL
    const params = new URLSearchParams(window.location.search);
    const vagaId = params.get('id');

    // 2. Se encontrou um ID, chama a função para carregar os detalhes
    if (vagaId) {
        carregarDetalhesDaVaga(vagaId);
    } else {
        // Opcional: Trata o caso de alguém acessar a página sem um ID
        const container = document.getElementById('detalhe-vaga-box');
        if (container) {
            container.innerHTML = '<h1>Nenhuma vaga selecionada</h1><p>Por favor, volte para a página de empregos e selecione uma vaga.</p>';
        }
    }
});
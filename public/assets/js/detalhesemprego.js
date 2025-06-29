// A função que busca os dados é declarada primeiro.
// Note o "async" antes de "function". É isso que nos permite usar "await" aqui dentro.
async function carregarDetalhesDaVaga(id) {
    const container = document.getElementById('detalhe-vaga-box');
    if (!container) {
        console.error('Elemento "detalhe-vaga-box" não encontrado no HTML.');
        return;
    }

    try {
        const response = await fetch(`/api/empregos/${id}`);
        
        if (!response.ok) {
            throw new Error(`A vaga com ID ${id} não foi encontrada (Status: ${response.status})`);
        }
        
        const vaga = await response.json();

        // Seleciona os elementos e preenche com os dados da vaga
        document.getElementById('titulo-vaga').textContent = vaga.tituloVaga;
        document.getElementById('local-vaga').textContent = vaga.local;
        document.getElementById('descricao-vaga').textContent = vaga.descricao;
        document.getElementById('requisitos-vaga').textContent = vaga.requisitos;
        document.getElementById('responsavel-vaga').textContent = vaga.responsavel;
        document.getElementById('contato-vaga').textContent = vaga.contato;
        
    } catch (error) {
        console.error("Erro ao carregar detalhes da vaga:", error);
        container.innerHTML = '<h1>Vaga não encontrada</h1><p>Não foi possível carregar os detalhes desta vaga. Por favor, verifique o link ou tente novamente mais tarde.</p>';
    }
}

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
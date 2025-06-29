
async function carregarDetalhesDaVaga(id) {
    const container = document.getElementById('detalhe-vaga-box');
    if (!container) return;

    try {
        let vaga = null;
        const empregosTemporarios = sessionStorage.getItem('empregos_temp');
        if (empregosTemporarios) {
            const listaTemporaria = JSON.parse(empregosTemporarios);
            vaga = listaTemporaria.find(e => e.id == id); 
        }

        if (!vaga) {
            const response = await fetch(`/api/empregos/${id}`);
            if (!response.ok) {
                throw new Error(`A vaga com ID ${id} não foi encontrada (Status: ${response.status})`);
            }
            vaga = await response.json();
        }

        if (!vaga) {
             throw new Error(`A vaga com ID ${id} não foi encontrada em nenhum lugar.`);
        }
        
        exibirDadosDoProduto(vaga); 
        
    } catch (error) {
        console.error("Erro ao carregar detalhes da vaga:", error);
        container.innerHTML = '<h1>Vaga não encontrada</h1><p>Não foi possível carregar os detalhes desta vaga. Por favor, verifique o link ou tente novamente mais tarde.</p>';
    }
}

function exibirDadosDoProduto(vaga) {
    document.getElementById('titulo-vaga').textContent = vaga.tituloVaga;
    document.getElementById('local-vaga').textContent = vaga.local;
    document.getElementById('descricao-vaga').textContent = vaga.descricao;
    document.getElementById('requisitos-vaga').textContent = vaga.requisitos;
    document.getElementById('responsavel-vaga').textContent = vaga.responsavel;
    document.getElementById('contato-vaga').textContent = vaga.contato;
}


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
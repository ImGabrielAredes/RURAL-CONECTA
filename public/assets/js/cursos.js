// cursos.js - VERSÃO CORRIGIDA COM SIMULAÇÃO DE DELETE

// A variável API_URL foi REMOVIDA.

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // --- LÓGICA DE CARREGAMENTO ATUALIZADA ---
        let todosCursos = [];
        const cursosTemporarios = sessionStorage.getItem('cursos_temp');

        if (cursosTemporarios) {
            // Se já temos uma lista de cursos na memória (após uma exclusão), usamos ela.
            console.log("Carregando cursos da memória da sessão...");
            todosCursos = JSON.parse(cursosTemporarios);
        } else {
            // Se não, buscamos da API pela primeira vez.
            console.log("Buscando cursos da API...");
            // CORREÇÃO GET: Busca inicial dos cursos na API correta.
            const response = await fetch('/api/cursos');
            if (!response.ok) throw new Error("Falha ao buscar cursos da API.");
            todosCursos = await response.json();
            // NOVO: Após buscar, salvamos na sessionStorage para futuras manipulações (como excluir).
            sessionStorage.setItem('cursos_temp', JSON.stringify(todosCursos));
        }
        
        const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));

        renderizarColunas(todosCursos, usuarioLogado);

    } catch (error) {
        console.error("Erro fatal ao carregar cursos:", error);
        const container = document.querySelector('.cursos');
        if (container) container.innerHTML = "<h1>Erro ao carregar conteúdo. Tente novamente mais tarde.</h1>";
    }
});


function renderizarColunas(todosCursos, usuarioLogado) {
    // Sua lógica de filtros está ótima!
    const recomendados = todosCursos.filter(curso => (curso.visualizacoes || 0) >= 150); 
    const maisVistos = [...todosCursos].sort((a, b) => (b.visualizacoes || 0) - (a.visualizacoes || 0)).slice(0, 5); 
    const redesSociais = todosCursos.filter(curso => curso.categoria && curso.categoria.toLowerCase().includes("redes sociais"));

    renderizarCards("recomendados", recomendados, usuarioLogado);
    renderizarCards("maisvistos", maisVistos, usuarioLogado);
    renderizarCards("redessociais", redesSociais, usuarioLogado);
    adicionarListenersAosBotoes();
}


function renderizarCards(containerId, cursosParaRenderizar, usuarioLogado) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = ''; 

    if (cursosParaRenderizar.length === 0) {
        container.innerHTML = '<p style="text-align:center; font-size: 0.9em; color: #666;">Nenhum curso nesta categoria.</p>';
        return;
    }

    cursosParaRenderizar.forEach(curso => {
        let botoesAdminHTML = '';
        // Esta lógica para exibir botões de admin está perfeita.
        if (usuarioLogado && curso.criadorId === usuarioLogado.id) {
            botoesAdminHTML = `
                <div class="card-admin-botoes">
                    <button class="btn-editar" data-id="${curso.id}">Editar</button>
                    <button class="btn-excluir" data-id="${curso.id}">Excluir</button>
                </div>
            `;
        }

        const div = document.createElement('div');
        div.className = 'itemcurso';
        // Corrigido o caminho da imagem para ser mais consistente.
        const imageUrl = curso.imagem ? `/img/${curso.imagem}` : '/img/placeholder-curso.png';
        div.innerHTML = `
            <h2>${curso.titulo}</h2>
            <img src="${imageUrl}" alt="${curso.titulo}">
            <p>${curso.descricao.substring(0, 100)}...</p>
            <a href="/paginas/detalhescursos.html?id=${curso.id}" class="sabermais">Saber mais</a>
            ${botoesAdminHTML} 
        `;
        container.appendChild(div);
    });
}


function adicionarListenersAosBotoes() {
    document.querySelectorAll('.btn-editar').forEach(botao => {
        botao.addEventListener('click', (event) => {
            const id = event.target.dataset.id;
            window.location.href = `/paginas/cadastrocursos.html?editId=${id}`;
        });
    });

    document.querySelectorAll('.btn-excluir').forEach(botao => {
        botao.addEventListener('click', (event) => {
            const id = event.target.dataset.id;
            excluirCurso(id);
        });
    });
}


// --- LÓGICA DE SIMULAÇÃO DE DELETE ---
function excluirCurso(id) {
    if (confirm('Tem certeza que deseja excluir este curso? Esta ação não pode ser desfeita (nesta sessão).')) {
        // 1. Pega a lista de cursos da memória da sessão.
        const cursosAtuais = JSON.parse(sessionStorage.getItem('cursos_temp')) || [];
        
        // 2. Cria uma nova lista, filtrando para remover o curso com o ID correspondente.
        const cursosAtualizados = cursosAtuais.filter(curso => curso.id != id);

        // 3. Salva a nova lista (sem o curso excluído) de volta na sessionStorage.
        sessionStorage.setItem('cursos_temp', JSON.stringify(cursosAtualizados));

        alert('Curso excluído com sucesso!');
        // 4. Recarrega a página. A página irá ler a lista atualizada da sessionStorage e o curso terá "sumido".
        window.location.reload();
    }
}
// cadastrocursos.js - VERSÃO FINAL COM SIMULAÇÃO DE CADASTRO E EDIÇÃO

document.addEventListener('DOMContentLoaded', async () => {
    // --- SETUP INICIAL ---
    const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));
    if (!usuarioLogado) {
        // Proteção de página: só usuários logados podem cadastrar/editar.
        alert("Você precisa estar logado para acessar esta página.");
        window.location.href = '/paginas/cadastro.html#login';
        return; 
    }

    const params = new URLSearchParams(window.location.search);
    const editId = params.get('editId');
    const form = document.querySelector('.formulario-curso');
    
    // Lógica para mostrar/esconder o campo de preço (está ótima!)
    const tipoPrecoRadios = form.querySelectorAll('input[name="tipoPreco"]');
    const campoPreco = document.getElementById('campoPreco');
    tipoPrecoRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            campoPreco.style.display = form.tipoPreco.value === 'pago' ? 'block' : 'none';
        });
    });

    // --- LÓGICA DE CARREGAMENTO (PARA EDIÇÃO) ---
    // PRIMEIRO: Estabelecemos a nossa "fonte da verdade" para os cursos.
    let cursosDaSessao = JSON.parse(sessionStorage.getItem('cursos_temp'));
    if (!cursosDaSessao) {
        // Se não houver nada na memória, busca da API e salva na memória.
        try {
            const response = await fetch('/api/cursos');
            cursosDaSessao = await response.json();
            sessionStorage.setItem('cursos_temp', JSON.stringify(cursosDaSessao));
        } catch (error) {
            console.error("Falha ao buscar a lista de cursos inicial:", error);
            alert("Não foi possível carregar os dados base dos cursos.");
            return;
        }
    }

    // SE ESTIVER EM MODO DE EDIÇÃO, preenchemos o formulário.
    if (editId) {
        document.querySelector('h1').textContent = 'Editar Curso';
        form.querySelector('button[type="submit"]').textContent = 'Salvar Alterações';
        
        // Procura o curso na nossa "fonte da verdade" (a lista da sessão).
        const cursoParaEditar = cursosDaSessao.find(c => c.id == editId);

        if (!cursoParaEditar) {
            alert("Curso não encontrado para edição.");
            window.location.href = '/paginas/cursos.html';
            return;
        }
        if (cursoParaEditar.criadorId !== usuarioLogado.id) {
            alert("Você não tem permissão para editar este curso.");
            window.location.href = '/paginas/cursos.html';
            return;
        }

        // Preenche o formulário com os dados do curso encontrado.
        form.titulo.value = cursoParaEditar.titulo || '';
        form.categoria.value = cursoParaEditar.categoria || '';
        form.descricao.value = cursoParaEditar.descricao || '';
        form.duracao.value = cursoParaEditar.duracao || '';
        form.dificuldade.value = cursoParaEditar.dificuldade || '';
        form.publicoAlvo.value = cursoParaEditar.publicoAlvo || '';
        form.formato.value = cursoParaEditar.formato || '';
        form.imagemUrl.value = cursoParaEditar.imagem || '';
        form.instrutor.value = cursoParaEditar.instrutor || '';
        form.modulos.value = cursoParaEditar.modulos ? cursoParaEditar.modulos.join('; ') : '';
        form.video.value = cursoParaEditar.video || '';
        form.tipoPreco.value = cursoParaEditar.tipoPreco || 'gratuito';
        if (cursoParaEditar.tipoPreco === 'pago') {
            campoPreco.style.display = 'block';
            form.preco.value = cursoParaEditar.preco || '';
        }
    }

    // --- LÓGICA DE SUBMISSÃO (CRIAR OU EDITAR) ---
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Pega a lista mais atual da memória.
        let cursosAtuais = JSON.parse(sessionStorage.getItem('cursos_temp')) || [];

        // Monta o objeto do curso com os dados do formulário.
        const cursoData = {
            titulo: form.titulo.value,
            categoria: form.categoria.value,
            descricao: form.descricao.value,
            duracao: parseInt(form.duracao.value) || 0,
            dificuldade: form.dificuldade.value,
            publicoAlvo: form.publicoAlvo.value,
            formato: form.formato.value,
            imagem: form.imagemUrl.value,
            instrutor: form.instrutor.value,
            modulos: form.modulos.value.split(';').map(m => m.trim()), 
            video: form.video.value,
            tipoPreco: form.tipoPreco.value,
            preco: form.tipoPreco.value === 'pago' ? parseFloat(form.preco.value) || 0 : 0,
            criadorId: usuarioLogado.id,
        };

        if (editId) {
            // Se for uma edição, encontramos o curso antigo e o substituímos.
            const index = cursosAtuais.findIndex(c => c.id == editId);
            if (index !== -1) {
                // Mantém o ID e data de criação originais, atualiza o resto.
                cursosAtuais[index] = { ...cursosAtuais[index], ...cursoData, id: editId };
            }
        } else {
            // Se for uma criação, adicionamos um novo ID, data, e colocamos na lista.
            cursoData.id = `curso_${Date.now()}`;
            cursoData.data = new Date().toISOString();
            cursosAtuais.push(cursoData);
        }

        // Finalmente, salvamos a lista atualizada de volta na sessionStorage.
        sessionStorage.setItem('cursos_temp', JSON.stringify(cursosAtuais));

        alert(`Curso ${editId ? 'atualizado' : 'cadastrado'} com sucesso!`);
        window.location.href = '/paginas/cursos.html';
    });
});
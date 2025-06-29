
document.addEventListener('DOMContentLoaded', async () => {
    const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));
    if (!usuarioLogado) {
        alert("Você precisa estar logado para acessar esta página.");
        window.location.href = '/paginas/cadastro.html#login';
        return; 
    }

    const params = new URLSearchParams(window.location.search);
    const editId = params.get('editId');
    const form = document.querySelector('.formulario-curso');
    
    const tipoPrecoRadios = form.querySelectorAll('input[name="tipoPreco"]');
    const campoPreco = document.getElementById('campoPreco');
    tipoPrecoRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            campoPreco.style.display = form.tipoPreco.value === 'pago' ? 'block' : 'none';
        });
    });

    let cursosDaSessao = JSON.parse(sessionStorage.getItem('cursos_temp'));
    if (!cursosDaSessao) {
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

    if (editId) {
        document.querySelector('h1').textContent = 'Editar Curso';
        form.querySelector('button[type="submit"]').textContent = 'Salvar Alterações';
        
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

        let cursosAtuais = JSON.parse(sessionStorage.getItem('cursos_temp')) || [];

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
            const index = cursosAtuais.findIndex(c => c.id == editId);
            if (index !== -1) {
                cursosAtuais[index] = { ...cursosAtuais[index], ...cursoData, id: editId };
            }
        } else {
     
            cursoData.id = `curso_${Date.now()}`;
            cursoData.data = new Date().toISOString();
            cursosAtuais.push(cursoData);
        }
        sessionStorage.setItem('cursos_temp', JSON.stringify(cursosAtuais));

        alert(`Curso ${editId ? 'atualizado' : 'cadastrado'} com sucesso!`);
        window.location.href = '/paginas/cursos.html';
    });
});
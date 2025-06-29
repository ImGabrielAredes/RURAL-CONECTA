// perfil.js - CÓDIGO CORRIGIDO

// A variável API_URL foi REMOVIDA.
// const API_URL = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', function () {
    const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));
    if (!usuarioLogado) {
        alert("Acesso negado. Por favor, faça o login.");
        window.location.href = "/paginas/cadastro.html#login";
        return;
    }

    carregarDadosVisuais(usuarioLogado);
    carregarCursosInscritos(usuarioLogado);
    configurarEventListeners(usuarioLogado);
});

function carregarDadosVisuais(usuario) {
    document.getElementById('nome-usuario').textContent = `${usuario.nome} ${usuario.sobrenome}`;
    document.getElementById('email-usuario').textContent = usuario.email;
    document.getElementById('local-usuario').textContent = `${usuario.bairro}, ${usuario.rua}, ${usuario.numero}`;
    
    document.getElementById('foto-perfil').src = usuario.foto || '/img/avatar_padrao.png';

    const membroDesdeElemento = document.getElementById('membro-desde');
    if (usuario.dataCadastro) {
        const data = new Date(usuario.dataCadastro);

        if (!isNaN(data.getTime())) {
             membroDesdeElemento.textContent = `Membro desde: ${data.toLocaleDateString('pt-BR')}`;
             membroDesdeElemento.style.display = 'block';
        } else {
            membroDesdeElemento.style.display = 'none';
        }
    } else {
        membroDesdeElemento.style.display = 'none';
    }
}

async function carregarCursosInscritos(usuario) {
    const cursosGrid = document.getElementById('cursos-grid');
    const spanNumeroCursos = document.getElementById('numero-cursos-inscritos');
    if (!cursosGrid || !spanNumeroCursos) return;

    try {
        // CORREÇÃO 1: Buscando as inscrições
        const responseInscricoes = await fetch(`/api/inscricoes?usuarioId=${usuario.id}`);
        const inscricoes = await responseInscricoes.json();
        spanNumeroCursos.textContent = inscricoes.length;
        if (inscricoes.length === 0) {
            cursosGrid.innerHTML = '<p class="aviso-sem-cursos">Você ainda não se inscreveu em nenhum curso.</p>';
            return;
        }
        const idsDosCursos = inscricoes.map(i => `id=${i.cursoId}`).join('&');
        
        // CORREÇÃO 2: Buscando os detalhes dos cursos inscritos
        const responseCursos = await fetch(`/api/cursos?${idsDosCursos}`);
        const cursosInscritos = await responseCursos.json();
        
        cursosGrid.innerHTML = '';
        cursosInscritos.forEach(curso => {
            const imageUrl = curso.imagem ? `/img/${curso.imagem}` : '/img/placeholder-curso.png';
            const cardDoCursoHTML = `
                <div class="curso-item">
                    <img src="${imageUrl}" alt="${curso.titulo}">
                    <div class="curso-item-info">
                        <h3>${curso.titulo}</h3>
                        <p>por ${curso.instrutor}</p>
                    </div>
                    <a href="/paginas/detalhescursos.html?id=${curso.id}" class="botao-acessar-curso">Acessar Curso</a>
                </div>
            `;
            cursosGrid.innerHTML += cardDoCursoHTML;
        });
    } catch (error) {
        console.error("Erro ao carregar cursos inscritos:", error);
        spanNumeroCursos.textContent = "0";
        cursosGrid.innerHTML = '<p class="aviso-sem-cursos">Erro ao carregar seus cursos.</p>';
    }
}

function configurarEventListeners(usuarioLogado) {
    const linkAlterarFoto = document.getElementById('link-alterar-foto');
    const inputFoto = document.getElementById('input-foto');
    if (linkAlterarFoto && inputFoto) {
        linkAlterarFoto.addEventListener('click', (e) => {
            e.preventDefault();
            inputFoto.click();
        });
        inputFoto.addEventListener('change', (e) => {
            const arquivo = e.target.files[0];
            if (arquivo) processarEAtualizarFoto(arquivo, usuarioLogado);
        });
    }
    
    const modalEditar = document.getElementById('modal-editar-perfil');
    const botaoEditarPerfil = document.querySelector('.botao-editar-perfil');
    const botaoCancelarEdicao = document.getElementById('botao-cancelar-edicao');
    const formEditar = document.getElementById('form-editar-perfil');
    if (modalEditar && botaoEditarPerfil && formEditar && botaoCancelarEdicao) {
        botaoEditarPerfil.addEventListener('click', () => {
            const usuarioAtual = JSON.parse(sessionStorage.getItem('usuarioLogado'));
            formEditar.nome.value = usuarioAtual.nome;
            formEditar.sobrenome.value = usuarioAtual.sobrenome;
            formEditar.rua.value = usuarioAtual.rua;
            formEditar.numero.value = usuarioAtual.numero;
            formEditar.bairro.value = usuarioAtual.bairro;
            modalEditar.style.display = 'flex';
        });

        botaoCancelarEdicao.addEventListener('click', () => {
            modalEditar.style.display = 'none';
        });

        formEditar.addEventListener('submit', async (event) => {
            event.preventDefault();
            const usuarioAtual = JSON.parse(sessionStorage.getItem('usuarioLogado'));
            const dadosAtualizados = {
                ...usuarioAtual,
                nome: formEditar.nome.value,
                sobrenome: formEditar.sobrenome.value,
                rua: formEditar.rua.value,
                numero: formEditar.numero.value,
                bairro: formEditar.bairro.value,
            };
            try {
                // CORREÇÃO 3: Atualizando o perfil (PUT)
                // AVISO: Esta requisição vai APARENTAR funcionar, mas não salvará os dados permanentemente na Vercel.
                const response = await fetch(`/api/usuarios/${usuarioAtual.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dadosAtualizados)
                });
                if (!response.ok) throw new Error('Falha ao atualizar o perfil.');
                sessionStorage.setItem('usuarioLogado', JSON.stringify(dadosAtualizados));
                carregarDadosVisuais(dadosAtualizados);
                modalEditar.style.display = 'none';
                alert('Perfil atualizado com sucesso!');
            } catch (error) {
                console.error('Erro ao atualizar perfil:', error);
                alert('Não foi possível atualizar o perfil.');
            }
        });
    }
}

async function processarEAtualizarFoto(arquivo, usuario) {
    const MAX_LARGURA = 400;
    const leitor = new FileReader();

    leitor.onload = function (eventoLeitor) {
        const img = new Image();
        img.src = eventoLeitor.target.result;
        img.onload = async function () {
            const canvas = document.createElement('canvas');
            let { width, height } = img;
            if (width > MAX_LARGURA) {
                height *= MAX_LARGURA / width;
                width = MAX_LARGURA;
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            const urlDaImagemOtimizada = canvas.toDataURL('image/jpeg', 0.8);
            try {
                // CORREÇÃO 4: Atualizando a foto (PATCH)
                // AVISO: Esta requisição vai APARENTAR funcionar, mas não salvará os dados permanentemente na Vercel.
                const response = await fetch(`/api/usuarios/${usuario.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ foto: urlDaImagemOtimizada })
                });
                if (!response.ok) throw new Error('Falha ao salvar a nova foto.');
                document.getElementById('foto-perfil').src = urlDaImagemOtimizada;
                usuario.foto = urlDaImagemOtimizada;
                sessionStorage.setItem('usuarioLogado', JSON.stringify(usuario));
                alert('Foto de perfil atualizada com sucesso!');
            } catch (error) {
                console.error("Erro ao atualizar a foto:", error);
                alert("Não foi possível atualizar a foto de perfil.");
            }
        };
    };
    leitor.readAsDataURL(arquivo);
}
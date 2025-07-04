

document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const cursoId = params.get("id"); 

    if (!cursoId) {
        document.querySelector('main').innerHTML = "<h1>Erro: Curso não especificado.</h1>";
        return;
    }

    try {
        const response = await fetch(`/api/cursos/${cursoId}`);
        if (!response.ok) throw new Error('Curso não encontrado no servidor.');
        
        const curso = await response.json();
        const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));
        
        renderizarDetalhes(curso);
        gerenciarBotaoInscricao(curso, usuarioLogado);

    } catch (error) {
        console.error("Erro ao buscar detalhes do curso:", error);
        document.querySelector('main').innerHTML = "<h1>Erro ao carregar o curso.</h1>";
    }
});


function renderizarDetalhes(curso) {
    document.title = `${curso.titulo} - Conecta Rural`; 

    document.getElementById('titulo-curso').textContent = curso.titulo || "Título Indisponível";
    document.getElementById('instrutor-curso').textContent = curso.instrutor || "Não informado";
    // CORREÇÃO DE BUG: Ajustado o caminho da imagem para o padrão do projeto.
    document.getElementById('imagem-curso').src = curso.imagem ? `/img/${curso.imagem}` : '/img/placeholder-curso.png';
    document.getElementById('descricao-resumida').textContent = curso.descricao || "Descrição não disponível.";
    
    document.getElementById('categoria-curso').textContent = curso.categoria || "Geral";
    document.getElementById('dificuldade-curso').textContent = curso.dificuldade || "Não informado";
    document.getElementById('duracao-curso').textContent = `${curso.duracao || '?'} horas`;

    document.getElementById('publico-alvo-curso').textContent = curso.publicoAlvo || "Não informado";
    document.getElementById('formato-curso').textContent = curso.formato || "Não informado";
    document.getElementById('data-curso').textContent = curso.data ? new Date(curso.data).toLocaleDateString('pt-BR') : 'Não informada';
    document.getElementById('preco-curso').innerHTML = `<strong>Preço:</strong> ${curso.tipoPreco === 'gratuito' ? 'Gratuito' : `R$ ${parseFloat(curso.preco || 0).toFixed(2).replace('.', ',')}`}`;

    const modulosLista = document.getElementById('modulos-lista');
    modulosLista.innerHTML = '';
    if (curso.modulos && curso.modulos.length > 0) {
        curso.modulos.forEach(modulo => {
            const li = document.createElement('li');
            li.textContent = modulo;
            modulosLista.appendChild(li);
        });
    } else {
        modulosLista.innerHTML = '<li>Conteúdo do curso não detalhado.</li>';
    }

    const videoContainer = document.getElementById('video-container');
    if (curso.video) {
        const videoId = extrairVideoId(curso.video);
        if (videoId) {
            document.getElementById('video-curso').src = `https://www.youtube.com/embed/${videoId}`;
            videoContainer.style.display = 'block';
        }
    }
}


async function gerenciarBotaoInscricao(curso, usuarioLogado) {
    const botaoContainer = document.getElementById('botao-inscricao-container');
    if (!botaoContainer) return;

    if (usuarioLogado) {
        const inscricoesTemporarias = JSON.parse(sessionStorage.getItem('inscricoes_temp')) || [];
        const jaInscritoTemp = inscricoesTemporarias.find(i => i.usuarioId === usuarioLogado.id && i.cursoId === curso.id);

        if (jaInscritoTemp) {
             botaoContainer.innerHTML = '<button class="botao-inscrito" disabled>Você já está inscrito</button>';
             return;
        }

        const inscricaoResponse = await fetch(`/api/inscricoes?usuarioId=${usuarioLogado.id}&cursoId=${curso.id}`);
        const inscricoes = await inscricaoResponse.json();

        if (inscricoes.length > 0) {
            botaoContainer.innerHTML = '<button class="botao-inscrito" disabled>Você já está inscrito</button>';
        } else {
            botaoContainer.innerHTML = `<button id="btn-inscrever" class="botao-inscrever">Inscrever-se neste Curso</button>`;
            document.getElementById('btn-inscrever').addEventListener('click', () => inscreverNoCurso(curso.id, usuarioLogado.id));
        }
    } else {
        botaoContainer.innerHTML = `<p><strong><a href="/paginas/cadastro.html#login">Faça login</a> para se inscrever neste curso.</strong></p>`;
    }
}


function inscreverNoCurso(cursoId, usuarioId) {
    const inscricaoData = {
        id: `insc_${Date.now()}`,
        cursoId: String(cursoId),
        usuarioId: String(usuarioId),
        dataInscricao: new Date().toISOString()
    };

    const inscricoesAtuais = JSON.parse(sessionStorage.getItem('inscricoes_temp')) || [];
    
    inscricoesAtuais.push(inscricaoData);

    sessionStorage.setItem('inscricoes_temp', JSON.stringify(inscricoesAtuais));

    alert('Inscrição realizada com sucesso!');
    document.getElementById('botao-inscricao-container').innerHTML = '<button class="botao-inscrito" disabled>Inscrito com sucesso!</button>';
}


function extrairVideoId(url) {
    if (!url) return null;
    const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/embed\/)([^"&?\/\s]{11})/;
    const match = url.match(regExp);
    return (match && match[1]) ? match[1] : null;
}
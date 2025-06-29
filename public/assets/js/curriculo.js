document.addEventListener('DOMContentLoaded', () => {

    const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));
    const params = new URLSearchParams(window.location.search);
    const vagaId = params.get('vagaId');

    if (!usuarioLogado) {
        alert("Você precisa estar logado para se candidatar a uma vaga.");
        window.location.href = '/paginas/cadastro.html#login';
        return;
    }

    if (!vagaId) {
        document.querySelector('main').innerHTML = "<h1>Erro</h1><p>Nenhuma vaga selecionada.</p>";
        return;
    }

    const form = document.getElementById('formCurriculo');
    if (form) {
        form.nome.value = `${usuarioLogado.nome} ${usuarioLogado.sobrenome}`;
        form.email.value = usuarioLogado.email;

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const arquivoInput = form.arquivo;
            const nomeDoArquivo = arquivoInput.files.length > 0 ? arquivoInput.files[0].name : 'Nenhum arquivo anexado';

            const candidaturaData = {
                id: `cand_${Date.now()}`,
                vagaId: vagaId,
                usuarioId: usuarioLogado.id,
                nomeCandidato: form.nome.value,
                emailCandidato: form.email.value,
                nomeArquivo: nomeDoArquivo,
                dataCandidatura: new Date().toISOString()
            };

            try {
                const candidaturasAtuais = JSON.parse(sessionStorage.getItem('candidaturas_temp')) || [];
                
                candidaturasAtuais.push(candidaturaData);

                sessionStorage.setItem('candidaturas_temp', JSON.stringify(candidaturasAtuais));
                
                const mensagemSucesso = document.getElementById('mensagemSucesso');
                const botaoSubmit = form.querySelector('button[type="submit"]');

                if(mensagemSucesso) mensagemSucesso.style.display = 'block';
                if(botaoSubmit) {
                    botaoSubmit.textContent = 'Enviado!';
                    botaoSubmit.disabled = true;
                }
                
                console.log("Candidatura simulada com sucesso e salva na sessionStorage:", candidaturaData);

            } catch (error) {
                console.error("Erro ao simular o envio da candidatura:", error);
                alert("Não foi possível processar sua candidatura.");
            }
        });
    }
});
document.addEventListener('DOMContentLoaded', function () {
    checarUsuarioLogado();

    document.body.addEventListener('click', function (e) {
        if (e.target && e.target.id === 'btnSair') {
            sessionStorage.removeItem('usuarioLogado');
            sessionStorage.removeItem('cursosInscritos');
            
            alert("Você saiu da sua conta.");
            window.location.href = '/index.html'; 
        }
    });
});

function checarUsuarioLogado() {
    const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));
    const botoesLogin = document.querySelector('.botoes-login');
    
    if (botoesLogin) {
        if (usuarioLogado) {
            botoesLogin.innerHTML = `
                <span class="nome-usuario-header">Olá, ${usuarioLogado.nome}</span>
                <a href="/paginas/perfil.html" class="entrar">Meu Perfil</a> 
                <button id="btnSair" class="cadastrar">Sair</button>
            `;
        } else {
            botoesLogin.innerHTML = `
                <a href="/paginas/cadastro.html#login" class="entrar">Entrar</a>
                <a href="/paginas/cadastro.html#cadastro" class="cadastrar">Cadastrar</a>
            `;
        }
    }
}
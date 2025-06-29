// cadastro.js - VERSÃO FINAL PARA SIMULAÇÃO TEMPORÁRIA

function showStep(stepNumber) {
    document.querySelectorAll('#cadastro-container .step').forEach(step => {
        step.style.display = 'none';
    });
    const stepToShow = document.getElementById(`step${stepNumber}`);
    if (stepToShow) {
        stepToShow.style.display = 'flex';
    }
}
window.nextStep = (current) => showStep(current + 1);
window.prevStep = (current) => showStep(current - 1);

document.addEventListener('DOMContentLoaded', function () {
    
    const loginContainer = document.getElementById('login-container');
    const cadastroContainer = document.getElementById('cadastro-container');
    const toggleToCadastro = document.getElementById('toggle-to-cadastro');
    const toggleToLogin = document.getElementById('toggle-to-login');
    const cadastroForm = document.getElementById('cadastroForm');
    const loginForm = document.getElementById('loginForm');

    function mostrarFormularioInicial() {
        if (window.location.hash === '#cadastro') {
            if(cadastroContainer) cadastroContainer.style.display = 'block';
            if(loginContainer) loginContainer.style.display = 'none';
            showStep(1);
        } else { 
            if(loginContainer) loginContainer.style.display = 'block';
            if(cadastroContainer) cadastroContainer.style.display = 'none';
        }
    }

    if (toggleToCadastro) {
        toggleToCadastro.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.hash = 'cadastro';
        });
    }

    if (toggleToLogin) {
        toggleToLogin.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.hash = 'login';
        });
    }

    // --- LÓGICA DE CADASTRO MODIFICADA ---
    if (cadastroForm) {
        cadastroForm.addEventListener('submit', function (event) {
            event.preventDefault(); 

            const senha = this.querySelector('input[name="senha"]').value;
            const confirmarSenha = this.querySelector('input[name="confirmarSenha"]').value;
            if (senha !== confirmarSenha) {
                alert('As senhas não coincidem!');
                return;
            }
            
            const formData = new FormData(this);
            const dadosUsuario = Object.fromEntries(formData.entries());
            delete dadosUsuario.confirmarSenha;
            // Adiciona um ID e data de cadastro fictícios
            dadosUsuario.id = `user_${Date.now()}`; 
            dadosUsuario.dataCadastro = new Date().toISOString(); 

            // SIMULAÇÃO: Em vez de enviar para a API, salvamos direto no navegador
            // e já consideramos o usuário logado.
            sessionStorage.setItem('usuarioLogado', JSON.stringify(dadosUsuario));
            
            alert('Cadastro realizado com sucesso! Você será redirecionado.');
            // Redireciona para a página de perfil (ou sucesso)
            window.location.href = '/paginas/perfil.html'; 
        });
    }

    // --- LÓGICA DE LOGIN MODIFICADA ---
    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault(); 

            const email = this.querySelector('input[name="email"]').value;
            const senha = this.querySelector('input[name="senha"]').value;
            
            // SIMULAÇÃO: Em vez de perguntar para a API, verificamos o usuário
            // que foi salvo no "cadastro falso" durante esta sessão.
            const usuarioSalvo = JSON.parse(sessionStorage.getItem('usuarioLogado'));

            if (usuarioSalvo && usuarioSalvo.email === email && usuarioSalvo.senha === senha) {
                // O login é válido se corresponder ao usuário que se cadastrou nesta sessão.
                alert('Login bem-sucedido!');
                window.location.href = '/paginas/perfil.html';
            } else {
                // Se não houver usuário na sessão ou os dados estiverem errados.
                alert('Usuário não encontrado ou dados incorretos. Por favor, cadastre-se primeiro nesta sessão.');
            }
        });
    }

    mostrarFormularioInicial();
    window.addEventListener('hashchange', mostrarFormularioInicial);
});
// cadastro.js - VERSÃO FINAL COM BANCO DE DADOS FALSO EM LOCALSTORAGE

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

    // --- LÓGICA DE CADASTRO COM LOCALSTORAGE ---
    if (cadastroForm) {
        cadastroForm.addEventListener('submit', function (event) {
            event.preventDefault(); 

            const senha = this.querySelector('input[name="senha"]').value;
            const confirmarSenha = this.querySelector('input[name="confirmarSenha"]').value;
            if (senha !== confirmarSenha) {
                return alert('As senhas não coincidem!');
            }
            
            const formData = new FormData(this);
            const dadosUsuario = Object.fromEntries(formData.entries());
            delete dadosUsuario.confirmarSenha;
            dadosUsuario.id = `user_${Date.now()}`; 
            dadosUsuario.dataCadastro = new Date().toISOString(); 

            // 1. Puxamos a "tabela de usuários" do nosso banco de dados falso.
            const usuariosCadastrados = JSON.parse(localStorage.getItem('lista_usuarios_fake')) || [];

            // 2. Verificamos se o e-mail já existe.
            const emailExistente = usuariosCadastrados.find(user => user.email === dadosUsuario.email);
            if (emailExistente) {
                return alert('Este e-mail já está cadastrado!');
            }

            // 3. Adicionamos o novo usuário à lista.
            usuariosCadastrados.push(dadosUsuario);

            // 4. Salvamos a lista atualizada de volta no banco de dados falso.
            localStorage.setItem('lista_usuarios_fake', JSON.stringify(usuariosCadastrados));

            // 5. Definimos o usuário logado para a sessão ATUAL.
            sessionStorage.setItem('usuarioLogado', JSON.stringify(dadosUsuario));
            
            alert('Cadastro realizado com sucesso! Você será redirecionado.');
            window.location.href = '/paginas/perfil.html'; 
        });
    }

    // --- LÓGICA DE LOGIN COM LOCALSTORAGE ---
    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault(); 

            const email = this.querySelector('input[name="email"]').value;
            const senha = this.querySelector('input[name="senha"]').value;
            
            // Puxamos a lista de usuários do nosso banco de dados falso.
            const usuariosCadastrados = JSON.parse(localStorage.getItem('lista_usuarios_fake')) || [];

            // Procuramos por um usuário que tenha o mesmo email E a mesma senha.
            const usuarioEncontrado = usuariosCadastrados.find(user => user.email === email && user.senha === senha);

            if (usuarioEncontrado) {
                // Se encontrou, o login é válido!
                sessionStorage.setItem('usuarioLogado', JSON.stringify(usuarioEncontrado));
                alert('Login bem-sucedido!');
                window.location.href = '/paginas/perfil.html';
            } else {
                // Se não encontrou, os dados estão incorretos.
                alert('Email ou senha incorretos!');
            }
        });
    }

    mostrarFormularioInicial();
    window.addEventListener('hashchange', mostrarFormularioInicial);
});
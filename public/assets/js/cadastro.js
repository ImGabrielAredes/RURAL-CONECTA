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

            const usuariosCadastrados = JSON.parse(localStorage.getItem('lista_usuarios_fake')) || [];

            const emailExistente = usuariosCadastrados.find(user => user.email === dadosUsuario.email);
            if (emailExistente) {
                return alert('Este e-mail já está cadastrado!');
            }

            usuariosCadastrados.push(dadosUsuario);

            localStorage.setItem('lista_usuarios_fake', JSON.stringify(usuariosCadastrados));

            sessionStorage.setItem('usuarioLogado', JSON.stringify(dadosUsuario));
            
            alert('Cadastro realizado com sucesso! Você será redirecionado.');
            window.location.href = '/paginas/perfil.html'; 
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault(); 

            const email = this.querySelector('input[name="email"]').value;
            const senha = this.querySelector('input[name="senha"]').value;
            
            const usuariosCadastrados = JSON.parse(localStorage.getItem('lista_usuarios_fake')) || [];
            const usuarioEncontrado = usuariosCadastrados.find(user => user.email === email && user.senha === senha);

            if (usuarioEncontrado) {
                sessionStorage.setItem('usuarioLogado', JSON.stringify(usuarioEncontrado));
                alert('Login bem-sucedido!');
                window.location.href = '/paginas/perfil.html';
            } else {
                alert('Email ou senha incorretos!');
            }
        });
    }

    mostrarFormularioInicial();
    window.addEventListener('hashchange', mostrarFormularioInicial);
});
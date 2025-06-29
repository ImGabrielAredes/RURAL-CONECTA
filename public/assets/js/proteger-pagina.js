(function() {
    const usuarioLogado = sessionStorage.getItem('usuarioLogado');

    if (!usuarioLogado) {
        alert("Acesso restrito. Por favor, faça login para continuar.");
        window.location.href = '/paginas/cadastro.html#login';
    }
})();
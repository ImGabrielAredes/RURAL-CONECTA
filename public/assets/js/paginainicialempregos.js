/*
 * ARQUIVO JAVASCRIPT CORRIGIDO
 * As únicas mudanças foram:
 * 1. A remoção da variável "API_URL" que apontava para o localhost.
 * 2. A alteração da chamada "fetch" para usar o caminho relativo "/api/empregos".
 * Todo o resto da sua lógica foi mantido intacto.
 */

document.addEventListener('DOMContentLoaded', () => {
    // A função carregarVagas agora buscará os dados do local correto.
    carregarVagas();

    // Esta parte do código, que lida com o login, não precisa de alteração.
    const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));
    const botaoCadastrar = document.getElementById('btn-ir-para-cadastro-emprego');

    if (botaoCadastrar && usuarioLogado) {
        botaoCadastrar.style.display = 'inline-block';
        botaoCadastrar.addEventListener('click', () => {
            // O caminho relativo para a página de cadastro já estava correto!
            window.location.href = '/paginas/cadastroempregos.html'; 
        });
    }
});

async function carregarVagas() {
    const containerDestaque = document.getElementById('vagas-destaque-container');
    if (!containerDestaque) return;

    try {
        // ==================================================================
        // MUDANÇA PRINCIPAL AQUI:
        // Trocamos a URL antiga (`${API_URL}/empregos`) por este caminho relativo.
        // O navegador irá buscar em "https://seu-site.vercel.app/api/empregos",
        // que é exatamente o que configuramos na Vercel.
        // ==================================================================
        const response = await fetch('/api/empregos');
        const empregos = await response.json();
        
        containerDestaque.innerHTML = '';

        if (empregos.length === 0) {
            containerDestaque.innerHTML = '<p>Nenhuma vaga disponível no momento.</p>';
            return;
        }

        // A sua lógica para criar os cards está perfeita e foi mantida.
        empregos.reverse().forEach(vaga => { 
            const cardHTML = `
                <div class="card">
                    <h3>${vaga.tituloVaga}</h3>
                    <p>${vaga.local}</p>
                    <button onclick="window.location.href='/paginas/detalhesemprego.html?id=${vaga.id}'">Saber mais ></button>
                </div>
            `;
            containerDestaque.innerHTML += cardHTML;
        });

    } catch (error) {
        // O seu tratamento de erro também está ótimo e foi mantido.
        console.error("Erro ao carregar vagas:", error);
        containerDestaque.innerHTML = '<p>Erro ao carregar as vagas. Tente novamente mais tarde.</p>';
    }
}
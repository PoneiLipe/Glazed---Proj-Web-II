document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('contatoForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const box = document.getElementById('mensagemContato');
    const dados = Object.fromEntries(new FormData(event.target).entries());

    if (!/^\S+@\S+\.\S+$/.test(dados.email)) {
      box.innerHTML = '<div class="alert alert-error">Informe um e-mail válido.</div>';
      return;
    }

    try {
      const resposta = await fetch('/api/contatos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      });
      const json = await resposta.json();
      if (!resposta.ok) throw new Error(json.erro || 'Erro ao enviar mensagem.');
      box.innerHTML = `<div class="alert alert-success">${json.mensagem}</div>`;
      event.target.reset();
    } catch (error) {
      box.innerHTML = `<div class="alert alert-error">${error.message}</div>`;
    }
  });
});

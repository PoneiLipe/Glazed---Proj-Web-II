const fatores = {
  'Plástico': { co2: 2.5, arvores: 0.1, agua: 50 },
  'Vidro': { co2: 1.2, arvores: 0.05, agua: 30 },
  'Metal': { co2: 3.0, arvores: 0.15, agua: 80 },
  'Papel': { co2: 1.8, arvores: 0.2, agua: 40 },
  'Orgânico': { co2: 0.5, arvores: 0.05, agua: 20 },
  'Eletrônico': { co2: 4.0, arvores: 0.18, agua: 90 },
  'Óleo': { co2: 2.2, arvores: 0.08, agua: 120 },
  'Bateria': { co2: 3.8, arvores: 0.12, agua: 100 }
};

async function carregarPontosDescarte() {
  const resposta = await fetch('/api/pontos');
  const dados = await resposta.json();
  const select = document.getElementById('ponto');
  select.innerHTML = '<option value="">Selecione um ponto</option>' + dados.pontos.map((p) => `<option value="${p._id}">${p.nome} — ${p.cidade}/${p.estado}</option>`).join('');
}

function atualizarImpacto() {
  const categoria = document.getElementById('categoria').value;
  const quantidade = Number(document.getElementById('quantidadeKg').value || 0);
  const fator = fatores[categoria] || { co2: 0, arvores: 0, agua: 0 };
  document.getElementById('co2Preview').textContent = `${(quantidade * fator.co2).toFixed(2)} kg`;
  document.getElementById('arvoresPreview').textContent = (quantidade * fator.arvores).toFixed(2);
  document.getElementById('aguaPreview').textContent = `${(quantidade * fator.agua).toFixed(0)} L`;
}

document.addEventListener('DOMContentLoaded', () => {
  exigirLogin();
  carregarPontosDescarte();
  document.getElementById('categoria').addEventListener('change', atualizarImpacto);
  document.getElementById('quantidadeKg').addEventListener('input', atualizarImpacto);

  document.getElementById('descarteForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const usuario = getUsuarioLogado();
    const box = document.getElementById('mensagemDescarte');
    try {
      const resposta = await fetch('/api/descartes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuarioId: usuario._id,
          usuarioEmail: usuario.email,
          ponto: document.getElementById('ponto').value,
          categoria: document.getElementById('categoria').value,
          quantidadeKg: Number(document.getElementById('quantidadeKg').value),
          observacoes: document.getElementById('observacoes').value
        })
      });
      const json = await resposta.json();
      if (!resposta.ok) throw new Error(json.erro || 'Erro ao registrar descarte.');
      box.innerHTML = `<div class="alert alert-success">${json.mensagem}</div>`;
      event.target.reset();
      atualizarImpacto();
    } catch (error) {
      box.innerHTML = `<div class="alert alert-error">${error.message}</div>`;
    }
  });
});

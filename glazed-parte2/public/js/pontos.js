let pontosCache = [];

function textoTipos(tipos) {
  return Array.isArray(tipos) ? tipos.join(', ') : '';
}

async function carregarPontos() {
  const busca = document.getElementById('busca').value.trim();
  const cidade = document.getElementById('cidade').value;
  const params = new URLSearchParams();
  if (busca) params.set('busca', busca);
  if (cidade) params.set('cidade', cidade);

  const resposta = await fetch(`/api/pontos?${params.toString()}`);
  const dados = await resposta.json();
  pontosCache = dados.pontos || [];
  renderizarPontos(pontosCache);
  preencherCidades();
}

function preencherCidades() {
  const select = document.getElementById('cidade');
  const atual = select.value;
  const cidades = [...new Set(pontosCache.map((p) => p.cidade))].sort();
  select.innerHTML = '<option value="">Todas as cidades</option>' + cidades.map((c) => `<option value="${c}">${c}</option>`).join('');
  select.value = atual;
}

function renderizarPontos(pontos) {
  const tbody = document.getElementById('pontosTabela');
  if (!pontos.length) {
    tbody.innerHTML = '<tr><td colspan="6">Nenhum ponto encontrado.</td></tr>';
    return;
  }
  tbody.innerHTML = pontos.map((ponto) => `
    <tr>
      <td>${ponto.nome}</td>
      <td>${ponto.cidade}/${ponto.estado}</td>
      <td>${ponto.endereco}</td>
      <td>${textoTipos(ponto.tiposAceitos)}</td>
      <td>${ponto.horario}</td>
      <td class="actions">
        <button class="btn btn-secondary" onclick="editarPonto('${ponto._id}')">Editar</button>
        <button class="btn btn-danger" onclick="removerPonto('${ponto._id}')">Excluir</button>
      </td>
    </tr>
  `).join('');
}

function dadosFormulario() {
  return {
    nome: document.getElementById('nome').value,
    cidade: document.getElementById('cidadeForm').value,
    estado: document.getElementById('estado').value.toUpperCase(),
    bairro: document.getElementById('bairro').value,
    endereco: document.getElementById('endereco').value,
    contato: document.getElementById('contato').value,
    horario: document.getElementById('horario').value,
    tiposAceitos: document.getElementById('tiposAceitos').value.split(',').map((v) => v.trim()).filter(Boolean)
  };
}

function editarPonto(id) {
  const ponto = pontosCache.find((p) => p._id === id);
  if (!ponto) return;
  document.getElementById('pontoId').value = ponto._id;
  document.getElementById('nome').value = ponto.nome;
  document.getElementById('cidadeForm').value = ponto.cidade;
  document.getElementById('estado').value = ponto.estado;
  document.getElementById('bairro').value = ponto.bairro;
  document.getElementById('endereco').value = ponto.endereco;
  document.getElementById('contato').value = ponto.contato || '';
  document.getElementById('horario').value = ponto.horario;
  document.getElementById('tiposAceitos').value = textoTipos(ponto.tiposAceitos);
  window.scrollTo({ top: document.getElementById('pontoForm').offsetTop - 100, behavior: 'smooth' });
}

async function removerPonto(id) {
  if (!confirm('Deseja excluir este ponto de coleta?')) return;
  const resposta = await fetch(`/api/pontos/${id}`, { method: 'DELETE' });
  const json = await resposta.json();
  if (!resposta.ok) alert(json.erro || 'Erro ao excluir.');
  await carregarPontos();
}

document.addEventListener('DOMContentLoaded', () => {
  carregarPontos();
  document.getElementById('btnBuscar').addEventListener('click', carregarPontos);
  document.getElementById('cidade').addEventListener('change', carregarPontos);
  document.getElementById('busca').addEventListener('input', carregarPontos);
  document.getElementById('limparPonto').addEventListener('click', () => document.getElementById('pontoForm').reset());

  document.getElementById('pontoForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const id = document.getElementById('pontoId').value;
    const metodo = id ? 'PUT' : 'POST';
    const url = id ? `/api/pontos/${id}` : '/api/pontos';
    const box = document.getElementById('mensagemPonto');

    try {
      const resposta = await fetch(url, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosFormulario())
      });
      const json = await resposta.json();
      if (!resposta.ok) throw new Error(json.erro || 'Erro ao salvar ponto.');
      box.innerHTML = `<div class="alert alert-success">${json.mensagem}</div>`;
      event.target.reset();
      document.getElementById('pontoId').value = '';
      await carregarPontos();
    } catch (error) {
      box.innerHTML = `<div class="alert alert-error">${error.message}</div>`;
    }
  });
});

function formatarNumero(valor, casas = 0) {
  return Number(valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: casas, maximumFractionDigits: casas });
}

function criarKpis(kpis) {
  return [
    ['Descartes', kpis.totalDescartes, 'registros'],
    ['Pontos', kpis.totalPontos, 'locais'],
    ['Usuários', kpis.totalUsuarios, 'contas'],
    ['Resíduos', `${formatarNumero(kpis.quantidadeKg, 2)} kg`, 'reciclados'],
    ['CO₂ evitado', `${formatarNumero(kpis.co2Evitado, 2)} kg`, 'estimativa'],
    ['Árvores', formatarNumero(kpis.arvoresPreservadas, 2), 'preservadas'],
    ['Água', `${formatarNumero(kpis.aguaEconomizada, 0)} L`, 'economizada']
  ].map(([titulo, valor, subtitulo]) => `<article class="card kpi"><strong>${valor}</strong><span>${titulo}</span><p>${subtitulo}</p></article>`).join('');
}

function barrasCategoria(categorias) {
  if (!categorias.length) return '<p>Nenhum descarte registrado.</p>';
  const max = Math.max(...categorias.map((item) => item.quantidadeKg));
  return categorias.map((item) => {
    const largura = Math.max(8, (item.quantidadeKg / max) * 100);
    return `<p><strong>${item.categoria}</strong> — ${formatarNumero(item.quantidadeKg, 2)} kg</p><div class="bar"><span style="width:${largura}%">${largura.toFixed(0)}%</span></div>`;
  }).join('');
}

function ranking(rankingPontos) {
  if (!rankingPontos.length) return '<p>Nenhum ponto com descarte registrado.</p>';
  return `<ol>${rankingPontos.map((ponto) => `<li><strong>${ponto.nome}</strong>: ${formatarNumero(ponto.quantidadeKg, 2)} kg</li>`).join('')}</ol>`;
}

async function carregarRelatorios() {
  const resposta = await fetch('/api/relatorios/resumo');
  const dados = await resposta.json();

  const relatorioKpis = document.getElementById('relatorioKpis');
  if (relatorioKpis) relatorioKpis.innerHTML = criarKpis(dados.kpis);

  const homeKpis = document.getElementById('homeKpis');
  if (homeKpis) {
    homeKpis.innerHTML = [
      ['Pontos de coleta', dados.kpis.totalPontos],
      ['Descartes registrados', dados.kpis.totalDescartes],
      ['Kg reciclados', formatarNumero(dados.kpis.quantidadeKg, 2)],
      ['CO₂ evitado', `${formatarNumero(dados.kpis.co2Evitado, 2)} kg`]
    ].map(([titulo, valor]) => `<article class="card kpi"><strong>${valor}</strong><span>${titulo}</span></article>`).join('');
  }

  const categoriasGrafico = document.getElementById('categoriasGrafico');
  if (categoriasGrafico) categoriasGrafico.innerHTML = barrasCategoria(dados.categorias);

  const rankingPontos = document.getElementById('rankingPontos');
  if (rankingPontos) rankingPontos.innerHTML = ranking(dados.rankingPontos);
}

document.addEventListener('DOMContentLoaded', carregarRelatorios);

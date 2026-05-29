const Descarte = require('../models/Descarte');
const PontoColeta = require('../models/PontoColeta');
const Usuario = require('../models/Usuario');

async function resumo(req, res, next) {
  try {
    const [descartes, pontos, usuarios] = await Promise.all([
      Descarte.find().populate('ponto', 'nome cidade'),
      PontoColeta.countDocuments(),
      Usuario.countDocuments()
    ]);

    const totais = descartes.reduce((acc, descarte) => {
      acc.quantidadeKg += descarte.quantidadeKg;
      acc.co2Evitado += descarte.co2Evitado;
      acc.arvoresPreservadas += descarte.arvoresPreservadas;
      acc.aguaEconomizada += descarte.aguaEconomizada;
      acc.totalDescartes += 1;
      acc.porCategoria[descarte.categoria] = (acc.porCategoria[descarte.categoria] || 0) + descarte.quantidadeKg;
      const nomePonto = descarte.ponto ? descarte.ponto.nome : 'Ponto removido';
      acc.porPonto[nomePonto] = (acc.porPonto[nomePonto] || 0) + descarte.quantidadeKg;
      return acc;
    }, {
      totalDescartes: 0,
      quantidadeKg: 0,
      co2Evitado: 0,
      arvoresPreservadas: 0,
      aguaEconomizada: 0,
      porCategoria: {},
      porPonto: {}
    });

    const rankingPontos = Object.entries(totais.porPonto)
      .map(([nome, quantidadeKg]) => ({ nome, quantidadeKg: Number(quantidadeKg.toFixed(2)) }))
      .sort((a, b) => b.quantidadeKg - a.quantidadeKg)
      .slice(0, 5);

    const categorias = Object.entries(totais.porCategoria)
      .map(([categoria, quantidadeKg]) => ({ categoria, quantidadeKg: Number(quantidadeKg.toFixed(2)) }))
      .sort((a, b) => b.quantidadeKg - a.quantidadeKg);

    return res.json({
      kpis: {
        totalDescartes: totais.totalDescartes,
        totalPontos: pontos,
        totalUsuarios: usuarios,
        quantidadeKg: Number(totais.quantidadeKg.toFixed(2)),
        co2Evitado: Number(totais.co2Evitado.toFixed(2)),
        arvoresPreservadas: Number(totais.arvoresPreservadas.toFixed(2)),
        aguaEconomizada: Number(totais.aguaEconomizada.toFixed(2))
      },
      categorias,
      rankingPontos
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  resumo
};

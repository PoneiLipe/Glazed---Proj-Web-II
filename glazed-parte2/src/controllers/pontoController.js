const PontoColeta = require('../models/PontoColeta');

async function listar(req, res, next) {
  try {
    const { cidade, busca } = req.query;
    const filtro = {};

    if (cidade) filtro.cidade = cidade;
    if (busca) filtro.nome = { $regex: busca, $options: 'i' };

    const pontos = await PontoColeta.find(filtro).sort({ cidade: 1, nome: 1 });
    return res.json({ total: pontos.length, pontos });
  } catch (error) {
    return next(error);
  }
}

async function buscarPorId(req, res, next) {
  try {
    const ponto = await PontoColeta.findById(req.params.id);
    if (!ponto) return res.status(404).json({ erro: 'Ponto de coleta não encontrado.' });
    return res.json({ ponto });
  } catch (error) {
    return next(error);
  }
}

async function criar(req, res, next) {
  try {
    const ponto = await PontoColeta.create(req.body);
    return res.status(201).json({ mensagem: 'Ponto de coleta cadastrado com sucesso.', ponto });
  } catch (error) {
    return next(error);
  }
}

async function atualizar(req, res, next) {
  try {
    const ponto = await PontoColeta.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!ponto) return res.status(404).json({ erro: 'Ponto de coleta não encontrado.' });
    return res.json({ mensagem: 'Ponto de coleta atualizado com sucesso.', ponto });
  } catch (error) {
    return next(error);
  }
}

async function remover(req, res, next) {
  try {
    const ponto = await PontoColeta.findByIdAndDelete(req.params.id);
    if (!ponto) return res.status(404).json({ erro: 'Ponto de coleta não encontrado.' });
    return res.json({ mensagem: 'Ponto de coleta removido com sucesso.' });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listar,
  buscarPorId,
  criar,
  atualizar,
  remover
};

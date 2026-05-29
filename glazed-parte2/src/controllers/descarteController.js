const Descarte = require('../models/Descarte');
const Usuario = require('../models/Usuario');

async function listar(req, res, next) {
  try {
    const descartes = await Descarte.find()
      .populate('usuario', 'nome email')
      .populate('ponto', 'nome cidade estado')
      .sort({ createdAt: -1 });
    return res.json({ total: descartes.length, descartes });
  } catch (error) {
    return next(error);
  }
}

async function criar(req, res, next) {
  try {
    const { usuarioId, usuarioEmail, ponto, categoria, quantidadeKg, observacoes } = req.body;

    let usuario = null;
    if (usuarioId) usuario = await Usuario.findById(usuarioId);
    if (!usuario && usuarioEmail) usuario = await Usuario.findOne({ email: usuarioEmail });

    if (!usuario) {
      return res.status(400).json({ erro: 'Usuário não encontrado. Faça login novamente.' });
    }

    const descarte = await Descarte.create({
      usuario: usuario._id,
      ponto,
      categoria,
      quantidadeKg,
      observacoes
    });

    const descarteCompleto = await Descarte.findById(descarte._id)
      .populate('usuario', 'nome email')
      .populate('ponto', 'nome cidade estado');

    return res.status(201).json({ mensagem: 'Descarte registrado com sucesso.', descarte: descarteCompleto });
  } catch (error) {
    return next(error);
  }
}

async function atualizar(req, res, next) {
  try {
    const descarte = await Descarte.findById(req.params.id);
    if (!descarte) return res.status(404).json({ erro: 'Descarte não encontrado.' });

    const campos = ['ponto', 'categoria', 'quantidadeKg', 'observacoes'];
    campos.forEach((campo) => {
      if (req.body[campo] !== undefined) descarte[campo] = req.body[campo];
    });

    await descarte.save();
    const atualizado = await Descarte.findById(descarte._id)
      .populate('usuario', 'nome email')
      .populate('ponto', 'nome cidade estado');

    return res.json({ mensagem: 'Descarte atualizado com sucesso.', descarte: atualizado });
  } catch (error) {
    return next(error);
  }
}

async function remover(req, res, next) {
  try {
    const descarte = await Descarte.findByIdAndDelete(req.params.id);
    if (!descarte) return res.status(404).json({ erro: 'Descarte não encontrado.' });
    return res.json({ mensagem: 'Descarte removido com sucesso.' });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listar,
  criar,
  atualizar,
  remover
};

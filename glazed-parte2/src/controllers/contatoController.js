const MensagemContato = require('../models/MensagemContato');

async function listar(req, res, next) {
  try {
    const mensagens = await MensagemContato.find().sort({ createdAt: -1 });
    return res.json({ total: mensagens.length, mensagens });
  } catch (error) {
    return next(error);
  }
}

async function criar(req, res, next) {
  try {
    const mensagem = await MensagemContato.create(req.body);
    return res.status(201).json({ mensagem: 'Mensagem enviada com sucesso.', contato: mensagem });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listar,
  criar
};

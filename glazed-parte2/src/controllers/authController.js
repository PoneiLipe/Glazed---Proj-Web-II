const Usuario = require('../models/Usuario');

async function cadastrar(req, res, next) {
  try {
    const { nome, email, senha } = req.body;
    if (!nome || !email || !senha) {
      return res.status(400).json({ erro: 'Nome, e-mail e senha são obrigatórios.' });
    }

    const existente = await Usuario.findOne({ email });
    if (existente) {
      return res.status(409).json({ erro: 'Já existe um usuário cadastrado com esse e-mail.' });
    }

    const usuario = await Usuario.criarComSenha({ nome, email, senha });
    return res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso.', usuario });
  } catch (error) {
    return next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) {
      return res.status(400).json({ erro: 'E-mail e senha são obrigatórios.' });
    }

    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(401).json({ erro: 'Credenciais inválidas.' });
    }

    const senhaValida = await usuario.validarSenha(senha);
    if (!senhaValida) {
      return res.status(401).json({ erro: 'Credenciais inválidas.' });
    }

    return res.json({ mensagem: 'Login realizado com sucesso.', usuario });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  cadastrar,
  login
};

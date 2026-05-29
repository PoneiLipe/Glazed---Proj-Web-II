const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UsuarioSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'O nome é obrigatório.'],
    trim: true,
    minlength: 2
  },
  email: {
    type: String,
    required: [true, 'O e-mail é obrigatório.'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Informe um e-mail válido.']
  },
  senhaHash: {
    type: String,
    required: [true, 'A senha é obrigatória.']
  },
  perfil: {
    type: String,
    enum: ['usuario', 'admin'],
    default: 'usuario'
  }
}, {
  timestamps: true
});

UsuarioSchema.statics.criarComSenha = async function criarComSenha({ nome, email, senha, perfil }) {
  const senhaHash = await bcrypt.hash(senha, 10);
  return this.create({ nome, email, senhaHash, perfil });
};

UsuarioSchema.methods.validarSenha = function validarSenha(senha) {
  return bcrypt.compare(senha, this.senhaHash);
};

UsuarioSchema.methods.toJSON = function toJSON() {
  const obj = this.toObject();
  delete obj.senhaHash;
  return obj;
};

module.exports = mongoose.model('Usuario', UsuarioSchema);

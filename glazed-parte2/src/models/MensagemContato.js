const mongoose = require('mongoose');

const MensagemContatoSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'O nome é obrigatório.'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'O e-mail é obrigatório.'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Informe um e-mail válido.']
  },
  telefone: {
    type: String,
    trim: true,
    default: ''
  },
  assunto: {
    type: String,
    required: [true, 'O assunto é obrigatório.'],
    trim: true
  },
  mensagem: {
    type: String,
    required: [true, 'A mensagem é obrigatória.'],
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('MensagemContato', MensagemContatoSchema);

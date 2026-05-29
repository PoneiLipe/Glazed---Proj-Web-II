const mongoose = require('mongoose');

const PontoColetaSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'O nome do ponto é obrigatório.'],
    trim: true
  },
  cidade: {
    type: String,
    required: [true, 'A cidade é obrigatória.'],
    trim: true
  },
  estado: {
    type: String,
    required: [true, 'O estado é obrigatório.'],
    trim: true,
    maxlength: 2
  },
  bairro: {
    type: String,
    required: [true, 'O bairro é obrigatório.'],
    trim: true
  },
  endereco: {
    type: String,
    required: [true, 'O endereço é obrigatório.'],
    trim: true
  },
  contato: {
    type: String,
    trim: true,
    default: ''
  },
  tiposAceitos: [{
    type: String,
    enum: ['Plástico', 'Vidro', 'Metal', 'Papel', 'Orgânico', 'Eletrônico', 'Óleo', 'Bateria']
  }],
  horario: {
    type: String,
    required: [true, 'O horário é obrigatório.'],
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('PontoColeta', PontoColetaSchema);

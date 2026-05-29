const mongoose = require('mongoose');

const DescarteSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: [true, 'O usuário é obrigatório.']
  },
  ponto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PontoColeta',
    required: [true, 'O ponto de coleta é obrigatório.']
  },
  categoria: {
    type: String,
    required: [true, 'A categoria é obrigatória.'],
    enum: ['Plástico', 'Vidro', 'Metal', 'Papel', 'Orgânico', 'Eletrônico', 'Óleo', 'Bateria']
  },
  quantidadeKg: {
    type: Number,
    required: [true, 'A quantidade é obrigatória.'],
    min: 0.01
  },
  observacoes: {
    type: String,
    trim: true,
    default: ''
  },
  co2Evitado: {
    type: Number,
    default: 0
  },
  arvoresPreservadas: {
    type: Number,
    default: 0
  },
  aguaEconomizada: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const fatoresImpacto = {
  Plástico: { co2: 2.5, arvores: 0.1, agua: 50 },
  Vidro: { co2: 1.2, arvores: 0.05, agua: 30 },
  Metal: { co2: 3.0, arvores: 0.15, agua: 80 },
  Papel: { co2: 1.8, arvores: 0.2, agua: 40 },
  Orgânico: { co2: 0.5, arvores: 0.05, agua: 20 },
  Eletrônico: { co2: 4.0, arvores: 0.18, agua: 90 },
  Óleo: { co2: 2.2, arvores: 0.08, agua: 120 },
  Bateria: { co2: 3.8, arvores: 0.12, agua: 100 }
};

DescarteSchema.pre('save', function calcularImpacto() {
  const fator = fatoresImpacto[this.categoria] || { co2: 0, arvores: 0, agua: 0 };
  this.co2Evitado = Number((this.quantidadeKg * fator.co2).toFixed(2));
  this.arvoresPreservadas = Number((this.quantidadeKg * fator.arvores).toFixed(2));
  this.aguaEconomizada = Number((this.quantidadeKg * fator.agua).toFixed(2));
});

DescarteSchema.statics.fatoresImpacto = fatoresImpacto;

module.exports = mongoose.model('Descarte', DescarteSchema);

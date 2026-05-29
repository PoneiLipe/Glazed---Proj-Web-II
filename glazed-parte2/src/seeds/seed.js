require('dotenv').config();

const mongoose = require('mongoose');
const { connectDatabase, disconnectDatabase } = require('../config/database');
const Usuario = require('../models/Usuario');
const PontoColeta = require('../models/PontoColeta');
const Descarte = require('../models/Descarte');

const pontosIniciais = [
  { nome: 'Ponto Verde Centro', cidade: 'São Paulo', estado: 'SP', bairro: 'Centro', endereco: 'Rua da Sustentabilidade, 123', contato: '(11) 3000-1000', tiposAceitos: ['Plástico', 'Vidro', 'Metal', 'Papel'], horario: 'Segunda a sexta, 08h às 18h' },
  { nome: 'Eco Coleta Norte', cidade: 'São Paulo', estado: 'SP', bairro: 'Santana', endereco: 'Avenida Recicla, 456', contato: '(11) 3000-2000', tiposAceitos: ['Eletrônico', 'Bateria', 'Metal'], horario: 'Segunda a sábado, 09h às 17h' },
  { nome: 'Recicla Rio', cidade: 'Rio de Janeiro', estado: 'RJ', bairro: 'Botafogo', endereco: 'Rua Circular, 789', contato: '(21) 3000-3000', tiposAceitos: ['Plástico', 'Vidro', 'Papel', 'Óleo'], horario: 'Segunda a sexta, 08h às 19h' },
  { nome: 'Sustenta BH', cidade: 'Belo Horizonte', estado: 'MG', bairro: 'Savassi', endereco: 'Avenida Verde, 101', contato: '(31) 3000-4000', tiposAceitos: ['Orgânico', 'Papel', 'Plástico'], horario: 'Todos os dias, 07h às 18h' },
  { nome: 'Verde Curitiba', cidade: 'Curitiba', estado: 'PR', bairro: 'Batel', endereco: 'Rua Ecológica, 202', contato: '(41) 3000-5000', tiposAceitos: ['Vidro', 'Metal', 'Óleo'], horario: 'Segunda a sábado, 08h às 17h' },
  { nome: 'Ponto Sustentável', cidade: 'Campinas', estado: 'SP', bairro: 'Cambuí', endereco: 'Rua Ambiental, 303', contato: '(19) 3000-6000', tiposAceitos: ['Plástico', 'Papel', 'Orgânico'], horario: 'Segunda a sexta, 09h às 18h' },
  { nome: 'Coleta Responsável', cidade: 'Santos', estado: 'SP', bairro: 'Gonzaga', endereco: 'Avenida do Mar, 404', contato: '(13) 3000-7000', tiposAceitos: ['Vidro', 'Metal', 'Bateria'], horario: 'Segunda a sábado, 08h às 18h' },
  { nome: 'Reciclagem Inteligente', cidade: 'Ribeirão Preto', estado: 'SP', bairro: 'Centro', endereco: 'Rua Circular, 505', contato: '(16) 3000-8000', tiposAceitos: ['Eletrônico', 'Papel', 'Plástico'], horario: 'Segunda a sexta, 07h às 19h' },
  { nome: 'Ponto Eco', cidade: 'Sorocaba', estado: 'SP', bairro: 'Campolim', endereco: 'Rua Verde, 606', contato: '(15) 3000-9000', tiposAceitos: ['Orgânico', 'Óleo', 'Papel'], horario: 'Segunda a sábado, 08h às 17h' },
  { nome: 'Centro de Reciclagem', cidade: 'Jundiaí', estado: 'SP', bairro: 'Anhangabaú', endereco: 'Avenida Sustentável, 707', contato: '(11) 3000-0000', tiposAceitos: ['Plástico', 'Vidro', 'Metal', 'Papel', 'Eletrônico'], horario: 'Segunda a sexta, 09h às 18h' }
];

async function seedIfEmpty() {
  const totalPontos = await PontoColeta.countDocuments();
  const totalUsuarios = await Usuario.countDocuments();

  let usuario = await Usuario.findOne({ email: 'demo@glazed.com' });
  if (!usuario && totalUsuarios === 0) {
    usuario = await Usuario.criarComSenha({ nome: 'Usuário Demonstração', email: 'demo@glazed.com', senha: '123456', perfil: 'admin' });
  }

  if (totalPontos === 0) {
    const pontos = await PontoColeta.insertMany(pontosIniciais);
    if (usuario) {
      await Descarte.insertMany([
        { usuario: usuario._id, ponto: pontos[0]._id, categoria: 'Plástico', quantidadeKg: 4.5, observacoes: 'Garrafas PET e embalagens.' },
        { usuario: usuario._id, ponto: pontos[2]._id, categoria: 'Vidro', quantidadeKg: 8.2, observacoes: 'Potes e garrafas de vidro.' },
        { usuario: usuario._id, ponto: pontos[4]._id, categoria: 'Metal', quantidadeKg: 2.7, observacoes: 'Latas de alumínio.' },
        { usuario: usuario._id, ponto: pontos[5]._id, categoria: 'Papel', quantidadeKg: 6.4, observacoes: 'Caixas e folhas usadas.' }
      ]);
    }
    console.log('Dados iniciais inseridos com sucesso.');
  }
}

async function runSeed() {
  await connectDatabase();
  await seedIfEmpty();
  await disconnectDatabase();
}

if (require.main === module) {
  runSeed()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Erro ao executar seed:', error);
      if (mongoose.connection.readyState !== 0) mongoose.disconnect();
      process.exit(1);
    });
}

module.exports = {
  seedIfEmpty,
  pontosIniciais
};

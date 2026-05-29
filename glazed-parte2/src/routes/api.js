const express = require('express');
const authController = require('../controllers/authController');
const pontoController = require('../controllers/pontoController');
const descarteController = require('../controllers/descarteController');
const contatoController = require('../controllers/contatoController');
const relatorioController = require('../controllers/relatorioController');

const router = express.Router();

router.post('/auth/cadastro', authController.cadastrar);
router.post('/auth/login', authController.login);

router.get('/pontos', pontoController.listar);
router.get('/pontos/:id', pontoController.buscarPorId);
router.post('/pontos', pontoController.criar);
router.put('/pontos/:id', pontoController.atualizar);
router.delete('/pontos/:id', pontoController.remover);

router.get('/descartes', descarteController.listar);
router.post('/descartes', descarteController.criar);
router.put('/descartes/:id', descarteController.atualizar);
router.delete('/descartes/:id', descarteController.remover);

router.get('/relatorios/resumo', relatorioController.resumo);

router.get('/contatos', contatoController.listar);
router.post('/contatos', contatoController.criar);

module.exports = router;

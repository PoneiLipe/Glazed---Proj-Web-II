const express = require('express');

const router = express.Router();

const renderPage = (view, title) => (req, res) => res.render(view, { title });

router.get('/', renderPage('index', 'Início'));
router.get('/login', renderPage('login', 'Login'));
router.get('/cadastro', renderPage('cadastro', 'Cadastro'));
router.get('/pontos', renderPage('pontos', 'Pontos de Coleta'));
router.get('/descarte', renderPage('descarte', 'Registrar Descarte'));
router.get('/relatorios', renderPage('relatorios', 'Relatórios'));
router.get('/sobre', renderPage('sobre', 'Sobre'));
router.get('/contato', renderPage('contato', 'Contato'));

module.exports = router;

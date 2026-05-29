require('dotenv').config();

const express = require('express');
const path = require('path');
const morgan = require('morgan');
const methodOverride = require('method-override');
const { connectDatabase } = require('./src/config/database');
const pagesRoutes = require('./src/routes/pages');
const apiRoutes = require('./src/routes/api');
const { seedIfEmpty } = require('./src/seeds/seed');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', pagesRoutes);
app.use('/api', apiRoutes);

app.use((req, res) => {
  res.status(404).render('404', { title: 'Página não encontrada' });
});

app.use((error, req, res, next) => {
  console.error(error);
  const status = error.status || 500;
  if (req.originalUrl.startsWith('/api')) {
    return res.status(status).json({ erro: error.message || 'Erro interno do servidor' });
  }
  return res.status(status).render('erro', {
    title: 'Erro',
    mensagem: error.message || 'Erro interno do servidor'
  });
});

async function start() {
  await connectDatabase();
  await seedIfEmpty();
  app.listen(PORT, () => {
    console.log(`Servidor GLAZED executando em http://localhost:${PORT}`);
  });
}

if (require.main === module) {
  start().catch((error) => {
    console.error('Falha ao iniciar servidor:', error.message);
    process.exit(1);
  });
}

module.exports = app;

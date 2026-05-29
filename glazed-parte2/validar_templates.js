const ejs = require('ejs');
const path = require('path');

const paginas = ['index', 'login', 'cadastro', 'pontos', 'descarte', 'relatorios', 'sobre', 'contato', '404', 'erro'];

async function validar() {
  for (const pagina of paginas) {
    const arquivo = path.join(__dirname, 'views', `${pagina}.ejs`);
    await ejs.renderFile(arquivo, {
      title: pagina,
      mensagem: 'Mensagem de teste'
    });
    console.log(`Template OK: ${pagina}.ejs`);
  }
}

validar().catch((error) => {
  console.error(error);
  process.exit(1);
});

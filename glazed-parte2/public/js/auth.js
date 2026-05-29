function getUsuarioLogado() {
  const raw = localStorage.getItem('glazedUsuario');
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

function salvarUsuario(usuario) {
  localStorage.setItem('glazedUsuario', JSON.stringify(usuario));
}

function exigirLogin() {
  if (!getUsuarioLogado()) {
    window.location.href = '/login';
    return false;
  }
  return true;
}

function atualizarMenu() {
  const usuario = getUsuarioLogado();
  const loginLink = document.getElementById('loginLink');
  const logoutLink = document.getElementById('logoutLink');
  if (usuario) {
    loginLink?.classList.add('hidden');
    logoutLink?.classList.remove('hidden');
  } else {
    loginLink?.classList.remove('hidden');
    logoutLink?.classList.add('hidden');
  }

  document.querySelectorAll('.menu a').forEach((link) => {
    if (link.getAttribute('href') === window.location.pathname) link.classList.add('active');
  });
}

async function postJSON(url, dados) {
  const resposta = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados)
  });
  const json = await resposta.json();
  if (!resposta.ok) throw new Error(json.erro || 'Erro ao processar solicitação.');
  return json;
}

document.addEventListener('DOMContentLoaded', () => {
  atualizarMenu();
  document.getElementById('logoutLink')?.addEventListener('click', (event) => {
    event.preventDefault();
    localStorage.removeItem('glazedUsuario');
    window.location.href = '/login';
  });
});

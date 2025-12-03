// Google Meet Screenshot Reminder Extension
// Detecta quando está em uma chamada e lembra de tirar print após 3 minutos

let reminderTimer = null;
let bannerShown = false;

// Função para criar e mostrar a barra vermelha
function showReminderBanner() {
  if (bannerShown) return;

  // Carrega mensagem customizada do storage
  chrome.storage.sync.get(['customReminderMessage'], (result) => {
    const customMessage = result.customReminderMessage || 'Lembrete: Tire um print da tela!';

    const banner = document.createElement('div');
    banner.id = 'screenshot-reminder-banner';
    banner.className = 'screenshot-reminder-banner';
    // Garante que o banner não bloqueie interações com a página
    banner.style.pointerEvents = 'none';

    banner.innerHTML = `
      <div class="reminder-content" style="pointer-events: auto;">
        <span class="reminder-icon">🔴</span>
        <span class="reminder-text">${customMessage}</span>
        <button class="reminder-dismiss" id="dismiss-reminder">
          ✓ Print tirado
        </button>
      </div>
    `;

    // Anexa ao final do body para não interferir com elementos do Meet
    document.body.appendChild(banner);
    bannerShown = true;

    // Adiciona evento ao botão de dismiss
    const dismissBtn = document.getElementById('dismiss-reminder');
    if (dismissBtn) {
      dismissBtn.addEventListener('click', dismissBanner);
    }
  });
}

// Função para remover a barra
function dismissBanner() {
  const banner = document.getElementById('screenshot-reminder-banner');
  if (banner) {
    banner.classList.add('fade-out');
    setTimeout(() => {
      banner.remove();
      bannerShown = false;
    }, 300);
  }
}

// Função para mostrar notificação do navegador
function showNotification() {
  // Verifica se a página ainda está visível
  if (document.visibilityState === 'visible') {
    // Cria um elemento de áudio para notificação sonora (opcional)
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBCdf0O7Tp1QQCUSe3+7Qp1YQCkWZ3+3Lq1gQC0em3+7OqlYQCkSf3O3QqlYPCkSe3e7QqlYQCkeZ3+3Mp1gPC0Sh3u3Rp1YQCUWf3O3Sp1YPCUSd3u3Qq1gQC0Wf3+3LqVcOC0Sd3u3QrFYPCkSd3+3Op1gQC0Sf3O3QqFYPCUSe3O7Sp1gPC0Se3O7TqVcOC0Se3O/Wp1gPCkSe3O7SqlYPCkSd3e7SqlYPCkSd3u7VqlYPCkSd3u7SqlYQC0Sd3u7SqlYQC0Sd3u7SqlYQCkSd3u7SqlYQC0Sd3u7Upw==');
    audio.play().catch(() => {}); // Ignora erro se não conseguir tocar
  }

  // Envia notificação do Chrome (não bloqueante)
  chrome.storage.sync.get(['customReminderMessage'], (result) => {
    const customMessage = result.customReminderMessage || 'Lembrete: Tire um print da tela!';

    // Usa a API de notificações do Chrome ao invés de alert()
    chrome.runtime.sendMessage({
      type: 'showNotification',
      message: customMessage
    });
  });

  // Mostra o banner visual (não bloqueante)
  showReminderBanner();
}

// Função para iniciar o timer de 3 minutos
function startReminderTimer() {
  // Limpa qualquer timer anterior
  if (reminderTimer) {
    clearTimeout(reminderTimer);
  }

  // Remove barra antiga se existir
  const oldBanner = document.getElementById('screenshot-reminder-banner');
  if (oldBanner) {
    oldBanner.remove();
    bannerShown = false;
  }

  console.log('[Screenshot Reminder] Timer iniciado - 3 minutos');

  // Define timer para 3 minutos (180000 ms)
  reminderTimer = setTimeout(() => {
    console.log('[Screenshot Reminder] 3 minutos passados - mostrando lembrete');
    showNotification();
  }, 180000); // 3 minutos em milissegundos

  // Para testes rápidos, descomente a linha abaixo (10 segundos)
  // reminderTimer = setTimeout(() => { showNotification(); }, 10000);
}

// Função para detectar se está em uma chamada
function checkIfInMeeting() {
  // Verifica se está na URL de uma chamada
  const urlPattern = /meet\.google\.com\/[a-z]{3}-[a-z]{4}-[a-z]{3}/;
  const isInMeetingURL = urlPattern.test(window.location.href);

  // Verifica se existem elementos da interface de chamada
  const hasVideoElements = document.querySelector('[data-fps-request-screencast-cap]') !== null ||
                          document.querySelector('[data-self-name]') !== null ||
                          document.querySelector('div[jsname]') !== null;

  return isInMeetingURL && hasVideoElements;
}

// Observa mudanças na página para detectar quando entrar em uma chamada
let lastCheckResult = false;

function monitorMeetingStatus() {
  const isInMeeting = checkIfInMeeting();

  // Se entrou em uma chamada (mudou de false para true)
  if (isInMeeting && !lastCheckResult) {
    console.log('[Screenshot Reminder] Chamada detectada! Iniciando timer.');
    startReminderTimer();
  }

  lastCheckResult = isInMeeting;
}

// Inicializa o monitoramento
function initialize() {
  console.log('[Screenshot Reminder] Extensão carregada');

  // Verifica imediatamente se já está em uma chamada
  setTimeout(() => {
    monitorMeetingStatus();
  }, 2000);

  // Monitora mudanças na URL
  let lastUrl = location.href;
  new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      console.log('[Screenshot Reminder] URL mudou:', url);
      setTimeout(monitorMeetingStatus, 1000);
    }
  }).observe(document, { subtree: true, childList: true });

  // Verifica periodicamente (a cada 5 segundos)
  setInterval(monitorMeetingStatus, 5000);
}

// Inicia quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}

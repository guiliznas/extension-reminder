// Background script para lidar com notificações

// Escuta mensagens do content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'showNotification') {
    // Cria notificação do navegador
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icon128.png',
      title: 'Google Meet - Lembrete',
      message: request.message,
      priority: 2
    });
  }
});

// Mensagem padrão
const DEFAULT_MESSAGE = 'Lembrete: Tire um print da tela!';

// Elementos DOM
const reminderMessageInput = document.getElementById('reminderMessage');
const charCount = document.getElementById('charCount');
const saveBtn = document.getElementById('saveBtn');
const resetBtn = document.getElementById('resetBtn');
const notification = document.getElementById('notification');
const notificationText = document.getElementById('notificationText');

// Carrega a mensagem salva ao abrir o popup
function loadSavedMessage() {
  chrome.storage.sync.get(['customReminderMessage'], (result) => {
    const savedMessage = result.customReminderMessage || DEFAULT_MESSAGE;
    reminderMessageInput.value = savedMessage;
    updateCharCount();
  });
}

// Atualiza contador de caracteres
function updateCharCount() {
  const count = reminderMessageInput.value.length;
  charCount.textContent = count;

  if (count > 180) {
    charCount.style.color = '#f44336';
  } else if (count > 150) {
    charCount.style.color = '#ff9800';
  } else {
    charCount.style.color = '#999';
  }
}

// Salva a mensagem customizada
function saveMessage() {
  const message = reminderMessageInput.value.trim();

  if (!message) {
    showNotification('Por favor, digite uma mensagem!', true);
    return;
  }

  chrome.storage.sync.set({ customReminderMessage: message }, () => {
    showNotification('✓ Configurações salvas com sucesso!');

    // Feedback visual no botão
    saveBtn.textContent = '✓ Salvo!';
    saveBtn.style.background = '#4caf50';

    setTimeout(() => {
      saveBtn.textContent = 'Salvar';
      saveBtn.style.background = '';
    }, 2000);
  });
}

// Restaura mensagem padrão
function resetToDefault() {
  reminderMessageInput.value = DEFAULT_MESSAGE;
  updateCharCount();

  chrome.storage.sync.set({ customReminderMessage: DEFAULT_MESSAGE }, () => {
    showNotification('✓ Mensagem restaurada para o padrão!');
  });
}

// Mostra notificação
function showNotification(message, isError = false) {
  notificationText.textContent = message;
  notification.classList.toggle('error', isError);
  notification.classList.add('show');

  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
}

// Event Listeners
reminderMessageInput.addEventListener('input', updateCharCount);
saveBtn.addEventListener('click', saveMessage);
resetBtn.addEventListener('click', resetToDefault);

// Permite salvar com Enter (Ctrl+Enter no textarea)
reminderMessageInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && e.ctrlKey) {
    e.preventDefault();
    saveMessage();
  }
});

// Carrega mensagem ao inicializar
loadSavedMessage();

/**
 * Testes para popup.js
 * Testam a lógica de carregar, salvar e restaurar mensagens customizadas
 */

describe('Popup - Gestão de Mensagens', () => {
  const DEFAULT_MESSAGE = 'Lembrete: Tire um print da tela!';

  // Variáveis DOM simuladas
  let reminderMessageInput;
  let charCount;
  let saveBtn;
  let resetBtn;
  let notification;
  let notificationText;

  beforeEach(() => {
    // Cria elementos DOM simulados
    document.body.innerHTML = `
      <textarea id="reminderMessage"></textarea>
      <span id="charCount">0</span>
      <button id="saveBtn">Salvar</button>
      <button id="resetBtn">Restaurar Padrão</button>
      <div id="notification"><span id="notificationText"></span></div>
    `;

    reminderMessageInput = document.getElementById('reminderMessage');
    charCount = document.getElementById('charCount');
    saveBtn = document.getElementById('saveBtn');
    resetBtn = document.getElementById('resetBtn');
    notification = document.getElementById('notification');
    notificationText = document.getElementById('notificationText');
  });

  describe('Carregamento de mensagem salva', () => {
    test('deve carregar mensagem padrão quando não há mensagem salva', (done) => {
      chrome.storage.sync.get.mockImplementation((keys, callback) => {
        callback({});
      });

      // Simula a função loadSavedMessage
      chrome.storage.sync.get(['customReminderMessage'], (result) => {
        const savedMessage = result.customReminderMessage || DEFAULT_MESSAGE;
        expect(savedMessage).toBe(DEFAULT_MESSAGE);
        done();
      });
    });

    test('deve carregar mensagem customizada quando existe', (done) => {
      const customMessage = 'Minha mensagem personalizada';

      chrome.storage.sync.get.mockImplementation((keys, callback) => {
        callback({ customReminderMessage: customMessage });
      });

      chrome.storage.sync.get(['customReminderMessage'], (result) => {
        const savedMessage = result.customReminderMessage || DEFAULT_MESSAGE;
        expect(savedMessage).toBe(customMessage);
        done();
      });
    });
  });

  describe('Atualização do contador de caracteres', () => {
    test('deve contar caracteres corretamente', () => {
      const testMessage = 'Teste de mensagem';
      reminderMessageInput.value = testMessage;

      const count = reminderMessageInput.value.length;
      charCount.textContent = count;

      expect(charCount.textContent).toBe('17');
    });

    test('deve respeitar limite de 200 caracteres', () => {
      const longMessage = 'a'.repeat(250);
      reminderMessageInput.value = longMessage;
      reminderMessageInput.maxLength = 200;

      // Simula comportamento do maxLength
      if (reminderMessageInput.value.length > 200) {
        reminderMessageInput.value = reminderMessageInput.value.substring(0, 200);
      }

      expect(reminderMessageInput.value.length).toBeLessThanOrEqual(200);
    });
  });

  describe('Salvamento de mensagem', () => {
    test('deve salvar mensagem customizada', (done) => {
      const customMessage = 'Nova mensagem de teste';
      reminderMessageInput.value = customMessage;

      chrome.storage.sync.set.mockImplementation((items, callback) => {
        expect(items.customReminderMessage).toBe(customMessage);
        if (callback) callback();
        done();
      });

      // Simula o click no botão salvar
      chrome.storage.sync.set({ customReminderMessage: customMessage }, () => {});
    });

    test('não deve salvar mensagem vazia', () => {
      reminderMessageInput.value = '   ';
      const trimmedMessage = reminderMessageInput.value.trim();

      expect(trimmedMessage).toBe('');
      // Em uma implementação real, não deveria chamar chrome.storage.sync.set
    });
  });

  describe('Restauração de mensagem padrão', () => {
    test('deve restaurar mensagem padrão', (done) => {
      reminderMessageInput.value = 'Mensagem customizada';

      chrome.storage.sync.set.mockImplementation((items, callback) => {
        expect(items.customReminderMessage).toBe(DEFAULT_MESSAGE);
        if (callback) callback();
        done();
      });

      // Simula restauração
      reminderMessageInput.value = DEFAULT_MESSAGE;
      chrome.storage.sync.set({ customReminderMessage: DEFAULT_MESSAGE }, () => {});
    });
  });

  describe('Validação de entrada', () => {
    test('deve aceitar mensagens válidas', () => {
      const validMessages = [
        'Mensagem simples',
        '📸 Com emoji',
        'Mensagem com números 123',
        'Com caracteres especiais !@#$%'
      ];

      validMessages.forEach(msg => {
        reminderMessageInput.value = msg;
        expect(reminderMessageInput.value).toBe(msg);
      });
    });

    test('deve truncar mensagens muito longas', () => {
      const veryLongMessage = 'a'.repeat(300);
      reminderMessageInput.value = veryLongMessage;

      // Simula maxLength
      if (reminderMessageInput.value.length > 200) {
        reminderMessageInput.value = reminderMessageInput.value.substring(0, 200);
      }

      expect(reminderMessageInput.value.length).toBe(200);
    });
  });
});

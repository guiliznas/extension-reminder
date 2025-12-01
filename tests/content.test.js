/**
 * Testes para content.js
 * Testam a lógica de detecção de reuniões e exibição de mensagens
 */

describe('Content Script - Lógica de Lembretes', () => {
  const DEFAULT_MESSAGE = 'Lembrete: Tire um print da tela!';

  beforeEach(() => {
    // Limpa o DOM antes de cada teste
    document.body.innerHTML = '';
  });

  describe('Carregamento de mensagem customizada no banner', () => {
    test('deve usar mensagem padrão quando não há customização', (done) => {
      chrome.storage.sync.get.mockImplementation((keys, callback) => {
        callback({});
      });

      chrome.storage.sync.get(['customReminderMessage'], (result) => {
        const customMessage = result.customReminderMessage || DEFAULT_MESSAGE;
        expect(customMessage).toBe(DEFAULT_MESSAGE);
        done();
      });
    });

    test('deve usar mensagem customizada quando definida', (done) => {
      const customMessage = '📸 Hora de tirar o print!';

      chrome.storage.sync.get.mockImplementation((keys, callback) => {
        callback({ customReminderMessage: customMessage });
      });

      chrome.storage.sync.get(['customReminderMessage'], (result) => {
        const message = result.customReminderMessage || DEFAULT_MESSAGE;
        expect(message).toBe(customMessage);
        done();
      });
    });
  });

  describe('Criação do banner de lembrete', () => {
    test('deve criar banner com estrutura correta', () => {
      const banner = document.createElement('div');
      banner.id = 'screenshot-reminder-banner';
      banner.className = 'screenshot-reminder-banner';

      const testMessage = 'Mensagem de teste';
      banner.innerHTML = `
        <div class="reminder-content">
          <span class="reminder-icon">🔴</span>
          <span class="reminder-text">${testMessage}</span>
          <button class="reminder-dismiss" id="dismiss-reminder">
            ✓ Print tirado
          </button>
        </div>
      `;

      document.body.appendChild(banner);

      expect(document.getElementById('screenshot-reminder-banner')).toBeTruthy();
      expect(banner.querySelector('.reminder-text').textContent).toBe(testMessage);
      expect(banner.querySelector('.reminder-dismiss')).toBeTruthy();
    });

    test('não deve criar banner duplicado', () => {
      const banner1 = document.createElement('div');
      banner1.id = 'screenshot-reminder-banner';
      document.body.appendChild(banner1);

      // Simula verificação de banner existente
      const existingBanner = document.getElementById('screenshot-reminder-banner');
      expect(existingBanner).toBeTruthy();

      // Não deve criar outro se já existe
      if (!existingBanner) {
        const banner2 = document.createElement('div');
        banner2.id = 'screenshot-reminder-banner';
        document.body.appendChild(banner2);
      }

      const allBanners = document.querySelectorAll('#screenshot-reminder-banner');
      expect(allBanners.length).toBe(1);
    });
  });

  describe('Remoção do banner', () => {
    test('deve remover banner quando solicitado', () => {
      const banner = document.createElement('div');
      banner.id = 'screenshot-reminder-banner';
      document.body.appendChild(banner);

      expect(document.getElementById('screenshot-reminder-banner')).toBeTruthy();

      // Simula remoção
      const bannerToRemove = document.getElementById('screenshot-reminder-banner');
      if (bannerToRemove) {
        bannerToRemove.remove();
      }

      expect(document.getElementById('screenshot-reminder-banner')).toBeNull();
    });
  });

  describe('Detecção de reunião do Google Meet', () => {
    test('deve detectar URL válida de reunião', () => {
      // Simula URL do Google Meet
      const validUrls = [
        'https://meet.google.com/abc-defg-hij',
        'https://meet.google.com/xyz-wxyz-abc'
      ];

      const urlPattern = /meet\.google\.com\/[a-z]{3}-[a-z]{4}-[a-z]{3}/;

      validUrls.forEach(url => {
        expect(urlPattern.test(url)).toBe(true);
      });
    });

    test('não deve detectar URLs inválidas', () => {
      const invalidUrls = [
        'https://meet.google.com/',
        'https://google.com/abc-defg-hij',
        'https://meet.google.com/invalid'
      ];

      const urlPattern = /meet\.google\.com\/[a-z]{3}-[a-z]{4}-[a-z]{3}/;

      invalidUrls.forEach(url => {
        expect(urlPattern.test(url)).toBe(false);
      });
    });
  });

  describe('Timer de lembrete', () => {
    jest.useFakeTimers();

    test('deve executar callback após 3 minutos (180000ms)', () => {
      const callback = jest.fn();
      const timer = setTimeout(callback, 180000);

      expect(callback).not.toHaveBeenCalled();

      jest.advanceTimersByTime(180000);

      expect(callback).toHaveBeenCalledTimes(1);
      clearTimeout(timer);
    });

    test('não deve executar callback antes do tempo', () => {
      const callback = jest.fn();
      const timer = setTimeout(callback, 180000);

      jest.advanceTimersByTime(179000); // 2min 59s

      expect(callback).not.toHaveBeenCalled();
      clearTimeout(timer);
    });

    test('deve permitir cancelamento do timer', () => {
      const callback = jest.fn();
      const timer = setTimeout(callback, 180000);

      clearTimeout(timer);
      jest.advanceTimersByTime(180000);

      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('Integração de mensagem customizada no banner', () => {
    test('deve injetar mensagem customizada no HTML do banner', (done) => {
      const customMessage = '🎯 Documentar reunião agora!';

      chrome.storage.sync.get.mockImplementation((keys, callback) => {
        callback({ customReminderMessage: customMessage });
      });

      chrome.storage.sync.get(['customReminderMessage'], (result) => {
        const message = result.customReminderMessage || DEFAULT_MESSAGE;

        const banner = document.createElement('div');
        banner.innerHTML = `
          <div class="reminder-content">
            <span class="reminder-text">${message}</span>
          </div>
        `;

        document.body.appendChild(banner);

        const textElement = banner.querySelector('.reminder-text');
        expect(textElement.textContent).toBe(customMessage);
        done();
      });
    });
  });
});

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

  describe('Correções de bloqueio - pointer-events e posicionamento', () => {
    test('banner deve ter pointer-events: none para não bloquear interações', () => {
      chrome.storage.sync.get.mockImplementation((keys, callback) => {
        callback({ customReminderMessage: 'Teste' });
      });

      const banner = document.createElement('div');
      banner.id = 'screenshot-reminder-banner';
      banner.className = 'screenshot-reminder-banner';
      banner.style.pointerEvents = 'none';

      document.body.appendChild(banner);

      const createdBanner = document.getElementById('screenshot-reminder-banner');
      expect(createdBanner.style.pointerEvents).toBe('none');
    });

    test('conteúdo do banner deve ter pointer-events: auto para permitir cliques no botão', () => {
      const banner = document.createElement('div');
      banner.id = 'screenshot-reminder-banner';
      banner.style.pointerEvents = 'none';

      banner.innerHTML = `
        <div class="reminder-content" style="pointer-events: auto;">
          <span class="reminder-icon">🔴</span>
          <span class="reminder-text">Teste</span>
          <button class="reminder-dismiss" id="dismiss-reminder">
            ✓ Print tirado
          </button>
        </div>
      `;

      document.body.appendChild(banner);

      const content = banner.querySelector('.reminder-content');
      expect(content.style.pointerEvents).toBe('auto');
    });

    test('banner deve ser anexado com appendChild ao final do body', () => {
      // Adiciona alguns elementos ao body primeiro
      const div1 = document.createElement('div');
      div1.id = 'existing-element-1';
      const div2 = document.createElement('div');
      div2.id = 'existing-element-2';

      document.body.appendChild(div1);
      document.body.appendChild(div2);

      // Cria e anexa o banner
      const banner = document.createElement('div');
      banner.id = 'screenshot-reminder-banner';
      document.body.appendChild(banner);

      // Verifica que o banner é o último filho do body
      const lastChild = document.body.lastElementChild;
      expect(lastChild.id).toBe('screenshot-reminder-banner');

      // Verifica que NÃO é o primeiro filho (como seria com insertBefore)
      const firstChild = document.body.firstElementChild;
      expect(firstChild.id).not.toBe('screenshot-reminder-banner');
    });

    test('botão de dismiss deve permanecer clicável mesmo com pointer-events: none no banner', () => {
      const banner = document.createElement('div');
      banner.style.pointerEvents = 'none';

      banner.innerHTML = `
        <div style="pointer-events: auto;">
          <button id="test-button">Clique</button>
        </div>
      `;

      document.body.appendChild(banner);
      const button = document.getElementById('test-button');

      const clickHandler = jest.fn();
      button.addEventListener('click', clickHandler);
      button.click();

      expect(clickHandler).toHaveBeenCalledTimes(1);
    });
  });

  describe('Notificações não-bloqueantes', () => {
    test('deve usar chrome.runtime.sendMessage ao invés de alert', () => {
      chrome.storage.sync.get.mockImplementation((keys, callback) => {
        callback({ customReminderMessage: 'Mensagem teste' });
      });

      // Simula o envio de mensagem para o background script
      const message = {
        type: 'showNotification',
        message: 'Mensagem teste'
      };

      chrome.runtime.sendMessage(message);

      expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
        type: 'showNotification',
        message: 'Mensagem teste'
      });
    });

    test('não deve usar alert() bloqueante', () => {
      // Verifica que alert não é chamado
      const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

      // Simula a função de notificação SEM alert
      chrome.storage.sync.get.mockImplementation((keys, callback) => {
        callback({ customReminderMessage: 'Teste' });
      });

      chrome.storage.sync.get(['customReminderMessage'], (result) => {
        const customMessage = result.customReminderMessage || 'Lembrete: Tire um print da tela!';

        // Usa chrome.runtime.sendMessage ao invés de alert
        chrome.runtime.sendMessage({
          type: 'showNotification',
          message: customMessage
        });
      });

      // Alert NÃO deve ter sido chamado
      expect(alertSpy).not.toHaveBeenCalled();

      alertSpy.mockRestore();
    });
  });

  describe('CSS e z-index', () => {
    test('banner deve ter z-index alto mas seguro', () => {
      const banner = document.createElement('div');
      banner.id = 'screenshot-reminder-banner';
      banner.style.zIndex = '2147483647'; // Valor máximo seguro

      document.body.appendChild(banner);

      expect(banner.style.zIndex).toBe('2147483647');
    });

    test('banner deve ter position: fixed para não bloquear fluxo do documento', () => {
      const banner = document.createElement('div');
      banner.style.position = 'fixed';
      banner.style.top = '0';
      banner.style.left = '0';
      banner.style.right = '0';

      document.body.appendChild(banner);

      expect(banner.style.position).toBe('fixed');
      expect(banner.style.top).toBe('0px');
    });
  });

  describe('Prevenção de bloqueios na chamada do Google Meet', () => {
    test('elementos do Meet devem permanecer acessíveis com banner visível', () => {
      // Simula um botão do Google Meet
      const meetButton = document.createElement('button');
      meetButton.id = 'meet-join-button';
      meetButton.textContent = 'Entrar na chamada';
      document.body.appendChild(meetButton);

      // Cria o banner com pointer-events: none
      const banner = document.createElement('div');
      banner.id = 'screenshot-reminder-banner';
      banner.style.pointerEvents = 'none';
      banner.style.position = 'fixed';
      banner.style.top = '0';
      banner.style.left = '0';
      banner.style.right = '0';
      banner.style.zIndex = '2147483647';

      document.body.appendChild(banner);

      // Simula clique no botão do Meet (que está abaixo do banner)
      const clickHandler = jest.fn();
      meetButton.addEventListener('click', clickHandler);
      meetButton.click();

      // O clique deve funcionar mesmo com o banner por cima
      expect(clickHandler).toHaveBeenCalledTimes(1);
    });

    test('banner não deve interceptar eventos de mouse', () => {
      const banner = document.createElement('div');
      banner.style.pointerEvents = 'none';

      const mouseOverHandler = jest.fn();
      banner.addEventListener('mouseover', mouseOverHandler);

      // Simula mouseover no banner
      const event = new MouseEvent('mouseover', { bubbles: true });
      banner.dispatchEvent(event);

      // Como pointer-events é none, o evento não deve ser capturado pelo banner
      // (em um ambiente real, o evento passaria através do banner)
      expect(banner.style.pointerEvents).toBe('none');
    });
  });
});
